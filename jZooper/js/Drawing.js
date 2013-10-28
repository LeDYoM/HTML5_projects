var JE = JE || {};

var Drawing = Drawing || 
{
    context: null,

    setDrawProperties: function(obj)
    {
        context.fillStyle = obj.fillStyle;
        context.lineWidth = obj.lineWidth;
        context.strokeStyle = obj.strokeStyle;
    },
    setFontType: function(obj)
    {
        context.font = obj.font;        
    },
    setFont: function(obj)
    {
        this.setFontType(obj);
        context.textAlign = obj.textAlign;
        context.textBaseline = obj.textBaseline;
    },
    drawRect: function(obj)
    {
        context.beginPath();
        context.rect(obj.x, obj.y, obj.width, obj.height);
        context.closePath();
    },
    drawText: function(obj)
    {
        if (obj.fill) 
            context.fillText(obj.text, obj.x, obj.y);
    
        if (obj.stroke)
            context.strokeText(obj.text, obj.x, obj.y);
    },
    finishForm: function(obj)
    {
        if (obj.fill) 
            context.fill();
        
        if (obj.stroke)
            context.stroke();
    },
    doDrawRect: function(obj)
    {
        JE.Drawing.setDrawProperties(context,obj);
        JE.Drawing.drawRect(context,obj);
        JE.Drawing.finishForm(context,obj);
    },
    doDrawText: function(context,obj)
    {
        JE.Drawing.setDrawProperties(context,obj);
        JE.Drawing.setFont(context,obj);
        JE.Drawing.drawText(context,obj);
    }

};

JE.Drawing = JE.Drawing || Drawing;
