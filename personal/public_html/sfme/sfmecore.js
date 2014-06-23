(function()
{
    var utils = cns("sfme.utils");
    var log = cns("sfme.log");
    var wgl = cns("sfme.internals.webgl");
    var pManager = cns("sfme.internals.programmanager");
    var scnManager =cns("sfme.internals.sceneManager");
    var tManager = cns("sfme.internals.textureManager");
    var eManager = cns("sfme.internal.eventManager");
    var iManager = cns("sfme.internal.inputManager");

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
        
        iManager.init();
        eManager.init();
        scnManager.init();
        tManager.init();
        pManager.init();

        pManager.loadProgram("ssnake","ssnake.json");
        
        this.ready = true;
        globalTiming.startTime = new Date().getTime();
        
        startFrameLoop();
    };
    
    var requestId = 0;
    var globalTiming = {
        startTime:0,
        lastFrame:0,
        ellapsed:0,
        currentTime:0
    }

    function updateFrame()
    {
        globalTiming.currentTime = new Date().getTime();
        globalTiming.ellapsed = globalTiming.currentTime - globalTiming.lastFrame;
        globalTiming.lastFrame = globalTiming.currentTime;
        scnManager.updateFrame(globalTiming);
        iManager.clearInputBuffers();
        
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
