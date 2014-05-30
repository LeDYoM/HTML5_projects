(function sfmeObject()
{
    function initBuffers(gl)
    {
        triangleVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        var vertices = [
             0.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        triangleVertexPositionBuffer.itemSize = 3;
        triangleVertexPositionBuffer.numItems = 3;

        triangleVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
        var colors = [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        triangleVertexColorBuffer.itemSize = 4;
        triangleVertexColorBuffer.numItems = 3;


        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        vertices = [
             1.0,  1.0,  0.0,
            -1.0,  1.0,  0.0,
             1.0, -1.0,  0.0,
            -1.0, -1.0,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 4;

        squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        colors = [];
        for (var i=0; i < 4; i++) {
            colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 4;
        squareVertexColorBuffer.numItems = 4;
    }
}
).apply(cns("sfme.types"));

(function Vertex(size_)
{
    var data = new Float32Array(size_);

    this.setData = function(index,value)
    {
        data[index] = value;
    };
    
    this.v = function(index)
    {
        return data[index];
    };
    
    this.changeSize = function(newSize)
    {
        var tmp = new Vertex(newSize);
        for (var i=0;i<Math.min(newSize,data.length);++i)
        {
            tmp.setData(i,this.v(i));
        }
        return tmp;
    };
}
).apply(cns("sfme.types"));

(function Matrix(sizeY_,sizeX_)
{
    var sizeX = sizeX_;
    var sizeY = sizeY_;
    var totalSize = sizeX*sizeY;
    var data = new Float32Array(totalSize);
    
    for (var i=0;y<totalSize;++i)
    {
        data[i] = 0.0;
    }
    
    this.setDataYX = function(y,x,value)
    {
        data[(y*sizeY)+x] = value;
    };

    this.setDataXY = function(x,y,value)
    {
        this.setDataYX(y,x,value);
    };

    this.getDataYX = function(y,x)
    {
        return data[(y*sizeY)+x];
    };

    this.getDataXY = function(x,y)
    {
        return this.getDataYX(y,x);
    };
}
).apply(cns("sfme.types"));

(function Polygon(numVertex)
{
    this.constructor = new cns("sfme.types").Matrix(numVertex,3);
    
    this.other = function()
    {
        alert("Polygon!");
    };
}
).apply(cns("sfme.types"));

