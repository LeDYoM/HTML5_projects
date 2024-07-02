var View = function () {

    function tableTemplateHeader() {
        return "<div class='pull-characters-container'>";
    }

    function tableTemplateBody() {
        var result = "";
        for (var i = 0; i < 1; ++i) {
            result += "<div class='pull-container'><input type='checkbox' id='pull-character-0'>";
            result += "<label class='checkbox-label' for='pull-character-0'>Position 0</label></div>";
        }
        return result + "</tr>";
    }

    function tableTemplateFooter() {
        return "</div>";
    }

    this.createTable = function () {
        gebId("results-table").innerHTML = tableTemplateHeader()
            + tableTemplateBody() + tableTemplateFooter();
    };
};
