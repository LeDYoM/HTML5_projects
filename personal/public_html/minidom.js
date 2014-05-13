var MiniDom = (function(){
    return {
        loadFile: function(file,callback)
        {
            
        },
        loadScript: function(file,callback)
        {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", file);
            script.onload = callback;
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        byId: function(id_)
        {
            return document.getElementById(id_);
        },
        byClass: function(class_)
        {
            return document.getElementsByClassName(class_);
        },
        on: function(id_,event_,callback_)
        {
            var elem = null;
            if (typeof id_ === 'object')
            {
                elem = id_;
            }
            else
            {
                elem = MiniDom.byId(id_);
                if (!elem)
                {
                    elem = MiniDom.byClass(id_);
                }
            }

            if (elem)
            {
                elem.addEventListener(event_,callback_);
            }
            return elem;
        },
        build: function(type_, desc_)
        {
            var elem = "<" + type_ + " ";
            var propAdded = false;
            var textAdded = false;
            var text = "";
            for (var key in desc_)
            {
                propAdded = true;
                if (key === "innerText")
                {
                    textAdded = true;
                    text = desc_[key];
                }
                else
                {
                    elem += (key + "='" + desc_[key] + "' ");
                }
            }
            
            if (textAdded)
            {
                elem += ">" + text + "</" + type_;
            }
            else if (propAdded)
            {
                elem += "/";
            }
            elem += ">";                
            return elem;
        }
    };
}());
