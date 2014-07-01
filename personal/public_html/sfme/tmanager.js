(function()
{
    "use strict";
    var ready = false;
    var wgl = cns("sfme.internals.webgl");
    var dummyTextureDefinition = {
        id: "dummyTexture",
        type: "canvas",
        backgroundColor: "white",
        width: 1,
        height: 1
    };
    
    this.init = function()
    {
        loadTexture("",dummyTextureDefinition).then(function() { ready=true; });
    };

    function loadTexture(baseDir,tObject)
    {
        var type = tObject.type || "undefined";
        var pr = null;
        
        switch (type)
        {
            case "image":
                tObject.textureObject = wgl.createTexture();
                tObject.image = new Image();

                pr = new Promise(function(resolve,reject)
                {
                    tObject.image.onload = function ()
                    {
                        wgl.handleLoadedTexture(tObject.textureObject,tObject.image);
                        tObject.ready = true;
                        resolve(tObject);
                    };
                    tObject.image.onerror = function()
                    {
                        reject();
                    };
                });
                tObject.image.src = baseDir + tObject.src;
                return pr;
                break;
            case "text":
            case "canvas":
                pr = new Promise(function(resolve,reject)
                {
                    tObject.canvas = document.createElement("canvas");
                    tObject.context = tObject.canvas.getContext("2d");
                    tObject.canvas.width = tObject.width || 1;
                    tObject.canvas.height = tObject.height || 1;
                    var ctx = tObject.context;

                    ctx.save();

                    if (!tObject.backgroundColor)
                    {
                        tObject.backgroundColor = "#00000000";
                    }
                    ctx.fillStyle = tObject.backgroundColor;
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    if (type === "text")
                    {
                        drawText(tObject.textDefinition,ctx);
                    }
                    ctx.restore();
                    tObject.textureObject = wgl.createTexture();
                    wgl.handleLoadedTexture(tObject.textureObject,tObject.canvas);
                    tObject.ready = true;
                    resolve(tObject);                    
                });
                return pr;
                break;
        }
    };
    this.loadTexture = loadTexture;
    
    function drawText(tDef,ctx)
    {
        ctx.font = tDef.fontSize + "px "+tDef.fontName;

        ctx.textAlign = tDef.textAlign || "center";
        ctx.textBaseline = tDef.textBaseLine || "middle";

        var fill = tDef.fillStyle || false;
        if (fill)
        {
            ctx.fillStyle = tDef.fillStyle;
            ctx.fillText(tDef.text, tDef.textPosition[0], tDef.textPosition[1]);
        }

        var stroke = tDef.strokeStyle || false;
        if (stroke)
        {
            ctx.strokeStyle = tDef.strokeStyle;
            ctx.lineWidth = tDef.lineWidth | 1;
            ctx.strokeText(tDef.text, tDef.textPosition[0], tDef.textPosition[1]);
        }
    }
        
    function getDummyTexture(obj)
    {
        obj.material.texture = dummyTextureDefinition;
    }
    this.getDummyTexture = getDummyTexture;
}
).apply(cns("sfme.internals.textureManager"));
