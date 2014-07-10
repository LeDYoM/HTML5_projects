(function()
{
    "use strict";
    var wgl = cns("sfme.internals.webgl");
    var tManager = cns("sfme.internals.textureManager");
    var log = cns("sfme.log");
    var _ = cns("sfme.types");
    var iManager = cns("sfme.internal.inputManager");
    var utils = cns("sfme.utils");
    var globalTiming = null;
    var geometry = cns("sfme.geometry");

    var activeScene = null;

    this.init = function(globalTiming_)
    {
        globalTiming = globalTiming_;
    };
    
    function createsfmeObject(obj)
    {
        (function()
        {
            this.setPosition = function(v)
            {
                this.position=v;
            };
            this.setScale = function(v)
            {
                this.scale=v;
            };
            this.setScaleX = function(v)
            {
                this.scale[0]=v;
            };
            this.setScaleY = function(v)
            {
                this.scale[1]=v;
            };
            this.setScaleZ = function(v)
            {
                this.scale[2]=v;
            };
            this.updateMvMatrixForObject = function()
            {
                if (!this.mvMatrix)
                {
                    this.mvMatrix = mat4.create();
                }
                mat4.identity(this.mvMatrix);
                if (this.position)
                {
                    mat4.translate(this.mvMatrix, this.position);
                }
                if (this.scale)
                {
                    mat4.scale(this.mvMatrix, this.scale);
                }
            };
            this.leftDownFront = function()
            {
                return this.boundingBox.leftDownFront;
            };
            this.rightTopFar = function()
            {
                return this.boundingBox.rightTopFar;
            };
            this.distance = function()
            {
                return this.boundingBox.distance;
            };
            this.clone = function()
            {
                return utils.cloneObject(this);
            };
            this.addClone = function(name)
            {
                if (this.parentCamera)
                {
                    var tmp = this.clone();
                    createObject(this.parentScene,tmp);
                    this.parentCamera.objects[name] = tmp;
                    return tmp;
                }
                else
                {
                    log.error("No camera no put the clone on");
                }
            };
        }).apply(obj);
    }

    function updateBoundingBox(object)
    {
        var leftDownFront = vec3.create();
        var rightTopFar = vec3.create();
        
        for (var i=0;i<object.vertex.length;++i)
        {
            var v=[object.vertex[i],object.vertex[++i],object.vertex[++i]];
            for (var j=0;j<3;++j)
            {
                if (i===0 || v[j] < leftDownFront[j])
                {
                    leftDownFront[j]=v[j];
                }
                if (i===0 || v[j] > rightTopFar[j])
                {
                    rightTopFar[j]=v[j];
                }
            }
        }
        object.boundingBox = {};
        object.boundingBox.leftDownFront = leftDownFront;
        object.boundingBox.rightTopFar = rightTopFar;
        object.boundingBox.distance = vec3.subtract(object.boundingBox.rightTopFar,object.boundingBox.leftDownFront,vec3.create());
    }
    
    function createObject(parentScene_,obj)
    {
        obj.parentScene = parentScene_;
        obj.color = obj.color || [1.0,1.0,1.0,1.0];

        if (obj.shapeType)
        {
            var size = [ obj.width || 1.0, obj.height || 1.0, obj.deep || 1.0];

            geometry.createGeometry(obj,obj.shapeType,size,obj.color);
//            obj.vertexIndices = vertexIndices;
            obj.numIndices = obj.vertexIndices.length;
        }
        obj.numVertex = Math.floor(obj.vertex.length / 3);
        updateBoundingBox(obj);

        obj.material.textureMode = obj.material.textureMode || "ignore";
        var textureCoords = [];
        switch (obj.material.textureMode)
        {
            case "attach":
                textureCoords = [
                    0.0, 0.0,
                    1.0, 0.0,
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
        wgl.createObject(obj);
        if (!obj.material.textureObject)
        {
            tManager.getDummyTexture(obj);
        }
        obj.material.alpha = obj.material.alpha || 1.0;

        createsfmeObject(obj);
        obj.updateMvMatrixForObject();
        obj.creationTime = globalTiming.currentTime;
        defineSubObjects(obj);
    }

    function setActiveScene(scene)
    {
        activeScene = scene;
        if (activeScene.onStart)
        {
            activeScene.onStart(globalTiming);
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
    
    function defineSubObjects(obj)
    {
        if (obj.animations)
        {
            for (var animIndex in obj.animations)
            {
                var anim = obj.animations[animIndex];
                anim.active = false;
                anim.StartAnimation = function()
                {
                    anim.active = true;
                    anim.startTime = new Date().getTime();
                    if (anim.onStartAnimation)
                    {
                        anim.onStartAnimation(obj);
                    }
                }
            }
        }
        if (obj.onCreated)
        {
            obj.onCreated(globalTiming);
        }
    }
   
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

        if (newScene.cameras)
        {
            for (var camera in newScene.cameras)
            {
                if (newScene.cameras[camera].objects)
                {
                    newScene.cameras[camera].findObject = function(str)
                    {
                        return this.objects[str];
                    };
                    newScene.cameras[camera].deleteObject = function(str)
                    {
                        delete this.objects[str];
                    }
                    var count = 0;
                    for (var i in newScene.cameras[camera].objects)
                    {
                        count++;
                        var obj = newScene.cameras[camera].objects[i];
                        createObject(newScene,obj);
                    }
                    log.verbose("Number of objects in scene:"+count);

                }
                else
                {
                    log.verbose("No objects in scene");
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

    function processEventsAnimations(obj)
    {
        iManager.processObject(obj);
        if (obj.animations)
        {
            for (var animIndex in obj.animations)
            {
                var anim = obj.animations[animIndex];
                if (anim.active)
                {
                    var ret = anim.onUpdateAnimation(obj,globalTiming.currentTime - anim.startTime);
                    if (ret)
                    {
                        anim.active = false;
                        if (anim.onEndAnimation)
                        {
                            anim.onEndAnimation(obj);
                        }
                    }
                }
            }
        }
        if (obj.onUpdate)
        {
            obj.onUpdate(globalTiming);
        }
    }

    function updateFrame()
    {
        if (activeScene)
        {
            renderScene(activeScene);
            wgl.endRender();
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
    this.updateFrame = updateFrame;
    
    function renderScene(activeScene)
    {
        if (activeScene)
        {
            processEventsAnimations(activeScene);
            wgl.startRender(activeScene.backgroundColor);

            if (activeScene.cameras)
            {
                for (var camera in activeScene.cameras)
                {
                    if (activeScene.cameras[camera].objects)
                    {
                        processEventsAnimations(activeScene.cameras[camera]);
                        wgl.renderCamera(activeScene.cameras[camera])

                        for (var i in activeScene.cameras[camera].objects)
                        {
                            var obj = activeScene.cameras[camera].objects[i];
                            obj.parentCamera = activeScene.cameras[camera];
                            processEventsAnimations(obj);
                            wgl.renderObj(obj);
                        }
                    }
                }
            }
        }
    }
    this.renderScene = renderScene;
}
).apply(cns("sfme.internals.sceneManager"));
