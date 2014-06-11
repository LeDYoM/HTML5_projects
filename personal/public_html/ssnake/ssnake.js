cns("sfme.userModules").defineUserModule("ssnake", "main", 
(function()
{
    this.sfmeAPI = null;
    this.init = function(sfmeAPI_)
    {
        this.sfmeAPI = sfmeAPI_;
        
        this.sfmeAPI.defineScene({
            resources: {
                textures: [
                    {
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

                ]
            },
            camera: {
                type: "perspective",
                angle: 45.0,
                ratio: "normal",
                zNear: 0.1,
                zFar: 100.0,
                gui: [-50, 50, -50, 50],
                objects2d: [
                {
                    id: "quad",
                    shapeType: "quad_normal",
                    width: 64.0,
                    height: 32.0,
                    position: [0.0, 0.0, -5.0],
                    material: {
//                        blending: true,
//                        alpha: 1.0,
                        name: "textured",
                        textureMode: "attach",
                            color: [1.0, 1.0, 1.0, 1.0],
                        texture: "testtext"
                    }
                }
        ]
            },
            backgroundColor: [0.0, 0.0, 0.0, 1.0],
        });
    };
}
));
