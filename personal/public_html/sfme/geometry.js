(function()
{
    var _ = cns("sfme.types");
    
    this.MeshType = {
        Triangle: 0,
        Quad: 1,
        CubeType0: 2
    };
    
    function transformVertex(matrix,v)
    {
        return mat4.multiplyVec3(matrix,v);
    }
    
    function transformVertexArray(matrix,vArray)
    {
        var result = [];
        
        for (var i=0;i<vArray.length;++i)
        {
            var vat = [vArray[i],vArray[i+1],vArray[i+2]];
            result = result.concat(transformVertex(matrix,vat));
            i+=2;
        }
        return result;
    }
    
    function rotationMatrix(params)
    {
        var matrix = mat4.identity(mat4.create());
        mat4.rotate(matrix,params.angle,params.axis,matrix);
        return matrix;
    }
    
    function processVertex(transformMatrixFunc,parameters,originalFace)
    {
        var vertex = [];
        for (var params in parameters)
        {
            var matrix = transformMatrixFunc(parameters[params]);
            vertex = vertex.concat(transformVertexArray(matrix,originalFace));
        }
        return vertex;
    }
    
    this.vertexFor = function(obj,meshType,size)
    {
        obj.vertex = [];
        
        switch (meshType)
        {
            case this.MeshType.Quad:

                var qVertex = _.addVertexFaceFromCenter([[-1.0,-1.0,1.0],
                                                    [1.0,-1.0,1.0],
                                                    [1.0,1.0,1.0],
                                                    [-1.0,1.0,1.0]],size);
                                                    
                var matrix = mat4.identity(mat4.create());
                obj.vertex = transformVertexArray(matrix,qVertex);
                break;
            case this.MeshType.Triangle:
                var qVertex = _.addVertexFaceFromCenter([[0.0,1.0,1.0],
                                                [-1.0,-1.0,1.0],
                                                [1.0,-1.0,1.0]],size);
                var matrix = mat4.identity(mat4.create());
                obj.vertex = transformVertexArray(matrix,qVertex);
                break;
            case this.MeshType.CubeType0:
                var qVertex = _.addVertexFaceFromCenter([[-1.0,-1.0,1.0], [1.0,-1.0,1.0], [1.0,1.0,1.0], [-1.0,1.0,1.0]],size);
                obj.vertex = processVertex(rotationMatrix,[
                    // Front face
                    {
                        angle: 0,
                        axis: [0,0,0]
                    },
                    // Back face
                    {
                        angle: Math.PI,
                        axis: [0,1,0]
                    },
                    // Top face
                    {
                        angle: Math.PI/2,
                        axis: [-1,0,0]
                    },
                    // Bottom face
                    {
                        angle: Math.PI/2,
                        axis: [1,0,0]
                    },
                    // Right face
                    {
                        angle: Math.PI/2,
                        axis: [0,1,0]
                    },
                    // Left face
                    {
                        angle: Math.PI/2,
                        axis: [0,-1,0]
                    },                    
                ],qVertex);
                break;
        }
    };
}
).apply(cns("sfme.geometry"));
