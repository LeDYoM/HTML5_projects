cns("sfme.userModules").defineUserModule("example1", "main", 
(function()
{
    this.sfmeAPI = null;
    this.init = function(sfmeAPI_)
    {
        this.sfmeAPI = sfmeAPI_;
        
            this.sfmeAPI.defineScene({
            camera: {
                type: "perspective",
                angle: 45.0,
                ratio: "normal",
                zNear: 0.1,
                zFar: 100.0
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
                        1.0, 0.0, 0.0, 1.0,
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
                        0.5, 0.5, 1.0, 1.0,
                        0.5, 0.5, 1.0, 1.0,
                        0.5, 0.5, 1.0, 1.0,
                        0.5, 0.5, 1.0, 1.0
                    ],
                    position: [2.5, 0.0, -7.0],
                    material: "color_pass"
                }
        ]});

    };
}
));
