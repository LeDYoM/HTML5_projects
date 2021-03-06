cns("sfme.userModules").defineUserModule("example3", "main", 
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
                        height: 64,
                        backgroundColor: "blue",
                        textDefinition:
                            {
                                text: "Hello world!",
                                fontSize: 32,
                                fontName: "Georgia",
                                fillStyle: "white",
                                strokeStyle: "black",
                                lineWidth: 1,
                                textBaseLine: "middle",
                                textPosition: [256,32]
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
                objects3d: [
                    {
                        id: "triangle",
                        shapeType: "triangle_normal",
                        width: 2.0,
                        height: 2.0,
                        position: [-1.5, 0.0, -7.0],
                        material: {
                            name: "textured",
                            colors: [
                                1.0, 1.0, 0.0, 1.0,
                                0.0, 1.0, 0.0, 1.0,
                                0.0, 0.0, 1.0, 0.5
                            ]
                        }
                    }
                ],
                objects2d: [
                    {
                        id: "quad",
                        shapeType: "quad_normal",
                        width: 25.0,
                        height: 15.0,
                        position: [0.0, 0.0, -5.0],
                        material: {
//                            blending: true,
//                            alpha: 1.0,
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
