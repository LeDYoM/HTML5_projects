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
    
}
).apply(cns("sfme.types"));
