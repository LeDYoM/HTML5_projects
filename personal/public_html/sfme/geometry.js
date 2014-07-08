(function()
{
    this.addFace = function (obj,vertex,indices)
    {
        obj.mesh = obj.mesh || {};
        obj.mesh.faces = obj.mesh.faces || [];
        var index = obj.mesh.faces.length;
        
        obj.mesh.faces[index] = obj.mesh.faces[index] || {};
        obj.mesh.faces[index].vertex = obj.mesh.faces[index].vertex || [];
        obj.mesh.faces[index].vertex = vertex;
        obj.mesh.faces[index].indices = obj.mesh.faces[index].indices || [];
        obj.mesh.faces[index].indices = indices;

    };

    function transformVertex(matrix,v)
    {
        return mat4.multiplyVec3(matrix,v);
    }

    this.addTransformedFace = function(obj,transformMatrixFunc,parameters,originalFace,indices)
    {
        var vertex = [];
        var matrix = transformMatrixFunc(parameters);
        for (var i=0;i<originalFace.length;++i)
        {
            vertex.push(transformVertex(matrix,originalFace[i]));
        }
        this.addFace(obj,vertex,indices);
    };

    this.addTransformedFaces = function(obj,transformMatrixFunc,parameters,originalFace,indices)
    {
        for (var param in parameters)
        {
            this.addTransformedFace(obj,transformMatrixFunc,parameters[param],originalFace,indices);
        }
    };

    this.getMeshVertexArray = function(obj)
    {
        var v = [];
        for (var i=0;i<obj.mesh.faces.length;++i)
        {
            for (var j=0;j<obj.mesh.faces[i].vertex.length;++j)
            {
                v = v.concat(obj.mesh.faces[i].vertex[j]);
            }
        }
        return v;
    };
    
    this.getMeshIndicesArray = function(obj)
    {
        var ind = [];
        var baseIndex = 0;
        for (var i=0;i<obj.mesh.faces.length;++i)
        {
            for (var j=0;j<obj.mesh.faces[i].indices.length;++j)
            {
                var trIndex = baseIndex + obj.mesh.faces[i].indices[j];
                ind = ind.concat(trIndex);
            }
            baseIndex += obj.mesh.faces[i].vertex.length;
        }
        return ind;
    };
}
).apply(cns("sfme.geometry.types"));

(function()
{
    var _ = cns("sfme.types");
    var mesh = cns("sfme.geometry.types");
    
    this.MeshType = {
        Triangle: 0,
        Quad: 1,
        CubeType0: 2
    };
       
    function rotationMatrix(params)
    {
        var matrix = mat4.identity(mat4.create());
        mat4.rotate(matrix,params.angle,params.axis,matrix);
        return matrix;
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
                mesh.addFace(obj,qVertex,[0,1,2,0,2,3]);
                
                break;
            case this.MeshType.Triangle:
                var qVertex = _.addVertexFaceFromCenter([[0.0,1.0,1.0],
                                                [-1.0,-1.0,1.0],
                                                [1.0,-1.0,1.0]],size);
                mesh.addFace(obj,qVertex,[0,1,2]);

                break;
            case this.MeshType.CubeType0:
                var qVertex = _.addVertexFaceFromCenter([[-1.0,-1.0,1.0], [1.0,-1.0,1.0], [1.0,1.0,1.0], [-1.0,1.0,1.0]],size);
//                mesh.addFace(obj,qVertex);
                mesh.addTransformedFaces(obj,rotationMatrix,[
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
                ],qVertex,[0,1,2,0,2,3]);
                break;
        }
        obj.vertex = mesh.getMeshVertexArray(obj);
        obj.vertexIndices = mesh.getMeshIndicesArray(obj);
    };
}
).apply(cns("sfme.geometry"));
