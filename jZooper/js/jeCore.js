// Static drawing object.

var JE = JE || {};

// Main Core object.
JE.Core = JE.Core || function ()
{
    // Private properties
    var activeScene = null;
    var renderContext = null;
    var configDefinitions = null;
    var useConfig = null;
    var mem = null;

    function initEnvironment(canvas)
    {
        configDefinitions = {
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
            viewPort: configDefinitions.viewPort
        };

        mem = new JE.MetaElementsManager(renderContext.context);
        useConfig = useConfig || configDefinitions;
        setCanvasSize(canvas, useConfig.width, useConfig.height);        
    }

    function setCanvasSize(canvas,w,h)
    {
        canvas.width = w;
        canvas.height = h;
    }

    function Render()
    {
        if (activeScene)
        {
            for (i in activeScene)
            {
                activeScene[i].update();
            }
        }
    }

    function Start()
    {
        //Create a canvas
        var canvas = document.createElement("canvas");
        document.getElementById("canvas").appendChild(canvas);      

        initEnvironment(canvas);
        console.log("Canvas size: ("+canvas.width+","+canvas.height+")");
        
        // Start the system.
//        setInterval(Render, 25);
        setTimeout(Render, 25);
    }

    function acquireObject(obj)
    {
        return ObjectUtils.clone(obj);
    }

    function setActiveScene(scene)
    {
        activeScene = mem.preprocessElementArray(acquireObject(scene));
    }

    // Publish public methods.
    this.Start = Start;
    this.setActiveScene = setActiveScene;
};
