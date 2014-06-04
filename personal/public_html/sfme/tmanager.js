(function()
{
    "use strict";
    var ready = false;
    var wgl = cns("sfme.internals.webgl");
    
    this.init = function(gl_)
    {
        ready = true;
    }
    
    function loadTexture(tObject)
    {
        tObject.texture = wgl.createTexture();
        tObject.texture.image = new Image();

        var pr = new Promise(function(resolve,reject)
        {
            tObject.texture.image.onload = function ()
            {
                wgl.handleLoadedTexture(tObject.texture);
                tObject.texture.ready = true;
                resolve(tObject);
            };
            tObject.texture.image.onerror = function()
            {
                reject();
            };
        });
        tObject.texture.image.src = tObject.src;
        return pr;

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
