// Static drawing object.

var JE = JE || {};

// Main Core object.
JE.Core = function ()
{
    // Private properties
    var activeScene = null;
    var defaultDrawProperties = null;
    var renderContext = null;
    var configDefinitions = null;
    var useConfig = null;

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

        useConfig = useConfig || configDefinitions;

        defaultDrawProperties = {
            defaultText: {
                x: 0,
                y: 0,
                font:
                {
                    fontType: "30 Calibri",
                    textAlign:"left",
                    textBaseline: "top"
                },
                fill: true,
                fillStyle: "red",
                fore: false
            },
            defaultBackground: {
                x: 0,
                y: 0,
                width: renderContext.viewPort.width,
                height: renderContext.viewPort.height,
                fill: true,
                fore: false,
                fillStyle: "black"
            }
        };

        setCanvasSize(canvas, useConfig.width, useConfig.height);        
    }

    function setCanvasSize(canvas, w,h)
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
                var obj = activeScene[i];
                switch (obj.type)
                {
                    case "textLabel":
                        drawText(obj, renderContext);
                        break;
                    case "background":
                        drawQuad(obj, renderContext);
                        break;
                }
            }
        }
    }

    function setFont(font,context)
    {
        context.context.font = font.fontType;
        context.context.textAlign = font.textAlign;
        context.context.textBaseline = font.textBaseline;
        
    }
    
    function drawText(obj,context)
    {
        setFont(obj.font,context);

        prepareCommonDrawConfig(obj, context);
        
        if (obj.fill)
        {
            context.context.fillText(obj.text || "No text", obj.x || 0, obj.y || 0);
        }

        if (obj.fore)
        {
            context.context.strokeText(obj.text || "No text", context.viewPort.getPixelPositionX(obj.x || 0), context.viewPort.getPixelPositionY(obj.y || 0));
        }
    }

    function drawQuad(obj,context)
    {

        context.context.beginPath();        
        context.context.rect(
                context.viewPort.getPixelPositionX(obj.x || 0),
                context.viewPort.getPixelPositionY(obj.y || 0),
                context.viewPort.getPixelPositionX(obj.width || 0),
                context.viewPort.getPixelPositionY(obj.height || 0));
 
        context.context.closePath();
        prepareCommonDrawConfig(obj, context);

        if (obj.fill)
        {
            context.context.fill();
        }

        if (obj.fore)
        {
            context.context.stroke();
        }
    }

    function prepareCommonDrawConfig(obj, context)
    {
        if (obj.fill)
        {
            context.context.fillStyle = obj.fillStyle;
        }
        
        if (obj.fore)
        {
            context.context.lineWidth = obj.lineWidth;
            context.context.strokeStyle = obj.strokeStyle;
        }
    }

    function Start()
    {
        //Create a canvas
        var canvas = document.createElement("canvas");
        document.getElementById("canvas").appendChild(canvas);      

        console.log("Canvas size: ("+canvas.width+","+canvas.height+")");
        
        initEnvironment(canvas);
        
        // Start the system.
        setTimeout(Render, 25);
    }

    function acquireObject(obj)
    {
        return ObjectUtils.clone(obj);
    }
   

    function addDefaultsOrMaintain(obj_)
    {
        console.log(ObjectUtils.toStr(obj_));
        for (i in obj_)
        {
            var obj = obj_[i];
            var requestedDefaults = null;
            switch (obj.type)
            {
                case "textLabel":
                    requestedDefaults = defaultDrawProperties.defaultText;
                    break;
                case "background":
                    requestedDefaults = defaultDrawProperties.defaultBackground;
                    break;
            }
            ObjectUtils.inverseMerge(obj,requestedDefaults);
        }
        
        console.log(ObjectUtils.toStr(obj_));
    }

    function setActiveScene(scene)
    {
        activeScene = acquireObject(scene);
        addDefaultsOrMaintain(activeScene);
    }

    // Publish public methods.
    this.Start = Start;
    this.setActiveScene = setActiveScene;
}
