var View = function () {
    this.viewCurrentFrameAndTurn = function (indexFrame, indexTurn) {
        assert(indexFrame > -1 && indexFrame < Constants.NumFrames, "Error in frame index: " + indexFrame);
        gebId("view-frame-number").innerHTML = (indexFrame + 1);
        gebId("pins-down").value = 0;
        gebId("view-launch-number").innerHTML = (indexTurn + 1);
    };

    this.getCurrentTurnScore = function () {
        var ret = gebId("pins-down").value;
        return parseInt(ret);
    };

    function isLastFrame(index) {
        return (index >= (Constants.NumFrames - 1));
    }
    function tableTemplateHeader() {
        var result = "<tr>";
        for (var i = 0; i < Constants.NumFrames; ++i) {
            var colSpan = (isLastFrame(i) ? 4 : 3);
            result += "<td colspan='" + colSpan + "'>" + (i + 1) + "</td>";
        }
        return result + "</tr>";
    }

    function tableTemplateBody() {
        var result = "<tr>";
        for (var i = 0; i < Constants.NumFrames; ++i) {
            result += "<td id='table-points-" + i + "-empty' style='border-bottom: hidden'></td>";
            var numLaunches = (isLastFrame(i) ? 3 : 2);
            for (var j = 0; j < numLaunches; ++j) {
                result += "<td id='table-points-" + i + "-" + j + "'></td>";
            }
        }
        return result + "</tr>";
    }

    function tableTemplateFooter() {
        var result = "<tr>";
        for (var i = 0; i < Constants.NumFrames; ++i) {
            var colSpan = (isLastFrame(i) ? 4 : 3);
            result += "<td colspan='" + colSpan + "' id='table-accum-points-" + i + "'></td>";
        }
        return result + "</tr>";
    }

    this.createTable = function () {
        gebId("results-table").innerHTML = tableTemplateHeader() + tableTemplateBody() + tableTemplateFooter();
    };

    this.setLaunchScore = function (frame, launch, score) {
        assert(frame >= 0 && frame <= Constants.NumFrames, "Invalid frame index: " + frame);
        assert(launch >= 0, "Invalid launch index: " + launch);

        var _idStr = "table-points-" + frame + "-" + launch;
        gebId(_idStr).innerHTML = score;
    };

    this.setAccumulatedScoreInFrame = function (frame, score) {
        assert(score >= 0, "Invalid score");
        assert(frame >= 0 && frame <= Constants.NumFrames, "Invalid frame index");
        var _idStr = "table-accum-points-" + frame;
        gebId(_idStr).innerHTML = score;
    };

    this.resetInputMaxValue = function () {
        this.setInputMaxValue(Constants.NumBowls);
    };
    this.setInputMaxValue = function (mv) {
        gebId("pins-down").max = mv;
    };

    this.finishGame = function () {
        gebId("turn-input-global").style.visibility = "hidden";
    };
};
