(function()
{
    var utils = cns("sfme.utils");
    var log = cns("sfme.log");
    var wgl = cns("sfme.internals.webgl");
    var pManager = cns("sfme.internals.programmanager");
    var scnManager =cns("sfme.internals.sceneManager");
    var tManager = cns("sfme.internals.textureManager");
    this.ready = false;
   
    this.init = function(options)
    {
        options = options || { };
        var t = utils.typeName(options.container);
        
        if (utils.isType(options.container, "HTMLDivElement"))
        {
            // Start main loop
            wgl.init(options);
        }
        else
        {
            // There is no canvas object. Let's create it.
            log.verbose("Error in options.container:"+options.container);
        }
        
        scnManager.init();
        tManager.init();
        pManager.init();

        pManager.loadProgram("example2","example2.json");
        
        this.ready = true;
        
        startFrameLoop();
    };
    
    var requestId = 0;

    function updateFrame()
    {
        wgl.startRender();
        scnManager.renderScene();
        wgl.endRender();
        
        startFrameLoop();
    }

    function startFrameLoop()
    {
        requestId = window.requestAnimationFrame(updateFrame);
    }
    
    function stopFrameLoop()
    {
        window.cancelFrameRequest(requestId);
    }
}
).apply(cns("sfme.core"));
