(function()
{
    "use strict";
    var ready = false;
    var wgl = cns("sfme.internals.webgl");
    var tManager = cns("sfme.internals.textureManager");
    var log = cns("sfme.log");
    var _ = cns("sfme.types");
//    var eManager = cns("sfme.internal.eventManager");
    var iManager = cns("sfme.internal.inputManager");
    var utils = cns("sfme.utils");

    var activeScene = null;

    this.init = function()
    {
        ready = true;
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
                var tmp = this.clone();
                
                if (name instanceof String)
                {
//                    this.parentScene
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
    
    function createObject(parentScene_,resourceObject,obj)
    {
        obj.parentScene = parentScene_;
        var vertex = [];
        var vertexIndices = [];
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
                    vertexIndices = [0, 1, 2];
                    break;
                case "quad_normal":
                    var w = obj.width || 1.0;
                    var h = obj.height || 1.0;
                    vertex=vertex.concat(_.scale3v([-1.0,-1.0,0.0],[w/2,h/2,0.0]));
                    vertex=vertex.concat(_.scale3v([1.0,-1.0,0.0],[w/2,h/2,0.0]));
                    vertex=vertex.concat(_.scale3v([1.0,1.0,0.0],[w/2,h/2,0.0]));
                    vertex=vertex.concat(_.scale3v([-1.0,1.0,0.0],[w/2,h/2,0.0]));
                    vertexIndices = [0, 1, 2, 0,2,3];
                    break;
                case "cube":
                    var w = obj.width || 1.0;
                    var h = obj.height || 1.0;
                    var p = 1.0;
                    
                    // Front face
                    vertex=vertex.concat(_.scale3v([-1.0,-1.0,1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,-1.0,1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,1.0,1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([-1.0,1.0,1.0],[w/2,h/2,p/2]));
                    // Back face
                    vertex=vertex.concat(_.scale3v([-1.0,-1.0,-1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([-1.0,1.0,-1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,1.0,-1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,-1.0,-1.0],[w/2,h/2,p/2]));
                    // Top face
                    vertex=vertex.concat(_.scale3v([-1.0,1.0,-1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([-1.0,1.0,1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,1.0,1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,1.0,-1.0],[w/2,h/2,p/2]));
                    // Bottom face
                    vertex=vertex.concat(_.scale3v([-1.0,-1.0,-1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,-1.0,-1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,-1.0,1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([-1.0,-1.0,1.0],[w/2,h/2,p/2]));
                    // Right face
                    vertex=vertex.concat(_.scale3v([1.0,-1.0,-1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,1.0,-1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,1.0,1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([1.0,-1.0,1.0],[w/2,h/2,p/2]));
                    // Left face
                    vertex=vertex.concat(_.scale3v([-1.0,-1.0,-1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([-1.0,-1.0,1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([-1.0,1.0,1.0],[w/2,h/2,p/2]));
                    vertex=vertex.concat(_.scale3v([-1.0,1.0,-1.0],[w/2,h/2,p/2]));

                    vertexIndices = [
                        0, 1, 2,      0, 2, 3,    // Front face
                        4, 5, 6,      4, 6, 7,    // Back face
                        8, 9, 10,     8, 10, 11,  // Top face
                        12, 13, 14,   12, 14, 15, // Bottom face
                        16, 17, 18,   16, 18, 19, // Right face
                        20, 21, 22,   20, 22, 23  // Left face
                    ];
                    break;
            }
            obj.vertex = vertex;
            obj.vertexIndices = vertexIndices;
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
/*
                    1.0, 0.0,
                    0.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0*/
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

        createsfmeObject(obj);
        obj.updateMvMatrixForObject();
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
            obj.onCreated();
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
                    var count = 0;
                    for (var i in newScene.cameras[camera].objects)
                    {
                        count++;
                        var obj = newScene.cameras[camera].objects[i];
                        createObject(newScene,newScene.resources,obj);
                        defineSubObjects(obj);
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

    function processEventsAnimations(obj,globalTiming)
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

    function updateFrame(globalTiming)
    {
        if (activeScene)
        {
            renderScene(activeScene,globalTiming);
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
    
    function renderScene(activeScene,globalTiming)
    {
        if (activeScene)
        {
            processEventsAnimations(activeScene,globalTiming);
            wgl.startRender(activeScene.backgroundColor);

            if (activeScene.cameras)
            {
                for (var camera in activeScene.cameras)
                {
                    if (activeScene.cameras[camera].objects)
                    {
                        processEventsAnimations(activeScene.cameras[camera],globalTiming);
                        wgl.renderCamera(activeScene.cameras[camera])

                        for (var i in activeScene.cameras[camera].objects)
                        {
                            var obj = activeScene.cameras[camera].objects[i];
                            processEventsAnimations(obj,globalTiming);
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
