var Controller = function () {
    var _view = new View();
    var _model = new Model();

    this.pullChanged = function (pullIndex) {
        console.log("Hey " + pullIndex)
    };

    this.start = function () {
        _view.createTable();
    };

};
