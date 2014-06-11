(function()
{
    "use strict";
    var this_ = this;
    var ready = false;
    var wgl = cns("sfme.internals.webgl");
    var tManager = cns("sfme.internals.textureManager");
    var log = cns("sfme.log");
    var _ = cns("sfme.types");
    var eManager = cns("sfme.internal.eventManager");

    var activeScene = null;
    var objectTypes = ["objects3d", "objects2d"];

    this.init = function()
    {
        ready = true;
    };
    
    function updateBoundingBox(object)
    {
        var downLeftFront = [];
        var topRightFar = [];
        
        for (var i=0;i<object.vertex.length;++i)
        {
            var v=object.vertex[i];
            for (var j=0;j<3;++j)
            {
                if (i===0 || v[j] < downLeftFront[j])
                {
                    downLeftFront[j]=v[j];
                }
                if (i===0 || v[j] > topRightFar[j])
                {
                    topRightFar[j]=v[j];
                }               
            }
        }
        object.boundingBox = {};
        object.boundingBox.downLeftFront = downLeftFront;
        object.boundingBox.topRightFar = topRightFar;

    }
    
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
        updateBoundingBox(obj);

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
            // TODO: Refractor.
            for (var oti=0;oti<objectTypes.length;++oti)
            {
                if (newScene.camera[objectTypes[oti]])
                {
                    log.verbose("Number of "+objectTypes[oti]+" in scene:"+newScene.camera[objectTypes[oti]].length);
                    for (var i=0;i<newScene.camera[objectTypes[oti]].length;++i)
                    {
                        createObject(newScene.resources,newScene.camera[objectTypes[oti]][i]);
                    }
                }
                else
                {
                    log.verbose("No "+objectTypes[oti]+" in scene");
                }
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
            
            for (var oti=0;oti<objectTypes.length;++oti)
            {
                if (activeScene.camera[objectTypes[oti]])
                {
                    wgl.renderCamera(activeScene.camera,objectTypes[oti])

                    for (var i=0;i<activeScene.camera[objectTypes[oti]].length;++i)
                    {
                        wgl.renderObj(activeScene.camera[objectTypes[oti]][i]);
                    }
                }
            }
        }
    }
    this.renderScene = renderScene;
}
).apply(cns("sfme.internals.sceneManager"));
