(function()
{
    var loader = cns("sfme.internals");
    var log = cns("sfme.log");
    var this_ = this;
    this.ready = false;
    this.vshaders = [];
    this.fshaders = [];
    this.shaderPrograms = [];
    this.activeShader = null;
    var gl = null;
    
    this.init = function(gl_)
    {
        gl = gl_;

        return new Promise(function(resolve,reject)
        {
            this_.loadShadersFromFile(["sfme/shaders/standard.vs", "sfme/shaders/standard.fs"],
                ["x-shader/x-vertex","x-shader/x-fragment"]).then(
                function(values)
                {
                    log.debug("Shaders loaded");
                    this_.shaderPrograms["standard"] = createProgram(values[0],values[1]);
                    useProgram("standard");
                    this_.enableShader("standard");
                    log.debug("standard shader:"+this_.activeShader);

                    this_.ready = true;
                    resolve();
                },
                function ()
                {
                    reject();
                });
        });
    };
    
    this.enableShader = function(id)
    {
        this.activeShader = this.shaderPrograms[id] || null;
    };
    
    this.activateVertexShader = function(obj)
    {
        if (this.activeShader)
        {
            gl.vertexAttribPointer(this.activeShader.vertexPositionAttribute, obj.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }
    };
    
    this.activateFragmentShader = function(obj)
    {
        if (this.activeShader)
        {
            gl.vertexAttribPointer(this.activeShader.vertexColorAttribute, obj.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }
    };
    
    this.setUniforms = function(pMatrix,mvMatrix)
    {
        if (this.activeShader)
        {
            gl.uniformMatrix4fv(this.activeShader.pMatrixUniform, false, pMatrix);
            gl.uniformMatrix4fv(this.activeShader.mvMatrixUniform, false, mvMatrix);
        }
    };
 
    function createProgram(vertexShader,fragmentShader)
    {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        return shaderProgram;
    }
    
    function useProgram(programIndex)
    {
        var shaderProgram = this_.shaderPrograms[programIndex];
        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }
    
    this.loadShadersFromFile = function(fNameList,typeList)
    {
        var prArray = [];

        for (var i=0;i<fNameList.length;++i)
        {
            prArray.push(this.loadShaderFromFile(fNameList[i],typeList[i]));
        }
 
        return Promise.all(prArray);
    };
    
    this.loadShaderFromFile = function(fName,type)
    {
        return new Promise(function(resolve, reject)
        {
            loader.loadFile(fName).then(function(shaderSource)
            {
                log.debug(shaderSource);
                var shader = this_.loadShaderFromSource(type,shaderSource);
                resolve(shader);
            },
            function() { reject(); });
        });
    };
    
    function createFragmentShader()
    {
        var shader  = gl.createShader(gl.FRAGMENT_SHADER);
        return shader;
    }
    
    function createVertexShader()
    {
        var shader = gl.createShader(gl.VERTEX_SHADER);
        return shader;
    }
    
    function createShaderFromSource(shader,source)
    {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    
    this.loadShaderFromDocument = function(id)
    {
        var shaderScript = document.getElementById(id);
        if (!shaderScript)
        {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k)
        {
            if (k.nodeType === 3)
            {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        
        return this.loadShaderFromSource(shaderScript.type,str);
    };
    
    this.loadShaderFromSource = function(type,sourceCode)
    {
        var shader;
        if (type === "x-shader/x-fragment")
        {
            shader = createFragmentShader();
        }
        else if (type === "x-shader/x-vertex")
        {
            shader = createVertexShader();
        }
        else
        {
            return null;
        }

        return createShaderFromSource(shader,sourceCode);
    };
}
).apply(cns("sfme.internals.shaderManager"));
