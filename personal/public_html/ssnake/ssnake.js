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
                    camera: {
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
                        objects3d: {
                            quad: {
                                shapeType: "cube",
                                width: 80.0,
                                height: 40.0,
                                position: [0.0, 0.0, -77.0],

                                material: {
                                    name: "textured",
                                    textureMode: "ignore",
                                    color: [1.0, 0.0, 0.0, 1.0]
                                }
                            }
                        }
                    },
                    backgroundColor: [0.0, 1.0, 0.0, 1.0],
                    onStart: function()
                    {
                        console.log("Started");
                    },
                    inputController: 
                    {
                        delta:0.5,
                        onKeyDown: function(parentObject,e)
                        {
                            if (e.keyCode === 65)
                            {
                                parentObject.camera.lookAt.eye[0] -= this.delta;
                            } else if (e.keyCode === 68)
                            {
                                parentObject.camera.lookAt.eye[0] += this.delta;
                            } else if (e.keyCode === 87)
                            {
                                parentObject.camera.lookAt.eye[1] += this.delta;
                            } else if (e.keyCode === 83)
                            {
                                parentObject.camera.lookAt.eye[1] -= this.delta;
                            } else if (e.keyCode === 81)
                            {
                                parentObject.camera.lookAt.eye[2] += this.delta;
                            } else if (e.keyCode === 90)
                            {
                                parentObject.camera.lookAt.eye[2] -= this.delta;
                            } else if (e.keyCode === 70)
                            {
                                parentObject.camera.lookAt.center[0] -= this.delta;
                            } else if (e.keyCode === 72)
                            {
                                parentObject.camera.lookAt.center[0] += this.delta;
                            } else if (e.keyCode === 84)
                            {
                                parentObject.camera.lookAt.center[1] += this.delta;
                            } else if (e.keyCode === 71)
                            {
                                parentObject.camera.lookAt.center[1] -= this.delta;
                            } else if (e.keyCode === 82)
                            {
                                parentObject.camera.lookAt.center[2] += this.delta;
                            } else if (e.keyCode === 86)
                            {
                                parentObject.camera.lookAt.center[2] -= this.delta;
                            }
                            console.log("eye:"+parentObject.camera.lookAt.eye[0]+","+parentObject.camera.lookAt.eye[1]+","+parentObject.camera.lookAt.eye[2]);
                            console.log("center:"+parentObject.camera.lookAt.center[0]+","+parentObject.camera.lookAt.center[1]+","+parentObject.camera.lookAt.center[2]);

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
