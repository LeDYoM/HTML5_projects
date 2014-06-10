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
                zFar: 100.0,
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
                                0.0, 0.0, 1.0, 1.0
                            ],

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
                            color: [1.0, 0.5, 1.0, 1.0]
                        }
                    }
                ]
            }
        });

    };
}
));
