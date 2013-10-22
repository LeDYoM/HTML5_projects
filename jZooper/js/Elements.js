var JE = JE || {};

var PEObject = function()
{
    this.typeName = "";
    var metaType = null;
    var configured = false;
    var context = null;
    
    PEObject.prototype.setDrawProperties = function()
    {
        JE.Drawing.setDrawProperties(this.context,this);
    };

    PEObject.prototype.setFont = function()
    {
        JE.Drawing.setFont(this.context,this);
    };

    PEObject.prototype.drawRect = function()
    {
        JE.Drawing.drawRect(this.context,this);
    };

    PEObject.prototype.drawText = function()
    {
        JE.Drawing.drawText(this.context,this);
    };

    PEObject.prototype.finishForm = function()
    {
        JE.Drawing.finishForm(this.context,this);
    };

    PEObject.prototype.configure = function(typeName, metaT, base, context)
    {
        if (!configured)
        {
            this.typeName = typeName;
            metaType = metaT;
            this.context = context;
            
          
            base = base || {};
            var def = metaType.defaults || {};
            for (var attr in metaType.defaults) {
                this[attr] = base[attr] || metaType.defaults[attr];
            }
            
            this.render = metaType.methods.render;
            
            configured = true;
        }
        return this;
    };    
};

var MetaElementsManager = MetaElementsManager || function(context)
{
    var context = context;

    var registeredElements = {
        core:
        {
            quad:
            {
                defaults:
                {
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 1,
                    fill: true,
                    stroke: false,
                    fillStyle: "black",
                    strokeStyle: "white",
                    lineWidth: 1
                },
                methods:
                {
                    render: function()
                    {
                        this.setDrawProperties();
                        this.drawRect();
                        this.finishForm();
                    }
                }
            },
            text:
            {
                defaults:
                {
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 1,
                    fill: true,
                    text: "Hello World",
                    stroke: true,
                    fillStyle: "black",
                    strokeStyle: "yellow",
                    lineWidth: 2,
                    font: "80 Calibri",
                    textAlign: "left",
                    textBaseline: "top"
                },
                methods:
                {
                    render: function()
                    {
                        this.setDrawProperties();
                        this.setFont();
                        this.drawText();
                    }
                }
            }
        }
    };

    function elementNameArray(typeName)
    {
        return typeName.split(".");
    }
    
    function getMetaElement(typeName)
    {
        var data = elementNameArray(typeName);
        var tmp = registeredElements;
        for (var i=0; i< data.length; ++i)
        {
            tmp = tmp[data[i]];
        }
        return tmp;
    }
    
    MetaElementsManager.prototype.newElement = function(typeName,base)
    {
        var tmp = new PEObject();
        
        tmp.configure(typeName,getMetaElement(typeName),base,context);

        return tmp;
    };

    MetaElementsManager.prototype.newElementFromDescription = function(base)
    {
        return this.newElement(base.type,base);
    };
    
    MetaElementsManager.prototype.preprocessElementArray = function(base)
    {
        for (var i in base)
        {
            base[i] = this.newElementFromDescription(base[i]);
        }
        return base;
    };
    
};

JE.MetaElementsManager = JE.MetaElementsManager || MetaElementsManager;

//var mem = new MetaElementsManager("fdfdf");
