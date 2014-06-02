(function()
{
    "use strict";
    var loader = cns("sfme.internals");
    var log = cns("sfme.log");
    var this_ = this;
    var ready = false;
    var shaderPrograms = [];
    var activeShader = null;
    var gl = null;
    
    function isReady()
    {
        return ready;
    }
    this.isReady = isReady;
    
    this.init = function(gl_)
    {
        gl = gl_;

        return new Promise(function(resolve,reject)
        {
            loadShadersFromFile(["sfme/shaders/standard.vs", "sfme/shaders/standard.fs"],
                ["x-shader/x-vertex","x-shader/x-fragment"]).then(
                function(values)
                {
                    log.debug("Shaders loaded");
                    shaderPrograms["standard"] = createProgram(values[0],values[1]);
                    useProgram("standard");
                    enableShader("standard");
                    log.debug("standard shader:"+activeShader);

                    ready = true;
                    resolve();
                },
                function ()
                {
                    reject();
                });
        });
    };
    
    function enableShader(id)
    {
        activeShader = shaderPrograms[id] || null;
    };
    
    function activateVertexShader(obj)
    {
        if (activeShader)
        {
            gl.vertexAttribPointer(activeShader.vertexPositionAttribute, obj.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }
    };
    
    function activateFragmentShader(obj)
    {
        if (activeShader)
        {
            gl.vertexAttribPointer(activeShader.vertexColorAttribute, obj.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }
    };

    function setUniforms(pMatrix,mvMatrix)
    {
        if (activeShader)
        {
            gl.uniformMatrix4fv(activeShader.pMatrixUniform, false, pMatrix);
            gl.uniformMatrix4fv(activeShader.mvMatrixUniform, false, mvMatrix);
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
        var shaderProgram = shaderPrograms[programIndex];
        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }
    
    function loadShadersFromFile(fNameList,typeList)
    {
        var prArray = [];

        for (var i=0;i<fNameList.length;++i)
        {
            prArray.push(loadShaderFromFile(fNameList[i],typeList[i]));
        }
 
        return Promise.all(prArray);
    };
    
    function loadShaderFromFile(fName,type)
    {
        return new Promise(function(resolve, reject)
        {
            loader.loadFile(fName).then(function(shaderSource)
            {
                log.debug(shaderSource);
                var shader = loadShaderFromSource(type,shaderSource);
                resolve(shader);
            },
            function() { reject(); });
        });
    }
    
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
    
    function loadShaderFromDocument(id)
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
        
        return loadShaderFromSource(shaderScript.type,str);
    }
    
    function loadShaderFromSource(type,sourceCode)
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
    }
    
    this.activateVertexShader = activateVertexShader;
    this.activateFragmentShader = activateFragmentShader;
    this.setUniforms = setUniforms;

}
).apply(cns("sfme.internals.shaderManager"));
