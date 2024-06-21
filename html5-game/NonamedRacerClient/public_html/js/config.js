var GameConfig =
{
    debug: true,
    timeBased: false,
    tColors: false,
    imageSmoothingEnabled: false,
    minGameOverShapeSeparation: 4,
   
    createHTML: function()
    {
        var html = "";
        
        if (GameConfig.debug)
        {
            for (var key in this)
            {
                if (this.hasOwnProperty(key))
                {
                    var type = typeof (this[key]);
                    if (type === "boolean")
                    {
                        html += this.createCheckBox(key,this[key]);
                    }
                }
            }

            html += GameConfig.createButtons();
        }
        document.getElementById("debugControls").innerHTML = html;
    },
    
    createCheckBox: function(id,checked)
    {
        return "<input type='checkbox' id='"+id+"' value='"+id+"'"+(checked === true ? " checked" : "")+" onclick='GameConfig.configVarChanged(this);'>"+id+"<br>";
    },
    
    createButtons: function()
    {
        return "<button id='forcegameover' onClick='GameSingleton.gameSingleton.forceGameOver();'>Force Game Over</button>";
    },
    
    configVarChanged: function(element)
    {
        var a = 1;
        if (GameConfig.hasOwnProperty(element.id))
        {
            if (element.type === "checkbox" && (typeof (this[element.id])) === "boolean")
            {
                this[element.id] = element.checked;
                GameConfig.createHTML();
                onResizeGlobal();
            }
        }
    }
};
