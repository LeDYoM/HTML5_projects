var Elements = Elements || function()
{
    var registeredElements = {};
    
    Elements.prototype.registerNewElement = function(elementType)
    {
        registeredElements[elementType.name] = elementType;
        console.log("Registered name:"+elementType.name);
        console.log("Registered:"+registeredElements[elementType.name]);
    };
    
    Elements.prototype.getNew = function(elemName)
    {
        console.log("Elem:"+registeredElements);
        console.log("Creating:"+registeredElements[elemName]);

        var tmp = new registeredElements[elemName]();
        console.log("Created element from type "+elemName+":"+tmp);
        return tmp;
    };
};

var BaseElement = BaseElement || function()
{
};


        
var ele = new Elements();

ele.registerNewElement(function()
            {
                this.name = "core/quad";
            }
        );

ele.getNew("core/quad");