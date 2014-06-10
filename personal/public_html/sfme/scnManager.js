(function()
{
    "use strict";
    var this_ = this;
    var ready = false;
    var wgl = cns("sfme.internals.webgl");
    var tManager = cns("sfme.internals.textureManager");
    var log = cns("sfme.log");
    var _ = cns("sfme.types");

    var activeScene = null;

    this.init = function()
    {
        ready = true;
    };
    
    function createObject(resourceObject,obj)
    {
        var vertex = [];
        if (obj.shapeType)
        {
            switch (obj.shapeType)
            {
                case "triangle_normal":
                    var w = obj.width || 1.0;
                    var h = obj.height || 1.0;
                    vertex=vertex.concat(_.scale1([0.0,1.0,0.0],h/2));
                    vertex=vertex.concat(_.scale3v([-1.0,-1.0,0.0],[w/2,h/2,0.0]));
                    vertex=vertex.concat(_.scale3v([1.0,-1.0,0.0],[w/2,h/2,0.0]));
                    break;
                case "quad_normal":
                    var w = obj.width || 1.0;
                    var h = obj.height || 1.0;
                    vertex=vertex.concat(_.scale3v([1.0,1.0,0.0],[w/2,h/2,0.0]));
                    vertex=vertex.concat(_.scale3v([-1.0,1.0,0.0],[w/2,h/2,0.0]));
                    vertex=vertex.concat(_.scale3v([1.0,-1.0,0.0],[w/2,h/2,0.0]));
                    vertex=vertex.concat(_.scale3v([-1.0,-1.0,0.0],[w/2,h/2,0.0]));
                    break;
            }
            obj.vertex = vertex;
        }
        obj.numVertex = Math.floor(obj.vertex.length / 3);

        obj.material.textureMode = obj.material.textureMode || "ignore";
        var textureCoords = [];
        switch (obj.material.textureMode)
        {
            case "attach":
                textureCoords = [
                    1.0, 0.0,
                    0.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0
                ];
                break;
            case "ignore":
                // Fake texture
                for (var j=0;j<obj.numVertex;++j)
                {
                    textureCoords = textureCoords.concat([0.0,0.0]);
                }
                break;
        }
        obj.material.textureCoords = textureCoords;

        if (obj.material.color)
        {
            var colors = [];
            for (var i=0;i<Math.floor(obj.vertex.length / 3);++i)
            {
                colors = colors.concat(obj.material.color);
            }
            obj.material.colors = colors;
        }
        wgl.createObject(obj);
        if (obj.material.texture)
        {
            tManager.getTexture(resourceObject,obj);
        }
        else
        {
            tManager.getDummyTexture(obj);
        }
        obj.material.alpha = obj.material.alpha || 1.0;
        
    }
    
    function defineScene(baseDir,sceneDefinition)
    {
        var newScene = sceneDefinition;
        
        // TODO: Generate sceneId.
        newScene.sceneId = 0;
        newScene.ready = false;

        if (newScene.resources)
        {
            if (newScene.resources.textures)
            {
                for (var i=0;i<newScene.resources.textures.length;++i)
                {
                    tManager.loadTexture(baseDir,newScene.resources.textures[i]);
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

        if (newScene.camera)
        {
            var objectTypes = ["objects3d", "objects2d"];
            // TODO: Refractor.
            if (newScene.camera.objects3d)
            {
                log.verbose("Num 3d objects in scene:"+newScene.camera.objects3d.length);
                for (var i=0;i<newScene.camera.objects3d.length;++i)
                {
                    createObject(newScene.resources,newScene.camera.objects3d[i]);
                }
            }
            else
            {
                log.verbose("No 3d objects in scene");
            }

            if (newScene.camera.objects2d)
            {
                log.verbose("Num 2d objects in scene:"+newScene.camera.objects2d.length);
                for (var i=0;i<newScene.camera.objects2d.length;++i)
                {
                    createObject(newScene.resources,newScene.camera.objects2d[i]);
                }
            }
            else
            {
                log.verbose("No 2d objects in scene");
            }
        }
        else
        {
            log.error("No camera found. Camera is mandatory");
        }

        newScene.backgroundColor = newScene.backgroundColor || [0.0, 0.0, 0.0, 1.0];
        if (!activeScene)
        {
            activeScene = newScene;
        }
    }
    this.defineScene = defineScene;

    function renderScene()
    {
        if (activeScene)
        {
            wgl.startRender(activeScene.backgroundColor);
            
            if (activeScene.camera.objects3d)
            {
                wgl.renderCamera3d(activeScene.camera)

                for (var i=0;i<activeScene.camera.objects3d.length;++i)
                {
                    wgl.renderObj(activeScene.camera.objects3d[i]);
                }
            }

            if (activeScene.camera.objects2d)
            {
                wgl.renderCamera2d(activeScene.camera)

                for (var i=0;i<activeScene.camera.objects2d.length;++i)
                {
                    wgl.renderObj(activeScene.camera.objects2d[i]);
                }
            }
        }
    }
    this.renderScene = renderScene;
}
).apply(cns("sfme.internals.sceneManager"));
