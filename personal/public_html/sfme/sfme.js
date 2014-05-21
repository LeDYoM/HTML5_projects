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
    this.loadScriptLibrary = function(fileList, callback)
    {
        var fl = fileList.length;
        var loadedCounter = 0;
       
        fileList.forEach(function(file)
        {
            this_.loadScript(file, function()
            {
                loadedCounter++;
                if (loadedCounter >= fl)
                {
                    callback();
                }
            });
        });
    };
    
}).apply(cns("sfme.internals"));

(function()
{
    var sCounter = 0;
    window.loadsmf = function(options)
    {
        if (sCounter === 0)
        {
            cns("sfme.internals").loadScriptLibrary(["sfme/sfmecore.js", "sfme/utils.js", "sfme/webglw.js"], function (e)
            {
                e;
                cns("sfme.core").init(options);
            });
        }
    };
    window.updateFrame = function()
    {
	// Clear the canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
	
            // Do a complete rotation every 10 seconds.
        var time = Date.now() % 10000;
        var angleInDegrees = (360.0 / 10000.0) * time;
        var angleInRadians = angleInDegrees / 57.2957795;

        var xyz = vec3.create();

        // Draw the triangle facing straight on.
        mat4.identity(modelMatrix);
        mat4.rotateZ(modelMatrix, angleInRadians);           
        drawTriangle(triangleColorBufferObject1);

        // Draw one translated a bit down and rotated to be flat on the ground.
        mat4.identity(modelMatrix);
        xyz[0] = 0; xyz[1] = -1; xyz[2] = 0;
        mat4.translate(modelMatrix, xyz);
        mat4.rotateX(modelMatrix, 90 / 57.2957795);
        xyz[0] = 0; xyz[1] = 0; xyz[2] = 1;
        mat4.rotate(modelMatrix, angleInRadians, xyz);           
        drawTriangle(triangleColorBufferObject2);

        // Draw one translated a bit to the right and rotated to be facing to the left.
        mat4.identity(modelMatrix);
        xyz[0] = 1; xyz[1] = 0; xyz[2] = 0;
        mat4.translate(modelMatrix, xyz);
        mat4.rotateY(modelMatrix, 90 / 57.2957795);
        xyz[0] = 0; xyz[1] = 0; xyz[2] = 1;
        mat4.rotate(modelMatrix, angleInRadians, xyz);     
        drawTriangle(triangleColorBufferObject3);
    
        // Send the commands to WebGL
	gl.flush();
	
	// Request another frame
	window.requestAnimFrame(render, canvas);
}


    }
})();
