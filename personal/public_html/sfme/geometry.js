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
    
    this.vertexFor = function(meshType,size)
    {
        var vertex = [];
        
        switch (meshType)
        {
            case this.MeshType.Quad:

                var qVertex = _.addVertexFaceFromCenter([[-1.0,-1.0,1.0],
                                                    [1.0,-1.0,1.0],
                                                    [1.0,1.0,1.0],
                                                    [-1.0,1.0,1.0]],size);
                                                    
                    var matrix = mat4.identity(mat4.create());
//                    mat4.rotate(matrix,Math.PI,[0,1,0],matrix);
                    vertex = transformVertexArray(matrix,qVertex);

                break;
            case this.MeshType.Triangle:
                vertex = _.addVertexFaceFromCenter([[0.0,1.0,1.0],
                                                [-1.0,-1.0,1.0],
                                                [1.0,-1.0,1.0]],size);
                break;
            case this.MeshType.CubeType0:
                    var qVertex = _.addVertexFaceFromCenter([[-1.0,-1.0,1.0], [1.0,-1.0,1.0], [1.0,1.0,1.0], [-1.0,1.0,1.0]],size);
                    // Front face
                    var matrix = mat4.identity(mat4.create());
//                    mat4.rotate(matrix,Math.PI,[0,1,0],matrix);
                    vertex = vertex.concat(transformVertexArray(matrix,qVertex));
                    // Back face
                    matrix = mat4.identity(mat4.create());
                    mat4.rotate(matrix,Math.PI,[0,1,0],matrix);
//                    mat4.translate(matrix,[2.0,2.0,0.0],matrix);
                    vertex = vertex.concat(transformVertexArray(matrix,qVertex));
/*
                vertex=vertex.concat(_.addVertexFaceFromCenter([[-1.0,-1.0,-1.0],
                                                        [-1.0,1.0,-1.0],
                                                        [1.0,1.0,-1.0],
                                                        [1.0,-1.0,-1.0]],size));
*/
                                                       /*
                    // Top face
                    vertex=vertex.concat(_.addVertexFaceFromCenter([[-1.0,1.0,-1.0],
                                                        [-1.0,1.0,1.0],
                                                        [1.0,1.0,1.0],
                                                        [1.0,-1.0,-1.0]],size));
                                                    
                    // Bottom face
                    vertex=vertex.concat(_.addVertexFaceFromCenter([[-1.0,-1.0,-1.0],
                                                        [1.0,-1.0,-1.0],
                                                        [1.0,-1.0,1.0],
                                                        [-1.0,-1.0,1.0]],size));
                    // Right face
                    vertex=vertex.concat(_.addVertexFaceFromCenter([[1.0,-1.0,-1.0],
                                                        [1.0,1.0,-1.0],
                                                        [1.0,1.0,1.0],
                                                        [1.0,-1.0,1.0]],size));
                    // Left face
                    vertex=vertex.concat(_.addVertexFaceFromCenter([[-1.0,-1.0,-1.0],
                                                        [-1.0,-1.0,1.0],
                                                        [-1.0,1.0,1.0],
                                                        [-1.0,1.0,-1.0]],size));
                                                    */
                break;
        }
        return vertex;
    };
}
).apply(cns("sfme.geometry"));
