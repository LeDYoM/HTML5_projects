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
                zFar: 100.0
            },
            backgroundColor: [1.0, 1.0, 0.0, 1.0],
            objects: [
                {
                    id: "triangle",
                    shapeType: "triangle_normal",
                    width: 2.0,
                    height: 2.0,
                    colors: [
                        1.0, 1.0, 0.0, 1.0,
                        0.0, 1.0, 0.0, 1.0,
                        0.0, 0.0, 1.0, 1.0
                    ],
                    position: [-1.5, 0.0, -7.0],
                    material: {
                        name: "color_pass"
                    }
                },
                {
                    id: "quad",
                    shapeType: "quad_normal",
                    width: 2.0,
                    height: 2.0,
                    colors: [
                        1.0, 0.5, 1.0, 1.0,
                        0.5, 1.0, 1.0, 1.0,
                        0.5, 0.5, 1.0, 1.0,
                        0.0, 1.5, 1.0, 1.0
                    ],
                    texture: "testtext",
                    position: [0.5, 0.0, -5.0],
                    material: {
                        name: "textured",
                        textureMode: "attach",
                    }
                }
        ]});

    };
}
));
