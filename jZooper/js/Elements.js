var PEObject = function()
{
    this.typeName = "";
    var metaType = null;
    var configured = false;
    var context = null;
    
    PEObject.prototype.setDrawProperties = function()
    {
        context.fillStyle = this.fillStyle;
        context.lineWidth = this.lineWidth;;
        context.strokeStyle = this.strokeStyle;
    }

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
                    y: 2,
                    width: 1,
                    height: 1,
                    fill: true,
                    fore: false,
                    fillStyle: "black",
                    foreStyle: "white"
                },
                methods:
                {
                    render: function()
                    {
                        setDrawProperties();
                        context.beginPath();
                        context.rect(188, 50, 200, 100);
                        context.endPath();
                    }
                }
            },
            textLabel:
            {
                defaults:
                {
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 1,
                    fill: true,
                    fore: false,
                    fillStyle: "black",
                    foreStyle: "white"
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
        return newElement(base.type,base);
    };    
};

var mem = new MetaElementsManager("fdfdf");
var obj = mem.newElement("core.quad");
