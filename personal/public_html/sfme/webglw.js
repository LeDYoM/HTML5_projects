(function()
{
    var gl;
    var glActive = false;
    function initGL(canvas) 
    {
        try {
            gl = canvas.getContext("webgl");
            glActive = !!gl;
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch(e) {
        }
    
        return glActive;
    }

    function webGLStart(canvasObject)
    {
        initGL(canvasObject);
        //initShaders();
        //initBuffers();

        if (glActive)
        {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);

            //drawScene();
        }
        return glActive;
    }

    this.init = function(canvasObject)
    {
        webGLStart(canvasObject);
    };
}
).apply(cns("sfme.internals.webgl"));
