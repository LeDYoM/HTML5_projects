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
    this.valueOrResult = function(obj,propName)
    {
        var prop = obj[propName];
        
        if (typeof prop === "function")
        {
            return prop.call(obj);
        }
        else
        {
            return prop;
        }
    }
    this.cloneObject = function(obj)
    {   
        if (obj === null || typeof obj !== "object") return obj;

        // Handle Date
        if (obj instanceof Date)
        {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array)
        {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; i++)
            {
                copy[i] = this.cloneObject(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object)
        {
            var copy = {};
            for (var attr in obj)
            {
//                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
                if (obj.hasOwnProperty(attr))
                {
                    // mesh will be recreated.
                    if (attr !== "mesh")
                    {
                        if (attr === "parentObject" || attr === "parentScene" || attr === "canvas" || attr === "parentCamera" || attr === "texture" || attr === "mesh")
                        {
                            copy[attr] = obj[attr];
                        }
                        else
                        {
                            copy[attr] = this.cloneObject(obj[attr]);
                        }
                    }
                }
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
}
).apply(cns("sfme.utils"));

(function()
{
    this.verbose =  function(text)
    {
        window.console.log(text);
    };
    
    this.debug =  function(text)
    {
        window.console.log(text);
    };
    
    this.error =  function(text)
    {
        window.console.log(text);        
    }
    
}
).apply(cns("sfme.log"));
