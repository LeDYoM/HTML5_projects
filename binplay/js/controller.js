var Controller = function () {
    var _view = new View();
    var _model = new Model();

    this.pullChanged = function (pullIndex) {
        console.log("Pull index " + pullIndex + " changed");
        console.log(String.fromCharCode(65));
    };

    this.start = function () {
        _view.createTable();
    };

};
