(function()
{
    "use strict";
    var this_ = this;
    var ready = false;
    var wgl = cns("sfme.internals.webgl");
    var tManager = cns("sfme.internals.textureManager");
    var log = cns("sfme.log");
    var activeScene = null;

    this.init = function()
    {
        ready = true;
    };
    
    function defineScene(sceneDefinition)
    {
        var newScene = sceneDefinition;
        
        try
        {
            // TODO: Generate sceneId.
            newScene.sceneId = 0;
            newScene.ready = false;

            if (newScene.resources)
            {
                if (newScene.resources.textures)
                {
                    for (var i=0;i<newScene.resources.textures.length;++i)
                    {
                        tManager.loadTexture(newScene.resources.textures[i]);
                    }
                }
                else
                {
                    log.verbose("No textures in scene");
                }
            }
            else
            {
                log.verbose("No resources in scene");
            }

            for (var i=0;i<newScene.objects.length;++i)
            {
                wgl.createObject(newScene.objects[i]);
                if (newScene.objects[i].texture)
                {
                    tManager.getTexture(newScene,newScene.objects[i]);
                }
            }
            if (!activeScene)
            {
                activeScene = newScene;
            }
        } catch (e)
        {
            throw ("Error creating scene:"+e);
        }
    }
    this.defineScene = defineScene;

    function renderScene()
    {
        if (activeScene)
        {
            for (var i=0;i<activeScene.objects.length;++i)
            {
                wgl.renderObj(activeScene.objects[i]);
            }
        }
    }
    this.renderScene = renderScene;
}
).apply(cns("sfme.internals.sceneManager"));
