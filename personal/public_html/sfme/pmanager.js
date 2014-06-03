(function()
{
    var loader = cns("sfme.internals");
    var log = cns("sfme.log");
    var scnManager = cns("sfme.internals.sceneManager");
    var this_ = this;
    this.ready = false;
    this.currentLoadingMainModule = "";
    this.currentLoadingNameSpace = "";
    this.modules = [ ];
    
    this.init = function()
    {
        this.ready = true;
    };

    this.loadProgram = function(programDir,fileDesc)
    {
        loader.loadFile(programDir+"/"+fileDesc).then(function(jsonText)
        {
            log.debug(jsonText);

            // Time to load the files.
            var myObject = JSON.parse(jsonText);
            loader.loadScriptLibrary(programDir,myObject.files, function()
            {
                log.debug("loaded "+this_.currentLoadingMainModule+"."+this_.currentLoadingNameSpace);
                var tempModule = new Object();
                tempModule.desc = myObject;
                tempModule.programDir = programDir;
                tempModule.nameSpace = "sfme.userModules." + this_.currentLoadingMainModule + "." + this_.currentLoadingNameSpace;
                tempModule.module = cns(tempModule.nameSpace);
                
                // Publish public API
                tempModule.sfmeAPI = {};
                tempModule.sfmeAPI.defineScene = scnManager.defineScene;
                
                this_.modules.push(tempModule);
                tempModule.module.init(tempModule.sfmeAPI);
            });  
        });
    };
}
).apply(cns("sfme.internals.programmanager"));

(function()
{
    var pmanager = cns("sfme.internals.programmanager");
    this.defineUserModule = function(mainModule,nameSpace,function_)
    {
        pmanager.currentLoadingMainModule = mainModule;
        pmanager.currentLoadingNameSpace = nameSpace;
        function_.apply(cns("sfme.userModules."+mainModule+"."+nameSpace));
    };
}
).apply(cns("sfme.userModules"));
