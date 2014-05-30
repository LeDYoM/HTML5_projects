function cns(namespace, obj_) {
    var nsparts = namespace.split(".");
    var parent = window;
    
    // loop through the parts and create a nested namespace if necessary
    for (var i = 0; i < nsparts.length; i++) {
        var partname = nsparts[i];
        // check if the current parent already has the namespace declared
        // if it isn't, then create it
        if (typeof parent[partname] === "undefined") {
            parent[partname] = {};
        }
        // get a reference to the deepest element in the hierarchy so far
        parent = parent[partname];
    }
    // the parent is now constructed with empty namespaces and can be used.
    // we return the outermost namespace
    if (typeof obj_ === "object")
    {
        for(var propertyName in obj_)
        {
            parent[propertyName] = obj_[propertyName];
        }
    }
    
    return parent;
}

(function()
{
    var this_ = this;
    this.loadjscssfile = function (filename, filetype, callback)
    {
        var fileref = null;
        if (filetype === "js")
        {
            fileref = document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src", filename);
        }
        else if (filetype === "css")
        {
            var fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }

        if (fileref !== null)
        {
            fileref.onload = callback;
        }
        return fileref;
    };
    this.loadexecutejscssfile = function(filename, filetype, callback)
    {
        var fileref = this.loadjscssfile(filename, filetype, callback);

        if (fileref !== null)
        {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
        return fileref;
    };
    var loadedScripts = [];
    
    this.loadScript = function (file,callback)
    {
        if (loadedScripts.indexOf(file) !== -1)
        {
            callback();
        }
        else
        {
            loadedScripts.push(file);
            this.loadexecutejscssfile(file,"js", callback);
        }
    };
    this.loadScriptLibrary = function(directory, fileList, callback)
    {
        var fl = fileList.length;
        var loadedCounter = 0;
       
        fileList.forEach(function(file)
        {
            this_.loadScript(directory + "/" + file, function()
            {
                loadedCounter++;
                if (loadedCounter >= fl)
                {
                    callback();
                }
            });
        });
    };
    
    this.loadFile = function(file, callback)
    {
        var XMLHttpRequestObject = false; 
 
        if (window.XMLHttpRequest)
        {
            XMLHttpRequestObject = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            XMLHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if(XMLHttpRequestObject) 
        {
            XMLHttpRequestObject.open("GET", file); 
 
            XMLHttpRequestObject.onreadystatechange = function()
            { 
                if (XMLHttpRequestObject.readyState === 4 && XMLHttpRequestObject.status === 200)
                {
                    callback(XMLHttpRequestObject.responseText);
                }
            };
 
            XMLHttpRequestObject.send(null); 
        }
    };

}).apply(cns("sfme.internals"));

(function()
{
    var sCounter = 0;
    window.loadsmf = function(options)
    {
        if (sCounter === 0)
        {
            cns("sfme.internals").loadScriptLibrary("sfme",["sfmecore.js", "utils.js", 
                "smanager.js","webglw.js", "pmanager.js"],
            function (e)
            {
                e;
                cns("sfme.core").init(options);
            });
        }
    };
})();
