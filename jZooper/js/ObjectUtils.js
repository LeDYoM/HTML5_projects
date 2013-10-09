var ObjectUtils = ObjectUtils || {};

ObjectUtils.merge = function(baseObject,extendObject)
{
    if (baseObject === null || typeof baseObject !== "object")
        return baseObject;

    for (var attr in baseObject) {
        if (baseObject.hasOwnProperty(attr))
            baseObject[attr] = extendObject[attr] || ObjectUtils.merge(baseObject[attr],extendedObject[attr]);
    }
    return baseObject;
};

ObjectUtils.inverseMerge = function(baseObject,extendObject)
{
    if (baseObject === null || typeof baseObject !== "object")
        return extendObject;

    for (var attr in extendObject) {
        if (extendObject.hasOwnProperty(attr))
            baseObject[attr] = baseObject[attr] || ObjectUtils.inverseMerge(baseObject[attr],extendObject[attr]);
    }
    return baseObject;
};

ObjectUtils.clone = function(baseObject)
{
    if (baseObject === null || typeof baseObject !== "object")
        return baseObject;

    var copy = baseObject.constructor();
    for (var attr in baseObject) {
        if (baseObject.hasOwnProperty(attr))
            copy[attr] = ObjectUtils.clone(baseObject[attr]);
    }
    return copy;
};

ObjectUtils.cloneMerge = function(baseObject,extendObject)
{
    if (baseObject === null || typeof baseObject !== "object")
        return baseObject;

    var copy = baseObject.constructor();
    for (var attr in baseObject) {
        if (baseObject.hasOwnProperty(attr))
            copy[attr] = extendObject[attr] || ObjectUtils.cloneMerge(obj[attr],extendedObject[attr]);
    }
    return copy;
};


ObjectUtils.toStr = function(object,deepLevel)
{
    function generateSpaces(ns)
    {
        var t = "";
        for (var i = 0; i < ns; ++i)
        {
            t += "   ";
        }
        return t;
    }
    
    var deepLevel = deepLevel || 0;
    var r = r || "";
    if (object === null || typeof object !== "object")
    {
        r += object.toString();
        r += "\n";
        return r;
    }

    r += "\n";
    r += generateSpaces(deepLevel) + "{\n";
    for (var attr in object) {
        if (object.hasOwnProperty(attr))
        {
            r += generateSpaces(deepLevel+1) + attr + ": " + ObjectUtils.toStr(object[attr],deepLevel + 1);
        }
    }
    r += generateSpaces(deepLevel) + "}\n\n";

    return r;
};
