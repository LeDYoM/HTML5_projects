(function()
{
    this.byId =  function(id_)
    {
        return document.getElementById(id_);
    };
    this.byClass = function(class_)
    {
        return document.getElementsByClassName(class_);
    };
    this.byTag = function(class_)
    {
        // Warning: this method returns an array.
        return document.getElementsByTagName(class_);
    };
    this.on = function(id_,event_,callback_)
    {
        var elem = null;
        if (typeof id_ === 'object')
        {
            elem = id_;
        }
        else
        {
            elem = this.byId(id_);
            if (!elem)
            {
                elem = this.byClass(id_);
                if (!elem)
                {
                    elem = this.byTag(id_);
                    if (elem)
                    {
                        elem = elem[0];
                    }
                }
            }
        }

        if (elem)
        {
            elem.addEventListener(event_,callback_);
        }
        return elem;
    };
    this.isObject = function(obj)
    {
        return (typeof obj === "obj");
    };
    this.typeName = function(obj)
    {
        return Object.prototype.toString.call(obj).slice(8, -1);        
    };
    this.isType = function(obj,typeName)
    {
        return this.typeName(obj) === typeName;
    };
}
).apply(cns("sfme.utils"));

(function()
{
    this.verbose =  function(text)
    {
        window.console.log(text);
    };
}
).apply(cns("sfme.log"));

(function()
{
    
}
).apply(cns("sfme.internals.mainLoop"));

(function()
{
    var utils = cns("sfme.utils");
    var log = cns("sfme.log");
    
    this.ready = false;
    this.canvas = null;
    this.capabilities = { };

    function checkStoreCapabilities(canvasObject, capabilitiesObject)
    {
        var tempCanvas = document.createElement("canvas");
        capabilitiesObject.canvasSupport = tempCanvas !== null;
        log.verbose("canvas available..."+(capabilitiesObject.canvasSupport ? "Ok" : "Failed"));
        
        var tempContext = tempCanvas.getContext("2d");
        capabilitiesObject.canvas2d =  tempContext !== null;
        log.verbose("canvas 2d..."+(capabilitiesObject.canvas2d ? "Ok" : "Failed"));
        
        capabilitiesObject.text2d = capabilitiesObject.canvas2d && true;//tempContext.fillText === "Function";
        log.verbose("canvas 2d text..."+(capabilitiesObject.text2d ? "Ok" : "Failed"));

        // Create a new temp canvas.
        tempCanvas = document.createElement("canvas");
        capabilitiesObject.webGL = tempCanvas.getContext("webgl") !== null;
        log.verbose("canvas webGL..."+(capabilitiesObject.webGL ? "Ok" : "Failed"));
    }
    this.init = function(options)
    {
        options = options || { };
        var t = utils.typeName(options.container);
        
        if (utils.isType(options.container, "HTMLDivElement"))
        {
            // Set properties or defaults...
            options.width = options.width || 800;
            options.height = options.height || 600;
            
            log.verbose("Going to create canvas under element "+options.container+"...");
            log.verbose("Canvas size will be: "+options.width+"X"+options.height);
            this.canvas = createCanvas(options.container,"canvas", options.width, options.height);
            
            log.verbose("Object canvas created...");
            log.verbose("Retrieving capabilities...");
            checkStoreCapabilities(this.canvas, this.capabilities);
            
            // Start main loop
        }
        else
        {
            // There is no canvas object. Let's create it.
            log.verbose("Error in options.container:"+options.container);
        }
        this.ready = true;
    };

    this.doSomething = function()
    {
        alert("works!");
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
}
).apply(cns("sfme.core"));
