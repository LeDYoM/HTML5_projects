// Main Core object.
function JECore()
{
    // Private properties
    var that_ = this;
    var programData = null;
    var activeScene = null;
    var renderContext = null;
    var mem = null;

    function initEnvironment (canvas)
    {
        that_.configDefinitions = {
            width: 768,
            height: 1280,
            useTouch: true,
            viewPort:
            {
                width: 768,
                height: 1280,
                getPixelPositionX: function(x)
                {
                    return x / (this.width / canvas.width);
                },
                getPixelPositionY: function(y)
                {
                    return y / (this.height / canvas.height);
                }
            }
        };

        renderContext =
        {
            context: canvas.getContext("2d"),
            viewPort: that_.configDefinitions.viewPort
        };

        mem = new JE.MetaElementsManager(renderContext.context);
        JE.Drawing.context = renderContext.context;
        that_.useConfig = that_.useConfig || that_.configDefinitions;
        setCanvasSize(canvas, that_.useConfig.width, that_.useConfig.height);        
    };

    function setCanvasSize(canvas,w,h)
    {
        canvas.width = w;
        canvas.height = h;
    }

    function Render()
    {
        console.log(this);
        if (that_.activeScene)
        {
            for (i in that_.activeScene)
            {
                that_.activeScene[i].update();
            }
        }
    }
    
    that_.nextScene = function ()
    {
        if (that_.programData.nextScene)
        {
            var scene = that_.programData.nextScene();
            console.log(scene);
            that_.setActiveScene(scene);
        }
    };

    this.Start = function ()
    {
        //Create a canvas
        var canvas = document.createElement("canvas");
        document.getElementById("canvas").appendChild(canvas);      
        initEnvironment(canvas);
        console.log("Canvas size: ("+canvas.width+","+canvas.height+")");

        that_.nextScene();
               
        // Start the system.
//        setInterval(Render, 25);
        setTimeout(Render, 25);
    };

    function acquireObject(obj)
    {
        return ObjectUtils.clone(obj);
    }

    that_.setActiveScene = function(scene)
    {
        that_.activeScene = mem.preprocessElementArray(acquireObject(scene));
    };
    
    this.setProgramData = function(pData)
    {
        that_.programData = acquireObject(pData);
    };
};
