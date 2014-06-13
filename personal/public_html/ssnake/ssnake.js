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
                                        onUpdateAnimation: function(timePassed)
                                        {
                                            var t = timePassed / this.animTime;
                                            console.log(t);
                                            this.parentObject.material.alpha = t;
                                            return t > 1.0;
                                        },
                                        onEndAnimation: function()
                                        {
                                            this.parentObject.material.alpha = 1.0;
                                        }
                                    }
                                },
                                onCreated: function()
                                {
                                    this.material.textureObject = this.parentScene.resources.textures.testtext;
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
                }
            },
            state: "init",
            nextScene: function()
            {
                return this.scenes.intro;
            }
        });
    };
}
));
