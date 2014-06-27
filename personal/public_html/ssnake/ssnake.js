cns("sfme.userModules").defineUserModule("ssnake", "main", 
(function()
{
    this.sfmeAPI = null;
    this.init = function(sfmeAPI_)
    {
        this.sfmeAPI = sfmeAPI_;
        
        this.sfmeAPI.defineScenes(
        {
            this_: this,
            scenes: {
                intro: {
                    resources: {
                        textures: {
                            testtext: {
                                id: "testtext",
                                type: "text",
                                width: 512,
                                height: 256,
                                textDefinition:
                                {
                                    text: "Super Snake",
                                    fontSize: 55,
                                    fontName: "Georgia",
                                    fillStyle: "white",
                                    strokeStyle: "#555555",
                                    lineWidth: 1,
                                    textBaseLine: "middle",
                                    textPosition: [512/2,256/2]
                                }
                            }
                        }
                    },
                    cameras: {
                        camera: {
                            type: "perspective",
                            angle: 45.0,
                            ratio: "normal",
                            zNear: 0.1,
                            zFar: 100.0,
                            gui: [-50, 50, -50, 50],
                            objects2d: {
                                quad: {
                                    shapeType: "quad_normal",
                                    width: 64.0,
                                    height: 32.0,
                                    position: [0.0, 0.0, -5.0],
                                    material: {
                                        blending: true,
                                        alpha: 1.0,
                                        name: "textured",
                                        textureMode: "attach",
                                        color: [1.0, 1.0, 1.0, 1.0],
                                    },
                                    animations: {
                                        showText: {
                                            animTime: 5000,
                                            onStartAnimation: function()
                                            {

                                            },
                                            onUpdateAnimation: function(parentObject,timePassed)
                                            {
                                                var t = timePassed / this.animTime;
                                                parentObject.material.alpha = t;
                                                return t > 1.0;
                                            },
                                            onEndAnimation: function(parentObject)
                                            {
                                                parentObject.material.alpha = 1.0;
                                                parentObject.parentScene.finishScene();
                                            }
                                        }
                                    },
                                    onCreated: function()
                                    {
                                        this.material.texture = this.parentScene.resources.textures.testtext;
                                    }
                                }
                            }
                        }
                    },
                    backgroundColor: [0.0, 0.0, 0.0, 1.0],
                    onStart: function()
                    {
                        console.log("Started");
                        this.camera.objects2d.quad.animations.showText.StartAnimation();
                    }
                },
                game: {
                    resources: {
                        textures: {
                            testtext: {
                                id: "testtext",
                                type: "text",
                                width: 512,
                                height: 256,
                                textDefinition:
                                {
                                    text: "Super Snake",
                                    fontSize: 55,
                                    fontName: "Georgia",
                                    fillStyle: "white",
                                    strokeStyle: "#555555",
                                    lineWidth: 1,
                                    textBaseLine: "middle",
                                    textPosition: [512/2,256/2]
                                }
                            }
                        }
                    },
                    directionStr: function(direction)
                    {
                        if (direction[0]<0)
                        {
                            return "left";
                        } else if (direction[0]>0)
                        {
                            return "right";
                        } else if (direction[1]<0)
                        {
                            return "up";
                        } else if (direction[1]>0)
                        {
                            return "down";
                        } else
                        {
                            return "stopped";
                        }
                    },
                    setDirection: function(obj,str)
                    {
                        obj.direction = vec3.create();
                        switch (str)
                        {
                            case "left":
                                obj.direction[0] = -1;
                                obj.direction[1] = 0;
                                obj.direction[2] = 0;
                                break;
                            case "right":
                                obj.direction[0] = 1;
                                obj.direction[1] = 0;
                                obj.direction[2] = 0;
                                break;
                            case "up":
                                obj.direction[0] = 0;
                                obj.direction[1] = 1;
                                obj.direction[2] = 0;
                                break;
                            case "down":
                                obj.direction[0] = 0;
                                obj.direction[1] = -1;
                                obj.direction[2] = 0;
                                break;
                            case "stopped":
                            default:
                                obj.direction[0] = 0;
                                obj.direction[1] = 0;
                                obj.direction[2] = 0;
                        }
                    },
                    startingPosition: [0.0,0.0,-7.0],
                    cameras: {
                        camera: {
                            type: "perspective",
                            lookAt: {
                                eye: [0.0, 0.0, 0.1],
                                center: [0.0, 0.0, -100.0],
                                vUp: [0.0, 1.0, 0.0]                
                            },
                            angle: 45.0,
                            ratio: "normal",
                            zNear: 0.1,
                            zFar: 100.0,
                            gui: [-50, 50, -50, 50],
                            lastIndexPart: 0,
                            objects: {
                                part_0: {
                                    shapeType: "cube",
                                    width: 1.0,
                                    height: 1.0,
                                    position: [0.0, 0.0, -7.0],
                                    scale: [1.0,1.0,1.0],

                                    material: {
                                        name: "textured",
                                        textureMode: "ignore",
                                        color: [1.0, 0.0, 0.0, 1.0]
                                    },
                                    onUpdate: function(globalTiming)
                                    {
                                        var scaleIndex = this.direction[0] !== 0 ? 0 : 1;
                                        this.scale[scaleIndex] = 1.0 + (globalTiming.currentTime - this.creationTime) / 2000;
                                        var scaleDelta = this.scale[scaleIndex] - 1.0;
                                        this.position[scaleIndex] = this.initialPosition[scaleIndex] + (scaleDelta * 0.5 * this.direction[scaleIndex]);
                                        //console.log("Updating. "+globalTiming.currentTime+" "+globalTiming.ellapsed);
//                                        console.log("Position:"+this.position[0]+","+this.position[1]+","+this.position[2]);
                                    },
                                    getHead: function()
                                    {
                                        var factorN = vec3.negate(this.direction,vec3.create());

                                        /* var r = [this.position[0]+((this.scale[0]+(1.0*factorN[0]))*this.direction[0]),
                                            this.position[1]+((this.scale[1]+(1.0*factorN[1]))*this.direction[1]),
                                            this.position[2]+((this.scale[2]+(1.0*factorN[2]))*this.direction[2])];
                                        */
                                        var rTemp = [(this.scale[0] - 1.0)/2, (this.scale[1] - 1.0)/2, (this.scale[2] - 1.0)/2];
                                        var r = [this.position[0]+(rTemp[0]*this.direction[0]),
                                            this.position[1]+(rTemp[1]*this.direction[1]),
                                            this.position[2]+(rTemp[2]*this.direction[2])];
                                        
                                        return r;
                                    },
                                }
                            }
                        }
                    },
                    backgroundColor: [0.0, 1.0, 0.0, 1.0],
                    onStart: function()
                    {
                        console.log("Started");
                          this.cameras.camera.objects.part_0.initialPosition = vec3.create(this.startingPosition);
                          this.setDirection(this.cameras.camera.objects.part_0,"right");
//                        this.cameras.camera.objects.part_0.initialPosition = vec3.create(this.cameras.camera.objects.part_0.leftDownFront());
//                        vec3.add(this.cameras.camera.objects.part_0.initialPosition,
//                                    this.startingPosition);

                    },
                    inputController: 
                    {
                        delta:0.5,
                        onKeyDown: function(parentObject,e)
                        {
                            var camera = parentObject.cameras.camera.lookAt;
                            if (e.keyCode === 65)
                            {
                                camera.eye[0] -= this.delta;
                            } else if (e.keyCode === 68)
                            {
                                camera.eye[0] += this.delta;
                            } else if (e.keyCode === 87)
                            {
                                camera.eye[1] += this.delta;
                            } else if (e.keyCode === 83)
                            {
                                camera.eye[1] -= this.delta;
                            } else if (e.keyCode === 81)
                            {
                                camera.eye[2] += this.delta;
                            } else if (e.keyCode === 90)
                            {
                                camera.eye[2] -= this.delta;
                            } else if (e.keyCode === 70)
                            {
                                camera.center[0] -= this.delta;
                            } else if (e.keyCode === 72)
                            {
                                camera.center[0] += this.delta;
                            } else if (e.keyCode === 84)
                            {
                                camera.center[1] += this.delta;
                            } else if (e.keyCode === 71)
                            {
                                camera.center[1] -= this.delta;
                            } else if (e.keyCode === 82)
                            {
                                camera.center[2] += this.delta;
                            } else if (e.keyCode === 86)
                            {
                                camera.center[2] -= this.delta;
                            }

//                            console.log("eye:"+camera.eye[0]+","+camera.eye[1]+","+camera.eye[2]);
//                            console.log("center:"+camera.center[0]+","+camera.center[1]+","+camera.center[2]);

                            var camera = parentObject.cameras.camera;
                            var lastPart = camera.findObject("part_"+camera.lastIndexPart);
                            var dir = lastPart.direction;
                            var directionStr = parentObject.directionStr(dir);

                            if (e.keyCode === 37 && directionStr !== "right")
                            {
                                var newPart = this.createNewPart(lastPart,camera,dir);
                                parentObject.setDirection(newPart,"left");
                            } else if (e.keyCode === 39 && directionStr !== "left")
                            {
                                var newPart = this.createNewPart(lastPart,camera,dir);
                                parentObject.setDirection(newPart,"right");
                            } else if (e.keyCode === 38 && directionStr !== "down")
                            {
                                var newPart = this.createNewPart(lastPart,camera,dir);
                                parentObject.setDirection(newPart,"up");
                            } else if (e.keyCode === 40 && directionStr !== "up")
                            {
                                var newPart = this.createNewPart(lastPart,camera,dir);
                                parentObject.setDirection(newPart,"down");
                            }
                        },
                        createNewPart: function(lastPart,camera,dir)
                        {
                            var newPart = lastPart.addClone("part_"+(camera.lastIndexPart+1));
                            lastPart.onUpdate = null;
                            camera.lastIndexPart++;
                            newPart.setPosition(lastPart.getHead());
                            newPart.initialPosition = vec3.create(newPart.position);
                            newPart.setScale([1.0,1.0,1.0]);
                            return newPart;
                        }
                    }
                }
            },
            state: "init",
            nextScene: function()
            {
                return this.scenes.game;

                switch (this.state)
                {
                    case "init":
                        this.state = "game";
                        return this.scenes.intro;
                        break;
                    case "game":
                        return this.scenes.game;
                        break;
                        
                }
            }
        });
    };
}
));
