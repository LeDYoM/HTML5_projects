(function()
{
    var loader = cns("sfme.internals");
    var log = cns("sfme.log");
    var this_ = this;
    this.ready = false;
    this.vshaders = [];
    this.fshaders = [];
    this.shaderPrograms = [];
    var gl = null;
    
    
    this.init = function(gl_)
    {
        gl = gl_;
        this.vshaders["standard"] = this.loadShaderFromDocument("shader-vs");
        this.fshaders["standard"] = this.loadShaderFromDocument("shader-fs");
        this.shaderPrograms["standard"] = createProgram("standard","standard");
        useProgram("standard");
        
        this.ready = true;
    };
    
    function createProgram(vShaderIndex,fShaderIndex)
    {
        var fragmentShader = this_.fshaders[fShaderIndex];
        var vertexShader = this_.vshaders[vShaderIndex];

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
    
    this.loadShaderFromFile = function(fName,type)
    {
        loader.loadFile(fName, function(shaderSource)
        {
            log.debug(shaderSource);
            return this_.loadShaderFromSource(type,shaderSource);
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
