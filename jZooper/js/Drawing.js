var JE = JE || {};

var Drawing = Drawing || 
{   
    setDrawProperties: function(context,obj)
    {
        context.fillStyle = obj.fillStyle;
        context.lineWidth = obj.lineWidth;
        context.strokeStyle = obj.strokeStyle;
    },
    setFont: function(context,obj)
    {
        context.font = obj.font;
        context.textAlign = obj.textAlign;
        context.textBaseline = obj.textBaseline;
    },
    drawRect: function(context,obj)
    {
        context.beginPath();
        context.rect(obj.x, obj.y, obj.width, obj.height);
        context.closePath();
    },
    drawText: function(context,obj)
    {
        if (obj.fill) 
            context.fillText(obj.text, obj.x, obj.y);
    
        if (obj.stroke)
            context.strokeText(obj.text, obj.x, obj.y);
    },
    finishForm: function(context,obj)
    {
        if (obj.fill) 
            context.fill();
        
        if (obj.stroke)
            context.stroke();
    },
    doDrawRect: function(context,obj)
    {
        JE.Drawing.setDrawProperties(context,obj);
        JE.Drawing.drawRect(context,obj);
        JE.Drawing.finishForm(context,obj);
    }
};

JE.Drawing = JE.Drawing || Drawing;
