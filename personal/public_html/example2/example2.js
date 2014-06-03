cns("sfme.userModules").defineUserModule("example2", "main", 
(function()
{
    this.sfmeAPI = null;
    this.init = function(sfmeAPI_)
    {
        this.sfmeAPI = sfmeAPI_;
        
            this.sfmeAPI.defineScene({
            objects: [
                /*
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
                    position: [-1.5, 0.0, -7.0]
                },*/
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
                    position: [0.5, 0.0, -5.0]
                }
        ]});

    };
}
));
