cns("sfme.userModules").defineUserModule("example1", "main", 
(function()
{
    this.sfmeAPI = null;
    this.init = function(sfmeAPI_)
    {
        this.sfmeAPI = sfmeAPI_;
        
            this.sfmeAPI.defineScene({
            objects: [
                {
                    id: "triangle",
                    vertex: [
                        0.0,  1.0,  0.0,
                       -1.0, -1.0,  0.0,
                        1.0, -1.0,  0.0
                    ],
                    colors: [
                        1.0, 0.0, 0.0, 1.0,
                        0.0, 1.0, 0.0, 1.0,
                        0.0, 0.0, 1.0, 1.0
                    ]
                },
                {
                    id: "quad",
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
                    ]
                }
        ]});

    };
}
));
