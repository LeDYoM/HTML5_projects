(function()
{
    "use strict";
    var ready = false;
    var wgl = cns("sfme.internals.webgl");
    
    this.init = function(gl_)
    {
        ready = true;
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
            case "canvas":
            case "text":
                pr = new Promise(function(resolve,reject)
                {
                    tObject.canvas = document.createElement("canvas");
                    tObject.context = tObject.canvas.getContext("2d");
                    tObject.canvas.width = tObject.width || 1;
                    tObject.canvas.height = tObject.height || 1;
                    tObject.texture = wgl.createTexture();
                    
                    if (type === "text")
                    {
                        var tDef = tObject.textDefinition;
                        var ctx = tObject.context;
                        ctx.font = "25px Georgia";
                        ctx.fillStyle = "blue";
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                        // write white text with black border
                        ctx.fillStyle = "white";
                        ctx.lineWidth = 2.5;
                        ctx.strokeStyle = "black";
                        ctx.save();
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        var leftOffset = ctx.canvas.width / 2;
                        var topOffset = ctx.canvas.height / 2;
                        ctx.strokeText(tDef.text, leftOffset, topOffset);
                        ctx.fillText(tDef.text, leftOffset, topOffset);
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
        var id = obj.texture;
        for (var i=0;i<globalObject.resources.textures.length;++i)
        {
            if (globalObject.resources.textures[i].id === id)
            {
                obj.textureObject = globalObject.resources.textures[i].texture;
            }
        }
    }
    this.getTexture = getTexture;
}
).apply(cns("sfme.internals.textureManager"));
