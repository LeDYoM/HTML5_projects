// Static drawing object.

var JE = JE || {};

/*
JE.Drawing = JE.Drawing || function()
{
    var doDraw = doDraw || {};

    function draw(obj,context)
    {
        doDraw[obj.group][obj.type](obj, context);
    }
    
    function setFont(font,context)
    {
        context.context.font = font.fontType;
        context.context.textAlign = font.textAlign;
        context.context.textBaseline = font.textBaseline;
        
    }

    function textLabel(obj,context)
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

    function quad(obj,context)
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
    
    function button(obj, context)
    {
        quad(obj.quad,context);
        textLabel(obj.textLabel,context);
    }
    
    JE.Drawing.prototype.draw = draw;
    doDraw.core = {
        textLabel: textLabel,
        quad: quad,
        background: quad
     };
     
     doDraw.ui = {
       button: button  
     };
};
*/
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
                activeScene[i].render();
            }
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
        setInterval(Render, 25);
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
