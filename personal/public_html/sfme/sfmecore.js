(function()
{
    this.byId =  function(id_)
    {
        return document.getElementById(id_);
    };
    this.byClass = function(class_)
    {
        return document.getElementsByClassName(class_);
    };
    this.byTag = function(class_)
    {
        // Warning: this method returns an array.
        return document.getElementsByTagName(class_);
    };
    this.on = function(id_,event_,callback_)
    {
        var elem = null;
        if (typeof id_ === 'object')
        {
            elem = id_;
        }
        else
        {
            elem = this.byId(id_);
            if (!elem)
            {
                elem = this.byClass(id_);
                if (!elem)
                {
                    elem = this.byTag(id_);
                    if (elem)
                    {
                        elem = elem[0];
                    }
                }
            }
        }

        if (elem)
        {
            elem.addEventListener(event_,callback_);
        }
        return elem;
    };
    this.isObject = function(obj)
    {
        return (typeof obj === "obj");
    };
    this.typeName = function(obj)
    {
        return Object.prototype.toString.call(obj).slice(8, -1);        
    };
    this.isType = function(obj,typeName)
    {
        return this.typeName(obj) === typeName;
    };
}
).apply(cns("sfme.utils"));

(function()
{
    var utils = cns("sfme.utils");
    this.ready = false;
    this.canvas = null;

    this.init = function(options)
    {
        options = options || { };
        
        if (utils.isType(options.canvas, "canvas"))
        {
            // There is a valid canvas object. We can use it.
            this.canvas = options.canvas;
        } else
        {
            // There is no canvas object. Let's create it.
            var parent = (utils.isType(options.parent, "div")) ? options.parent : utils.byTagName("body");
            
            
        }
        this.ready = true;
    };

    this.doSomething = function()
    {
        alert("works!");
    };   
    
    function createCanvas(parent,id_,w_,h_)
    {
        var temp = document.createElement("canvas");
        temp.id = id_;
        temp.width = w_;
        temp.height = h_;
        parent.appendChild(temp);
        return temp;
    }    
}
).apply(cns("sfme.core"));
