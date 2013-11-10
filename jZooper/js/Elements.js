var JE = JE || {};

var PEObject = function()
{
    this.typeName = "";
    this.metaType = null;
    this.configured = false;
    this.needsUpdate = true;

    this.update = function()
    {
        if (this.needsUpdate)
        {

            if (this.preRender)
            {

                this.preRender();
            }
            this.needsUpdate = false;
        }
        this.render();
    };

    this.configure = function(typeName, metaT, base)
    {
        if (!this.configured)
        {
            this.typeName = typeName;
            this.metaType = metaT;

            base = base || {};
            var def = this.metaType.defaults || {};
            for (var attr in this.metaType.defaults) {
                this[attr] = base[attr] || def[attr];
            }
            
            this.render = this.metaType.methods.render;
            this.preRender = this.metaType.methods.preRender;
            
            this.configured = true;
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
                    incrementWidth: 100,
                    incrementHeight: 20,
                    fontSize: 60,
                    fontType: "Arial",
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
                        var pd = this.metaType.privateDefaults;
                        this.private = {};
                        JE.Drawing.setFontType({font: pd.fontSize+"px " + pd.fontType});
                        this.private.textw = JE.Drawing.meauseText(this.text).width;
                        this.private.texth = pd.fontSize;
                        
                        // Set up the quad
                        this.private.quad =pd.quad;
                        this.private.quad.width = this.private.textw + pd.incrementWidth;
                        this.private.quad.height = this.private.texth + pd.incrementHeight;
                        
                        // Set up the text label
                        this.private.text = pd.text;
                        this.private.text.text = this.text;
                        this.private.text.x = this.private.quad.x + (this.private.quad.width / 2);
                        this.private.text.y = this.private.quad.y + (this.private.quad.height / 2);
                    },
                    render: function()
                    {
                        JE.Drawing.doDrawRect(this.private.quad);
                        JE.Drawing.doDrawText(this.private.text);
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
