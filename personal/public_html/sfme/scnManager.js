(function()
{
    "use strict";
    var this_ = this;
    var ready = false;
    var wgl = cns("sfme.internals.webgl");
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

            for (var i=0;i<newScene.objects.length;++i)
            {
                wgl.createObject(newScene.objects[i]);

            }
            if (!activeScene)
            {
                activeScene = newScene;
            }
        } catch (e)
        {
            throw ("Error creating scene:"+e);
        }
        return newScene;
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
