cns("sfme.userModules").defineUserModule("example1", "main", 
(function()
{
    this.sfmeObject = null;
    this.init = function(commObject_)
    {
        this.sfmeObject = commObject_;        
    };
}
));
