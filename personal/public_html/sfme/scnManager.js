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
   
    function createObject(parentScene_,resourceObject,obj)
    {
        obj.parentScene = parentScene_;
        var vertex = [];
        if (obj.shapeType)
        {
            obj.renderMode = wgl.getRenderModeForObject(obj);
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
                case "cube":
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
        if (!obj.material.textureObject)
        {
            tManager.getDummyTexture(obj);
        }
        obj.material.alpha = obj.material.alpha || 1.0;
    }

    function setActiveScene(scene)
    {
        activeScene = scene;
        if (activeScene.onStart)
        {
            activeScene.onStart();
        }
    }
    this.setActiveScene = setActiveScene;
    var scenesObject = null;
    
    function defineScenes(baseDir,scenesObject_)
    {
        scenesObject = scenesObject_;
        if (scenesObject.scenes)
        {
            for (var scene in scenesObject.scenes)
            {
                defineScene(baseDir,scenesObject.scenes[scene]);
            }
        }
        else
        {
            log.error("No scenes");
        }
    }
    this.defineScenes = defineScenes;
   
    function defineScene(baseDir,sceneDefinition)
    {
        var newScene = sceneDefinition;

        newScene.ready = false;

        if (newScene.resources)
        {
            if (newScene.resources.textures)
            {
                for (var i in newScene.resources.textures)
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
            for (var oti=0;oti<objectTypes.length;++oti)
            {
                if (newScene.camera[objectTypes[oti]])
                {
                    var count = 0;
                    for (var i in newScene.camera[objectTypes[oti]])
                    {
                        count++;
                        var obj = newScene.camera[objectTypes[oti]][i];
                        createObject(newScene,newScene.resources,obj);
                        if (obj.animations)
                        {
                            for (var animIndex in obj.animations)
                            {
                                var anim = obj.animations[animIndex];
                                anim.parentObject = obj;
                                anim.active = false;
                                anim.StartAnimation = function()
                                {
                                    anim.active = true;
                                    anim.startTime = new Date().getTime();
                                }
                            }
                        }

                        if (newScene.camera[objectTypes[oti]][i].onCreated)
                        {
                            newScene.camera[objectTypes[oti]][i].onCreated();
                        }
                    }
                    log.verbose("Number of "+objectTypes[oti]+" in scene:"+count);

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

        newScene.finishScene = function()
        {
            activeScene = null;
        };

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

                    for (var i in activeScene.camera[objectTypes[oti]])
                    {
                        var obj = activeScene.camera[objectTypes[oti]][i];
                        if (obj.animations)
                        {
                            for (var animIndex in obj.animations)
                            {
                                var anim = obj.animations[animIndex];
                                if (anim.active)
                                {
                                    var ret = anim.onUpdateAnimation(new Date().getTime() - anim.startTime);
                                    if (ret)
                                    {
                                        anim.active = false;
                                        if (anim.onEndAnimation)
                                        {
                                            anim.onEndAnimation();
                                        }
                                    }
                                }
                            }
                        }
                        wgl.renderObj(obj);
                    }
                }
            }
        }
        else
        {
            if (scenesObject)
            {
                var ns = scenesObject.nextScene();
                setActiveScene(ns);
            }
        }
    }
    this.renderScene = renderScene;
}
).apply(cns("sfme.internals.sceneManager"));
