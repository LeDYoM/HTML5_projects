// Main Core object.
function JECore()
{
    // Private properties
    var that_ = this;
    var activeScene;
    var programData = null;
    
    var configDefinitions = useConfig = {
        width: 768,
        height: 1280,
        useTouch: true,
        viewPort:
        {
            width: 768,
            height: 1280
        }
    };

    function initEnvironment (canvas)
    {
        renderContext =
        {
            context: canvas.getContext("2d"),
            viewPort: configDefinitions.viewPort
        };

        mem = new JE.MetaElementsManager(renderContext.context);
        JE.Drawing.context = renderContext.context;
        setCanvasSize(canvas, useConfig.width, useConfig.height);        
    };

    function setCanvasSize(canvas,w,h)
    {
        canvas.width = w;
        canvas.height = h;
    }

    function Render()
    {
        console.log(activeScene);
        if (activeScene)
        {
            for (i in activeScene)
            {
                activeScene[i].update();
            }
        }
    }
    
    function nextScene()
    {
        if (programData.nextScene)
        {
            var scene = programData.nextScene();
            console.log(scene);
            setActiveScene(scene);
        }
    };

    this.Start = function ()
    {
        privateStart();
    };
    
    function privateStart()
    {
        //Create a canvas
        var canvas = document.createElement("canvas");
        document.getElementById("canvas").appendChild(canvas);      
        initEnvironment(canvas);
        console.log("Canvas size: ("+canvas.width+","+canvas.height+")");

        nextScene();

        // Start the system.
//        setInterval(Render, 25);
        setTimeout(
                function ()
                {
                    if (activeScene)
                    {
                        for (i in activeScene)
                        {
                            activeScene[i].update();
                        }
                    }
                }
                , 25);
    };

    function acquireObject(obj)
    {
        return ObjectUtils.clone(obj);
    }

    function setActiveScene(scene)
    {
        activeScene = mem.preprocessElementArray(acquireObject(scene));
    };
    
    this.setProgramData = function(pData)
    {
        programData = acquireObject(pData);
    };
};
