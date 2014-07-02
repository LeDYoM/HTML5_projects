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
                                    textBaseline: "middle",
                                    textPosition: [512/2,256/2]
                                }
                            }
                        }
                    },
                    cameras: {
                        camera: {
                            type: "ortho",
                            angle: 45.0,
                            ratio: "normal",
                            zNear: 0.1,
                            zFar: 100.0,
                            left: -50.0,
                            right: 50.0,
                            top: 50,
                            bottom: -50.0,
                            objects: {
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
                        this.cameras.camera.objects.quad.animations.showText.StartAnimation();
                    }
                },
                game: {
                    resources: {
                        textures: {
                            testtext: {
                                id: "testtext",
                                type: "text",
                                width: 512,
                                height: 64,
                                textDefinition:
                                {
                                    text: "Score:",
                                    fontSize: 55,
                                    fontName: "Georgia",
                                    fillStyle: "white",
                                    strokeStyle: "#555555",
                                    lineWidth: 1,
                                    textBaseline: "top",
                                    textAlign: "left",
                                    textPosition: [0,0]
                                }
                            },
                            hudBackground: {
                                type: "canvas",
                                backgroundColor:    function()
                                                    {
                                                        var context = this.context;
                                                        // add linear gradient
                                                        var grd = context.createLinearGradient(0, 0, 1, context.canvas.height);
                                                        grd.addColorStop(0, "#555555");
                                                        grd.addColorStop(0.5, "#222222");
                                                        grd.addColorStop(1, "#555555");
                                                        return grd;

                                                    },
                                width: 1,
                                height: 32,
                                /*
                                onDraw: function(context)
                                {
                                    // add linear gradient
                                    var grd = context.createLinearGradient(0, 0, context.canvas.width, context.canvas.height);
                                    // light blue
                                    grd.addColorStop(0, '#8ED6FF');   
                                    // dark blue
                                    grd.addColorStop(1, '#004CB3');
                                    context.fillStyle = grd;
                                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                                }
                                   */
                            }
                        }
                    },
                    boardModel:
                    {
                        getPositionForCell: function(vec)
                        {
                            // TODO: Implement real boards.
                            return [vec[0] * 1, vec[1]  * 1 , -15.0 + (vec[2] * 1)];
                        },
                        getNextCell: function(obj)
                        {
                            return [obj.boardCell[0] + obj.nextDirection[0],
                                    obj.boardCell[1] + obj.nextDirection[1],
                                    obj.boardCell[2] + obj.nextDirection[2]];
                        },
                        setNextCell: function(obj)
                        {
                            obj.boardCell = this.getNextCell(obj);
                        }
                    },
                    lastIndexPart: 0,
                    firstIndexPart: 0,
                    speedFactor: 1000,
                    cameras: {
                        camera2d:
                        {
                            type: "ortho",
                            angle: 45.0,
                            ratio: "normal",
                            zNear: 0.1,
                            zFar: 100.0,
                            left: -50.0,
                            right: 50.0,
                            top: 50,
                            bottom: -50.0,
                            objects: {
                                hudBackgroundObject: {
                                    shapeType: "quad_normal",
                                    width: 200.0,
                                    height: 10.0,
                                    position: [0.0, 45.0, -5.0],
                                    
                                    material: {
                                        name: "textured",
                                        textureMode: "attach",
                                        color: [1.0, 1.0, 1.0, 1.0],
                                    },
                                    onCreated: function()
                                    {
                                        this.material.texture = this.parentScene.resources.textures.hudBackground;
                                    }
                                },
                                scoreText: {
                                    shapeType: "quad_normal",
                                    width: 25.0,
                                    height: 10.0,
                                    position: [-37.5, 45.0, -4.0],
                                    
                                    material: {
                                        blending: true,
                                        alpha: 1.0,
                                        name: "textured",
                                        textureMode: "attach",
                                        color: [1.0, 1.0, 1.0, 1.0],
                                    },
                                    onCreated: function()
                                    {
                                        this.material.texture = this.parentScene.resources.textures.testtext;
                                    }
                                },
                            }
                        },
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
                            objects: {
                                part_0: {
                                    shapeType: "cube",
                                    width: 1.0,
                                    height: 1.0,

                                    material: {
                                        name: "textured",
                                        textureMode: "ignore",
                                        color: [1.0, 0.0, 0.0, 1.0]
                                    },
                                    onUpdate: function(globalTiming)
                                    {
                                        this.partScale = [1.0,1.0,1.0];
                                        var scaleIndex = this.direction[0] !== 0 ? 0 : 1;
                                        this.partScale[scaleIndex] = (globalTiming.currentTime - this.creationTime) / this.parentScene.speedFactor;
                                        var createNew = this.partScale[scaleIndex] >= 1.00;
                                        if (createNew)
                                        {
                                            var remanent = this.partScale[scaleIndex] - 1.00;
                                            this.scale = [1.0, 1.0, 1.0];
                                            this.position = this.parentScene.boardModel.getPositionForCell(this.boardCell); 

                                            var newPart = this.createNewPart();
                                            
                                            newPart.partScale = [1.0,1.0,1.0];
                                            newPart.direction = vec3.create(newPart.nextDirection);
                                            this.parentScene.boardModel.setNextCell(newPart);
                                            newPart.partScale[scaleIndex] = remanent;
                                            newPart.setFinalPosition();
                                        }
                                        this.setFinalPosition();
                                    },
                                    setFinalPosition: function()
                                    {
                                        var iPosition = this.parentScene.boardModel.getPositionForCell(this.boardCell);
                                        var inp = [
                                            iPosition[0] - (this.direction[0] / 2.0),
                                            iPosition[1] - (this.direction[1] / 2.0),
                                            iPosition[2] - (this.direction[2] / 2.0)
                                        ];
                                        var fp = [inp[0] + ((this.partScale[0] * this.direction[0]) / 2.0),
                                            inp[1] + ((this.partScale[1] * this.direction[1]) / 2.0),
                                            inp[2] + ((this.partScale[2] * this.direction[2]) / 2.0)];
                                        this.scale = vec3.create(this.partScale);
                                        this.position = fp;
                                    },
                                    createNewPart: function()
                                    {
                                        var newPart = this.addClone("part_"+(this.parentScene.lastIndexPart+1));
                                        this.onUpdate = null;
                                        this.parentScene.lastIndexPart++;
                                        newPart.setScale([1.0,1.0,1.0]);
                                        return newPart;
                                    }
                                }
                            }
                        }
                    },
                    backgroundColor: [0.0, 1.0, 0.0, 1.0],
                    onStart: function(globalTiming)
                    {
                        console.log("Started");
                        this.cameras.camera.objects.part_0.boardCell = [0,0,0];// = this.boardModel.getPositionForCell([0,0,0]);
                        this.cameras.camera.objects.part_0.direction = [1,0,0];
                        this.cameras.camera.objects.part_0.nextDirection = [1,0,0];  
                        this.cameras.camera.objects.part_0.creationTime = globalTiming.currentTime;
                        this.score = 0;
                    },
                    onUpdate: function(globalTiminig)
                    {
                        this.resources.textures.testtext.textDefinition.setText("Score: "+this.score);
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
                            var lastPart = camera.findObject("part_"+parentObject.lastIndexPart);

                            if (e.keyCode === 37)
                            {
                                lastPart.nextDirection = [-1.0, 0.0, 0.0];
                            } else if (e.keyCode === 39)
                            {
                                lastPart.nextDirection = [1.0, 0.0, 0.0];
                            } else if (e.keyCode === 38)
                            {
                                lastPart.nextDirection = [0.0, 1.0, 0.0];
                            } else if (e.keyCode === 40)
                            {
                                lastPart.nextDirection = [0.0, -1.0, 0.0];
                            }
                        },
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
