(function()
{
    this.addFace = function (obj,vertex,indices,colors,textureMode)
    {
        obj.mesh = obj.mesh || {};
        obj.mesh.faces = obj.mesh.faces || [];
        var index = obj.mesh.faces.length;
        
        obj.mesh.faces[index] = obj.mesh.faces[index] || {};
        obj.mesh.faces[index].vertex = obj.mesh.faces[index].vertex || [];
        obj.mesh.faces[index].vertex = vertex;
        obj.mesh.faces[index].indices = obj.mesh.faces[index].indices || [];
        obj.mesh.faces[index].indices = indices;
        obj.mesh.faces[index].colors = obj.mesh.faces[index].colors || [];
        obj.mesh.faces[index].colors = colors;
        obj.mesh.faces[index].textureCoords = [[0.0, 0.0],[1.0, 0.0],[1.0, 1.0],[0.0, 1.0]];
        
        obj.mesh.getMeshVertexArray = function()
        {
            var v = [];
            for (var i=0;i<this.faces.length;++i)
            {
                for (var j=0;j<this.faces[i].vertex.length;++j)
                {
                    v = v.concat(this.faces[i].vertex[j]);
                }
            }
            return v;
        };

        obj.mesh.getNumVertexForFace = function(face)
        {
            return this.faces[face].vertex.length;
        };

        obj.mesh.getNumVertex = function()
        {
            var nv = 0;
            for (var i=0;i<this.faces.length;++i)
            {
                nv += this.getNumVertexForFace(i);
            }
            return nv;
        };

        obj.mesh.getMeshIndicesArray = function()
        {
            var ind = [];
            var baseIndex = 0;
            for (var i=0;i<this.faces.length;++i)
            {
                for (var j=0;j<this.faces[i].indices.length;++j)
                {
                    var trIndex = baseIndex + this.faces[i].indices[j];
                    ind = ind.concat(trIndex);
                }
                baseIndex += this.faces[i].vertex.length;
            }
            return ind;
        };
            
        obj.mesh.getNumIndicesForFace = function(face)
        {
            return this.faces[face].indices.length;
        };

        obj.mesh.getNumIndices = function()
        {
            var nv = 0;
            for (var i=0;i<this.faces.length;++i)
            {
                nv += this.getNumIndicesForFace(i);
            }
            return nv;
        };

        obj.mesh.getMeshColorsArray = function()
        {
            var c = [];
            for (var i=0;i<this.faces.length;++i)
            {
                for (var j=0;j<this.faces[i].colors.length;++j)
                {
                    c = c.concat(this.faces[i].colors[j]);
                }
            }
            return c;
        };

        obj.mesh.getNumColorsForFace = function(face)
        {
            return this.faces[face].colors.length;
        };

        obj.mesh.getNumColors = function()
        {
            var nc = 0;
            for (var i=0;i<this.faces.length;++i)
            {
                nc += this.getNumColorsForFace(i);
            }
            return nc;
        };
        
        obj.mesh.getMeshTextureCoordsArray = function()
        {
            var tc = [];
            for (var i=0;i<this.faces.length;++i)
            {
                for (var j=0;j<this.faces[i].textureCoords.length;++j)
                {
                    tc = tc.concat(this.faces[i].textureCoords[j]);
                }
            }
            return tc;
        };
    };
    

    function transformVertex(matrix,v)
    {
        var t = mat4.multiplyVec3(matrix,v,vec3.create());
        return [t[0], t[1], t[2]];
    }

    this.addTransformedFace = function(obj,transformMatrixFunc,parameters,originalFace,indices,colors)
    {
        var vertex = [];
        var matrix = transformMatrixFunc(parameters);
        for (var i=0;i<originalFace.length;++i)
        {
            vertex.push(transformVertex(matrix,originalFace[i]));
        }
        this.addFace(obj,vertex,indices,colors);
    };

    this.addTransformedFaces = function(obj,transformMatrixFunc,parameters,originalFace,indices,colors)
    {
        for (var param in parameters)
        {
            this.addTransformedFace(obj,transformMatrixFunc,parameters[param],originalFace,indices,colors);
        }
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

    function cloneColors(color,numVertex)
    {
        var colors = [];
        for (var i=0;i<numVertex;++i)
        {
            colors.push(color);
        }
        return colors;
    }
    this.createGeometry = function(obj,meshType,size,color)
    {
        obj.vertex = [];
       
        switch (meshType)
        {
            case this.MeshType.Quad:

                var qVertex = _.addVertexFaceFromCenter([[-1.0,-1.0,1.0],
                                                    [1.0,-1.0,1.0],
                                                    [1.0,1.0,1.0],
                                                    [-1.0,1.0,1.0]],size);
                var colors = cloneColors(color,qVertex.length);

                mesh.addFace(obj,qVertex,[0,1,2,0,2,3],colors);
                
                break;
            case this.MeshType.Triangle:
                var qVertex = _.addVertexFaceFromCenter([[0.0,1.0,1.0],
                                                [-1.0,-1.0,1.0],
                                                [1.0,-1.0,1.0]],size);
                var colors = cloneColors(color,qVertex.length);
                mesh.addFace(obj,qVertex,[0,1,2],colors);

                break;
            case this.MeshType.CubeType0:
                var qVertex = _.addVertexFaceFromCenter([[-1.0,-1.0,1.0], [1.0,-1.0,1.0], [1.0,1.0,1.0], [-1.0,1.0,1.0]],size);
                var colors = cloneColors(color,qVertex.length);
                mesh.addTransformedFaces(obj,rotationMatrix,[
                    // Front face
                    {
                        angle: 0,
                        axis: [0,0,0]
                    },
                    /*
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
                    },*/                
                ],qVertex,[0,1,2,0,2,3],colors);
                break;
        }
        obj.vertex = obj.mesh.getMeshVertexArray();
        obj.vertexIndices = obj.mesh.getMeshIndicesArray();
        obj.colors = obj.mesh.getMeshColorsArray();
    };
}
).apply(cns("sfme.geometry"));
