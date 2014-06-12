(function()
{
    var ready = false;
    this.init = function()
    {
        ready = true;
    };
    
    function subscribe(eventName,eventHandler)
    {
        document.addEventListener("sfme."+eventName, eventHandler, false);
    }
    this.subscribe = subscribe;
    
    function launchEvent(eventName,eventObject)
    {
        var event = new CustomEvent("sfme."+eventName, {
            detail: {
                    message: "",
                    time: new Date(),
                    data: eventObject
            },
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(event);
    }
    this.launchEvent = launchEvent;    
}
).apply(cns("sfme.internal.eventManager"));
