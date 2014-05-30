
(function()
{
    var utils = cns("sfme.utils");
    var log = cns("sfme.log");
    var wgl = cns("sfme.internals.webgl");
    var pManager = cns("sfme.internals.programmanager");
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
        
        pManager.init();
        pManager.loadProgram("example1","example1.json");
        
        this.ready = true;
    };
    
}
).apply(cns("sfme.core"));
