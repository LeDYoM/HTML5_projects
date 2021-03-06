cns("sfme.userModules").defineUserModule("example2", "main", 
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
                        id: "test",
                        type: "image",
                        src: "nehe.gif"
                    },
                    {
                        id: "testtext",
                        type: "text",
                        width: 512,
                        height: 256,
                        textDefinition:
                            {
                                text: "Hello world!"
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
                objects3d: [
                    {
                        id: "triangle",
                        shapeType: "triangle_normal",
                        width: 2.0,
                        height: 2.0,
                        position: [-1.5, 0.0, -7.0],
                        material: {
                            name: "color_pass",
                            colors: [
                                1.0, 1.0, 0.0, 1.0,
                                0.0, 1.0, 0.0, 1.0,
                                0.0, 0.0, 1.0, 1.0
                            ]
                        }
                    },
                    {
                        id: "quad",
                        shapeType: "quad_normal",
                        width: 2.0,
                        height: 2.0,
                        position: [0.5, 0.0, -5.0],
                        material: {
                            name: "textured",
                            textureMode: "attach",
                            color: [1.0, 0.5, 1.0, 1.0],
                            texture: "test"
                        }
                    }
                ]
            },
            backgroundColor: [1.0, 1.0, 0.0, 1.0],
        });

    };
}
));
