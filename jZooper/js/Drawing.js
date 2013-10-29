var JE = JE || {};

var Drawing = Drawing || 
{
    context: null,

    setDrawProperties: function(obj)
    {
        this.context.fillStyle = obj.fillStyle;
        this.context.lineWidth = obj.lineWidth;
        this.context.strokeStyle = obj.strokeStyle;
    },
    setFontType: function(obj)
    {
        this.context.font = obj.font;        
    },
    setFont: function(obj)
    {
        Drawing.setFontType(obj);
        this.context.textAlign = obj.textAlign;
        this.context.textBaseline = obj.textBaseline;
    },
    drawRect: function(obj)
    {
        this.context.beginPath();
        this.context.rect(obj.x, obj.y, obj.width, obj.height);
        this.context.closePath();
    },
    drawText: function(obj)
    {
        if (obj.fill) 
            this.context.fillText(obj.text, obj.x, obj.y);
    
        if (obj.stroke)
            this.context.strokeText(obj.text, obj.x, obj.y);
    },
    finishForm: function(obj)
    {
        if (obj.fill) 
            this.context.fill();
        
        if (obj.stroke)
            this.context.stroke();
    },
    doDrawRect: function(obj)
    {
        this.setDrawProperties(obj);
        this.drawRect(obj);
        this.finishForm(obj);
    },
    doDrawText: function(obj)
    {
        this.setDrawProperties(obj);
        this.setFont(obj);
        this.drawText(obj);
    },
    
    meauseText: function(txt)
    {
        return this.context.measureText(txt);
    }

};

JE.Drawing = JE.Drawing || Drawing;
