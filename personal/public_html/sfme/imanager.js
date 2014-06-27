(function()
{
    var ready = false;
    
    this.init = function()
    {
        ready = true;
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
    };
    
    var inputEvents = [];
    
    function handleKeyDown(event)
    {
        event.preventDefault();
        inputEvents.push({type:"KeyDown",evt: event});
    }

    function handleKeyUp(event)
    {
        event.preventDefault();
        inputEvents.push({type:"KeyUp",evt: event});
    }

    function processObject(obj)
    {
        if (obj.inputController)
        {
            for (var i in inputEvents)
            {
                var eObject = inputEvents[i];
                if (eObject.type === "KeyDown")
                {
                    if (obj.inputController.onKeyDown)
                    {
                        obj.inputController.onKeyDown(obj,eObject.evt);
                    }
                } else if (eObject.Type === "KeyUp")
                {
                    if (obj.inputController.onKeyUp)
                    {
                        obj.inputController.onKeyUp(obj,eObject.evt);
                    }
                }
            }
        }
    }
    this.processObject = processObject;
    
    function clearInputBuffers()
    {
        inputEvents = [];
    }
    this.clearInputBuffers = clearInputBuffers;
}

).apply(cns("sfme.internal.inputManager"));
