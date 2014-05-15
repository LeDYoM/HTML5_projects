(function()
{

    var THIS = this;

    function defined(x)
    {
        return typeof x !== 'undefined';
    }

    this.ready = false;

    this.init = function()
    {
        this.ready = true;
    };

    this.doSomething = function()
    {
        alert("works!");
    };   

    var options = {
        x : 123,
        y : 'abc'
        };

    this.define = function(key, value)
    {
        if(defined(options[key]))
        {
            options[key] = value;
        }
    };
    
    

}).apply(cns("sfme.core"));
