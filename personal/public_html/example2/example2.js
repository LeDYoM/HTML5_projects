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
                            src: "nehe.gif"
                        }
                    ]
                },
                objects: [
                    {
                        id: "triangle",
                        type: "mesh",
                        vertex: [
                            0.0,  1.0,  0.0,
                           -1.0, -1.0,  0.0,
                            1.0, -1.0,  0.0
                        ],
                        colors: [
                            1.0, 1.0, 0.0, 1.0,
                            0.0, 1.0, 0.0, 1.0,
                            0.0, 0.0, 1.0, 1.0
                        ],
                        position: [-1.5, 0.0, -7.0],
                        material: "color_pass"
                    },
                    {
                        id: "quad",
                        type: "mesh",
                        vertex: [
                            1.0,  1.0,  0.0,
                           -1.0,  1.0,  0.0,
                            1.0, -1.0,  0.0,
                           -1.0, -1.0,  0.0
                        ],
                        colors: [
                            1.0, 0.5, 1.0, 1.0,
                            0.5, 1.0, 1.0, 1.0,
                            0.5, 0.5, 1.0, 1.0,
                            0.0, 1.5, 1.0, 1.0
                        ],
                        textureCoords: [
                            1.0, 0.0,                        
                            0.0, 0.0,
                            1.0, 1.0,
                            0.0, 1.0
                        ],
                        texture: "test",
                        position: [0.5, 0.0, -5.0],
                        material: "textured"
                    }
        ]});

    };
}
));
