var JE = JE || {};

var PEObject = function()
{
    var typeName = "";
    var metaType = null;
    var configured = false;
    var needsUpdate = true;

    PEObject.prototype.update = function()
    {       
        if (needsUpdate)
        {
            console.log(needsUpdate);

            if (this.preRender)
            {
                this.preRender();
            }
            needsUpdate = false;
        }
        this.render();
    };

    PEObject.prototype.configure = function(typeName, metaT, base)
    {
        if (!configured)
        {
            PEObject.typeName = typeName;
            metaType = metaT;
          
            base = base || {};
            var def = metaType.defaults || {};
            for (var attr in metaType.defaults) {
                this[attr] = base[attr] || def[attr];
            }
            
            this.render = metaType.methods.render;
            this.preRender = metaType.methods.preRender;
            
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
                        JE.Drawing.doDrawRect(this);
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
                        JE.Drawing.doDrawText(this);
                    }
                }
            }
        },
        ui:
        {
            button:
            {
                defaults:
                {
                    x: 0,
                    y: 0,
                    text: "No text"
                },
                privateDefaults:
                {
                    quad:
                    {
                        x: 0,
                        y: 0,
                        width: 1,
                        height: 1,
                        fill: true,
                        stroke: true,
                        fillStyle: "#0000aa",
                        strokeStyle: "#119922",
                        lineWidth: 2               
                    },
                    text:
                    {
                        x: 0,
                        y: 0,
                        fill: true,
                        text: "Hello World",
                        stroke: true,
                        fillStyle: "#991100",
                        strokeStyle: "#990011",
                        lineWidth: 1,
                        textAlign: "center",
                        textBaseline: "middle"
                    }
                },
                methods:
                {
                    preRender: function()
                    {
                        console.log(this);
                        this.private = {};
                        JE.Drawing.setFontType({font: "30px Arial"});
                        this.private.textw = this.context.measureText(txt).width;
                        this.private.texth = 30;
                        
                        // Set up the quad
                        this.private.quad = this.metaType.privateDefaults.quad;
                        this.private.quad.w = this.private.textw + 100;
                        this.private.quad.h = this.private.texth + 20;
                        
                        // Set up the text label
                        this.private.text = this.metaType.privateDefaults.text;
                        this.private.text.text = this.text;
                    },
                    render: function()
                    {
                        JE.Drawing.doDrawRect(this);
                        JE.Drawing.doDrawText(this);
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
