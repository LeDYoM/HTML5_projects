(function()
{
    var loader = cns("sfme.internals");
    var log = cns("sfme.log");
    var this_ = this;
    this.ready = false;
    this.vshaders = [];
    this.fshaders = [];
    
    this.init = function(gl)
    {
        this.vshaders.push({id:"standard",shader:this.loadShaderFromDocument(gl,"shader-vs")});
        this.fshaders.push({id:"standard",shader:this.loadShaderFromDocument(gl,"shader-fs")});
        this.ready = true;
    };
    
    this.loadShaderFromFile = function(fName,type)
    {
        loader.loadFile(fName, function(shaderSource)
        {
            log.debug(shaderSource);
            return this.loadShaderFromSource(gl,type,shaderSource);
        });
    };
    
    function createFragmentShader(gl)
    {
        var shader  = gl.createShader(gl.FRAGMENT_SHADER);
        return shader;
    }
    
    function createVertexShader(gl)
    {
        var shader = gl.createShader(gl.VERTEX_SHADER);
        return shader;
    }
    
    function createShaderFromSource(gl,shader,source)
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
    
    this.loadShaderFromDocument = function(gl, id)
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
        
        return this.loadShaderFromSource(gl,shaderScript.type,str);
    };
    
    this.loadShaderFromSource = function(gl,type,sourceCode)
    {
        var shader;
        if (type === "x-shader/x-fragment")
        {
            shader = createFragmentShader(gl);
        }
        else if (type === "x-shader/x-vertex")
        {
            shader = createVertexShader(gl);
        } else
        {
            return null;
        }

        return createShaderFromSource(gl, shader,sourceCode);
    };
}
).apply(cns("sfme.internals.shaderManager"));
