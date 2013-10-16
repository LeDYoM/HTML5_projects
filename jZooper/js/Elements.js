var PEObject = function()
{
    this.typeName = "";
    var metaType = null;
    var configured = false;
    
    PEObject.prototype.configure = function(typeName, metaT, base)
    {
        if (!configured)
        {
            this.typeName = typeName;
            metaType = metaT;
          
            base = base || {};
            var def = metaType.defaults || {};
            for (var attr in metaType.defaults) {
                this[attr] = base[attr] || metaType.defaults[attr];
            }
            
            configured = true;
        }
        return this;
    };
};

var MetaElementsManager = MetaElementsManager || function()
{
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
                    fore: false,
                    fillStyle: "black",
                    foreStyle: "white"
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
    
    MetaElementsManager.prototype.newElement = function(typeName, base)
    {
        var tmp = new PEObject();
        tmp.configure(typeName,getMetaElement(typeName),base);

        return tmp;
    };

    MetaElementsManager.prototype.newElementFromDescription = function(base)
    {
        return newElement(base.type,base);
    };
};

var mem = new MetaElementsManager();
var obj = mem.newElement("core.quad");
console.log(obj);
