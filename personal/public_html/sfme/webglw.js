(function()
{
    var gl;
    var glActive = false;
    var this_ = this;
    var log = cns("sfme.log");
    var sManager = cns("sfme.internals.shaderManager");
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
            gl = this.canvas.getContext("webgl");
            glActive = !!gl;
            gl.viewportWidth = this.canvas.width;
            gl.viewportHeight = this.canvas.height;
        } catch(e) {
        }
    
        return glActive;
    }

    function webGLStart()
    {
        initGL();
        initShaders();
        initBuffers();

        if (glActive)
        {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
        }
        return glActive;
    }

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
        startFrameLoop();
    };

    var requestId = 0;

    function startFrameLoop()
    {
        initBuffers();
        requestId = window.requestAnimationFrame(this_.updateFrame);
    }
    
    function stopFrameLoop()
    {
        window.cancelFrameRequest(requestId);
    }
   
    this.updateFrame = function()
    {
	// Clear the canvas
        var time = Date.now();

        drawScene();
  	gl.flush();
	
	// Request another frame
	requestId = window.requestAnimationFrame(this_.updateFrame);
    };
    
    function createCanvas(parent,id_,w_,h_)
    {
        var temp = document.createElement("canvas");
        temp.id = id_;
        temp.width = w_;
        temp.height = h_;
        parent.appendChild(temp);
        return temp;
    }    

    var shaderProgram;

    function initShaders()
    {
        sManager.init(gl);
        return;
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }


    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }

    this.createObject = function(numVertex,vertex,colors)
    {
        var obj = {};
        obj.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
        obj.vertexPositionBuffer.itemSize = 3;
        obj.vertexPositionBuffer.numItems = numVertex;

        obj.vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        obj.vertexColorBuffer.itemSize = 4;
        obj.vertexColorBuffer.numItems = numVertex;

        return obj;
    };
    
    var scene = [];

    function initBuffers() 
    {
        scene.push(this_.createObject(3,
        [
             0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ],
        [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ]
        ));

        scene.push(this_.createObject(4,
        [
             1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ],
        [
            0.5, 0.5, 1.0, 1.0,
            0.5, 0.5, 1.0, 1.0,
            0.5, 0.5, 1.0, 1.0,
            0.5, 0.5, 1.0, 1.0
        ]
        ));

    }

    function renderObj(obj)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, obj.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, obj.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, obj.vertexPositionBuffer.numItems);        
    }

    function drawScene()
    {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
        mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
        
        for (var i=0;i<scene.length;++i)
        {
            renderObj(scene[i]);
        }
    }    
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
