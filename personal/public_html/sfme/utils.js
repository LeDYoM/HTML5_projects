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
    this.verbose =  function(text)
    {
        window.console.log(text);
    };
}
).apply(cns("sfme.log"));

(function()
{
    var requestId = 0;
    this.update = function()
    {
        
    }
}
).apply(cns("sfme.internals.mainLoop"));
