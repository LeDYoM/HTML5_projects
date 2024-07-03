var View = function () {

    function tableTemplateHeader() {
        return "<div class='pull-characters-container'>";
    }

    function tableTemplateBody() {
        var result = "";
        for (var i = 0; i < Constants.BitsPerByte; ++i) {
            result += "<div class='pull-container'><input type='checkbox' id='pull-character-" + i + "'>";
            result += "<label class='checkbox-label' for='pull-character-" + i + "'>Position "+ (i + 1) + "</label></div>";
        }
        return result + "</tr>";
    }

    function tableTemplateFooter() {
        return "</div>";
    }

    this.createTable = function () {
        gebId("pulls-container").innerHTML = tableTemplateHeader()
            + tableTemplateBody() + tableTemplateFooter();
    };
};
