var Controller = function () {
    var _view = new View();
    var _model = new Model();

    this.start = function () {
        _view.createTable();
    };

};
