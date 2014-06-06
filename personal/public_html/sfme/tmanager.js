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
                tObject.texture = wgl.createTexture();
                tObject.texture.image = new Image();

                pr = new Promise(function(resolve,reject)
                {
                    tObject.texture.image.onload = function ()
                    {
                        wgl.handleLoadedTexture(tObject.texture,tObject.texture.image);
                        tObject.texture.ready = true;
                        resolve(tObject);
                    };
                    tObject.texture.image.onerror = function()
                    {
                        reject();
                    };
                });
                tObject.texture.image.src = baseDir + tObject.src;
                return pr;
                break;
            case "text":
            case "canvas":
                pr = new Promise(function(resolve,reject)
                {
                    tObject.canvas = document.createElement("canvas");
                    tObject.context = tObject.canvas.getContext("2d");
                    var ctx = tObject.context;
                    tObject.canvas.width = tObject.width || 1;
                    tObject.canvas.height = tObject.height || 1;
                    tObject.texture = wgl.createTexture();
                    if (tObject.backgroundColor)
                    {
                        ctx.fillStyle = tObject.backgroundColor;
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    }

                    if (type === "text")
                    {
                        var tDef = tObject.textDefinition;
                        ctx.save();
                        ctx.font = tDef.fontSize + "px "+tDef.fontName;
                       
                        var fill = tDef.fillStyle || false;
                        if (fill)
                        {
                            ctx.fillStyle = tDef.fillStyle;
                        }
                        
                        var stroke = tDef.strokeStyle || false;
                        if (stroke)
                        {
                            ctx.strokeStyle = tDef.strokeStyle;
                            ctx.lineWidth = tDef.lineWidth | 1;
                        }

                        ctx.textAlign = tDef.textAlign || "center";
                        ctx.textBaseline = tDef.textAlign || "textBaseline";

                        // write white text with black border
                        ctx.fillStyle = "white";
                        ctx.lineWidth = 2.5;
                        ctx.strokeStyle = "black";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.strokeText(tDef.text, tDef.textPosition[0], tDef.textPosition[1]);
                        ctx.fillText(tDef.text, tDef.textPosition[0], tDef.textPosition[1]);
                        ctx.restore();
                    }
                    wgl.handleLoadedTexture(tObject.texture,tObject.canvas);
                    tObject.texture.ready = true;
                    resolve(tObject);                    
                });
                return pr;
                break;
        }
    };
    this.loadTexture = loadTexture;
    
    function getTexture(globalObject,obj)
    {
        var id = obj.material.texture;
        for (var i=0;i<globalObject.resources.textures.length;++i)
        {
            if (globalObject.resources.textures[i].id === id)
            {
                obj.material.textureObject = globalObject.resources.textures[i].texture;
            }
        }
    }
    this.getTexture = getTexture;
    
    function getDummyTexture(obj)
    {
        obj.material.textureObject = dummyTextureDefinition.texture;
    }
    this.getDummyTexture = getDummyTexture;
}
).apply(cns("sfme.internals.textureManager"));
