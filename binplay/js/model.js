var Model = function () {
    this.Frame = function () {
        var turns = new Array();

        this.setTurn = function (index, score) {
            turns[index] = score;
        };

        this.addExtraTurn = function (score) {
            assert(launches.length < 3, "Error adding extra turn");
            launches.push(score);
        };

        this.totalDroppedBowls = function () {
            var total = 0;
            for (var i = 0; i < turns.length; ++i) {
                total += turns[i];
            }
            return total;
        };

        this.getTurn = function (index) {
            assert(index > -1 /*&& index<turns.length*/);
            if (index < turns.length)
                return turns[index];
            else
                return 0;
        };

        this.isDoubleStrike = function () {
            return (this.getTurn(0) === Constants.NumBowls && this.getTurn(1) === Constants.NumBowls);
        };

        this.isStrike = function () {
            return this.getTurn(0) === Constants.NumBowls;
        };

        this.isSpare = function () {
            return (this.getTurn(0) + this.getTurn(1)) === Constants.NumBowls && this.getTurn(1) > 0;
        };

        this.getNumLaunchesOfFrame = function () {
            return turns.length;
        };
    };

    var _framesScores = [];

    this.getNumLaunchesOfFrame = function (i) {
        assert(i >= 0 && i < _frames.length, "Invalid index");
        return _frames[i].getNumLaunchesOfFrame();
    };

    this.getNextBall = function (index) {
        if (_frames.length > (index + 1)) {
            return _frames[index + 1].getTurn(0);
        }
        else if (index + 1 >= Constants.NumFrames) {
            return 0;
        }
        else {
            return -1;
        }
    };

    this.getNext2Balls = function (index) {
        if (_frames.length > (index + 1)) {
            if (_frames[index + 1].isStrike()) {
                var score = this.getNextBall(index + 1);
                if (score < 0) {
                    return -1;
                }
                return score + _frames[index + 1].getTurn(0) + _frames[index + 1].getTurn(1);
            }
            else {
                return _frames[index + 1].getTurn(0) + _frames[index + 1].getTurn(1);
            }
        }
        else if (index + 1 >= Constants.NumFrames) {
            return 0;
        }
        else {
            return -1;
        }
    };
    this.tryUpdateScores = function () {
        var doNext = true;
        for (var i = _framesScores.length; i < _frames.length && doNext; ++i) {
            doNext = false;

            if (_frames[i].isStrike()) {
                var score = this.getNext2Balls(i);
                if (score > -1) {
                    doNext = true;
                    _framesScores[i] = _frames[i].totalDroppedBowls() + score;
                }
            }
            else if (_frames[i].isSpare()) {
                var score = this.getNextBall(i);
                if (score > -1) {
                    doNext = true;
                    _framesScores[i] = _frames[i].totalDroppedBowls() + score;
                }
            }
            else {
                doNext = true;
                _framesScores[i] = _frames[i].totalDroppedBowls();
            }
        }
    };

    var _frames = new Array();

    this.getScoreForFrameAndLaunch = function (frame, launch) {
        assert(frame >= 0 && frame <= Constants.NumFrames, "Invalid frame index");
        return _frames[frame].getTurn(launch);
    };

    this.getScoreForFrame = function (frame) {
        if (_framesScores.length > frame) {
            return _framesScores[frame];
        }
        return -1;
    };

    this.getAccumulatedScoreForFrame = function (frame) {
        var total = 0;

        for (var i = 0; i <= frame; ++i) {
            var s = this.getScoreForFrame(i);
            if (s < 0)
                return s;
            total += s;
        }
        return total;
    };

    this.addFrame = function (frame) {
        _frames[_frames.length] = frame;
        assert(_frames.length <= Constants.NumFrames, "Number of turns is too high");
        this.tryUpdateScores();
    };
};
