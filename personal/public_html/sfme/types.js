(function()
{
    this.scale1 = function(in_,scale_,out_)
    {
        if (!out_)
        {
            out_ = [];
        }
        for (var i=0;i<in_.length;++i)
        {
            out_[i]=in_[i]*scale_;
        }
        return out_;
    };
    this.scale3v = function(in_,scale_,out_)
    {
        if (!out_)
        {
            out_ = [];
        }

        for (var i=0;i<in_.length;++i)
        {
            out_[i]=in_[i]*scale_[i];
        }
        return out_;
    };
    this.scalemat43v = function(in_,scale_,out_)
    {
        if (!out_)
        {
            out_ = mat4.create();
        }
        for (var i=0;i<in_.length;++i)
        {
            out_[i]=in_[i]*scale_[i];
        }
        return out_;
    };
    this.addVertexFace = function(vertexArray)
    {
        var v = [];
        for (var i=0;i<vertexArray.length;++i)
        {
            v=v.concat(vertexArray[i]);
        }
        return v;
    };
    this.addVertexIndices = function(vertexIndices)
    {
        var v = [];
        for (var i=0;i<vertexIndices.length;++i)
        {
            v=v.concat(vertexIndices[i]);
        }
        return v;   
    }
    this.addVertexFaceFromCenter = function(vertexArray,size)
    {
        var v = [];
        for (var i=0;i<vertexArray.length;++i)
        {
            var temp = this.scale1(this.scale3v(vertexArray[i],size),0.5);
//            v=v.concat(temp);
            v.push(temp);
        }
        return v;        
    }
}
).apply(cns("sfme.types"));

(function()
{
    this.create = function(vec)
    {
        var obj = new glMatrixArrayType(3);
        if(vec)
        {
            obj[0] = vec[0];
            obj[1] = vec[1];
            obj[2] = vec[2];
        }
        obj.negate = function() {
            this[0] *= -1;
            this[1] *= -1;
            this[2] *= -1;            
        };
        return obj;
    };
}
).apply(cns("sfme.types.vector3"));
