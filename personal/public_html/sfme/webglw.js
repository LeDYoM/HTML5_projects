(function()
{
    "use strict";
    var gl;
    var glActive = false;
    var this_ = this;
    var log = cns("sfme.log");
    var sManager = cns("sfme.internals.shaderManager");
    var scnManager = cns("sfme.internals.sceneManager");
    var capabilities = {};
    this.canvas = null;

    function checkStoreCapabilities()
    {
        var tempCanvas = document.createElement("canvas");
        capabilities.canvasSupport = tempCanvas !== null;
        log.verbose("canvas available..."+(capabilities.canvasSupport ? "Ok" : "Failed"));
        
        var tempContext = tempCanvas.getContext("2d");
        capabilities.canvas2d =  tempContext !== null;
        log.verbose("canvas 2d..."+(capabilities.canvas2d ? "Ok" : "Failed"));
        
        capabilities.text2d = capabilities.canvas2d && true;//tempContext.fillText === "Function";
        log.verbose("canvas 2d text..."+(capabilities.text2d ? "Ok" : "Failed"));

        // Create a new temp canvas.
        tempCanvas = document.createElement("canvas");
        capabilities.webGL = tempCanvas.getContext("webgl") !== null;
        log.verbose("canvas webGL..."+(capabilities.webGL ? "Ok" : "Failed"));
    }

    function initGL() 
    {
        try {
            gl = this_.canvas.getContext("webgl");
            glActive = !!gl;
            gl.viewportWidth = this_.canvas.width;
            gl.viewportHeight = this_.canvas.height;
        } catch(e) {
            alert("Error initializing 3d webgl canvas:"+e);
        }
    
        return glActive;
    }

    function webGLStart()
    {
        initGL();
        
        return new Promise(function(resolve,reject)
        {
            sManager.init(gl).then(
            function()
            {
                if (glActive)
                {
                    gl.clearColor(1.0, 0.0, 0.0, 1.0);
                    gl.enable(gl.DEPTH_TEST);
                    resolve();
                }
                else
                {
                    reject();
                }
            },function() {reject();});
        });
    }

    function handleLoadedTexture(texture,data)
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    this.handleLoadedTexture = handleLoadedTexture;

    this.init = function(options)
    {
        // Set properties or defaults...
        options.width = options.width || 800;
        options.height = options.height || 600;

        log.verbose("Going to create canvas under element "+options.container+"...");
        log.verbose("Canvas size will be: "+options.width+"X"+options.height);
        this.canvas = createCanvas(options.container,"canvas", options.width, options.height);

        log.verbose("Object canvas created...");
        log.verbose("Retrieving capabilities...");
        checkStoreCapabilities();

        webGLStart();
    };

    function updateFrame()
    {
        startRender();
        scnManager.renderScene();
        endRender();
    }
    this.updateFrame = updateFrame;
    
    function createCanvas(parent,id_,w_,h_)
    {
        var temp = document.createElement("canvas");
        temp.id = id_;
        temp.width = w_;
        temp.height = h_;
        parent.appendChild(temp);
        return temp;
    }
    
    function createTexture()
    {
        return gl.createTexture();
    }
    this.createTexture = createTexture;

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    function createObject(obj_)
    {
        obj_.numVertex = Math.floor(obj_.vertex.length / 3);
        obj_.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, obj_.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj_.vertex), gl.STATIC_DRAW);
        obj_.vertexPositionBuffer.itemSize = 3;
        obj_.vertexPositionBuffer.numItems = obj_.numVertex;

        obj_.vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, obj_.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj_.colors), gl.STATIC_DRAW);
        obj_.vertexColorBuffer.itemSize = 4;
        obj_.vertexColorBuffer.numItems = obj_.numVertex;

        if (obj_.textureCoords)
        {
            obj_.vertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, obj_.vertexTextureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj_.textureCoords), gl.STATIC_DRAW);
            obj_.vertexTextureCoordBuffer.itemSize = 2;
            obj_.vertexTextureCoordBuffer.numItems = 4;
        }
   }
    this.createObject = createObject;

    function renderObj(obj)
    {
        if (sManager.isReady())
        {
            mvPushMatrix();
            
            if (obj.position)
            {
                mat4.translate(mvMatrix, obj.position);
            }
            var shaderProgram = sManager.getShader(obj.material);
           
            if (shaderProgram.vertexPositionAttribute > -1)
            {
                gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, obj.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            }

            if (shaderProgram.vertexColorAttribute > -1)
            {
                gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexColorBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, obj.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
            }

            if (shaderProgram.textureCoordAttribute > -1 && obj.textureObject && obj.textureObject.ready)
            {
                gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexTextureCoordBuffer);
                gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, obj.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, obj.textureObject);
                gl.uniform1i(shaderProgram.samplerUniform, 0);
            }

            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, obj.vertexPositionBuffer.numItems);
            mvPopMatrix();
        }
    }
    this.renderObj = renderObj;

    var mvMatrixStack = [];
    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length === 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function startRender(backgroundColor,cameraObject)
    {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);

        switch (cameraObject.type)
        {
            case "perspective":
                if (cameraObject.ratio === "normal")
                {
                    cameraObject.realRatio = gl.viewportWidth / gl.viewportHeight;
                }
                else
                {
                    cameraObject.realRatio = cameraObject.ratio;
                }
                mat4.perspective(cameraObject.angle, cameraObject.realRatio, cameraObject.zNear, cameraObject.zFar, pMatrix);
                break;
        }

        mat4.identity(mvMatrix);
    }
    this.startRender = startRender;
       
    function endRender()
    {
  	gl.flush();
    }
    this.endRender = endRender;
}
).apply(cns("sfme.internals.webgl"));

/*
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

        mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
        */

        /*
        triangleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        var vertices = [
             0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        triangleVertexPositionBuffer.itemSize = 3;
        triangleVertexPositionBuffer.numItems = 3;

        triangleVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        var colors = [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        triangleVertexColorBuffer.itemSize = 4;
        triangleVertexColorBuffer.numItems = 3;

        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        var vertices = [
             1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 4;

        squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        var colors = [];
        for (var i=0; i < 4; i++) {
            colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 4;
        squareVertexColorBuffer.numItems = 4;
        */
