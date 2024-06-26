var Controller = function()
{
    var _currentFrame = 0;
    var _currentTurn = 0;
    var _view = new View();
    var _model = new Model();
    var _tempFrame = new _model.Frame();
    var _gameFinished = false;

    this.view = function()
    {
        return _view;
    };

    this.start=function()
    {
        _view.createTable();
        _view.viewCurrentFrameAndTurn(_currentFrame,_currentTurn);
    };

   this.isLastFrame = function()
   {
       return _currentFrame>=(Constants.NumFrames-1);
   };
   this.acceptClicked = function()
   {
        _tempFrame.setTurn(_currentTurn, _view.getCurrentTurnScore());
        var score = _view.getCurrentTurnScore();
        // Let's do it nicer
        if (_tempFrame.getTurn(_currentTurn) === Constants.NumBowls)
        {
            score = "X";
        }
        else if (_currentTurn === 1 && _tempFrame.isSpare())
        {
            score = "/";
        }
        else if (_currentTurn === 2 && (_tempFrame.getTurn(_currentTurn) + _tempFrame.getTurn(_currentTurn-1) === Constants.NumBowls) && _tempFrame.getTurn(2) > 0 && !_tempFrame.isSpare())
        {
            score = "/";
        }

        _view.setLaunchScore(_currentFrame,_currentTurn,score);
        _view.resetInputMaxValue();

        ++_currentTurn;

        var finishFrame;
        if (_currentTurn>2)
        {
            finishFrame = true;
        }
        else
        {
            finishFrame = (_currentTurn === 1) ?
                (this.isLastFrame()) ?
                    false
                    :
                    _tempFrame.isStrike()
                :
                    (this.isLastFrame()) ?
                        (!_tempFrame.isStrike() && !_tempFrame.isSpare())
                    :
                        true
            ;
        }

        if (finishFrame)
        {
            this.nextFrame();
        }
        else
        {
            var maxValue = Constants.NumBowls;
            if (_currentTurn === 1 && !_tempFrame.isStrike())
            {
                maxValue = Constants.NumBowls - _tempFrame.getTurn(0);
            } else if (_currentTurn === 2 && !_tempFrame.isDoubleStrike())
            {
                maxValue = (Constants.NumBowls - _tempFrame.getTurn(1));
            }
            _view.setInputMaxValue(maxValue);
        }

        if (!_gameFinished)
        {
            _view.viewCurrentFrameAndTurn(_currentFrame,_currentTurn);
        }
   };

   this.getAccumulatedScoreForFrame = function(frame)
   {
       return _model.getAccumulatedScoreForFrame(frame);
   };

   function updateScoreTable()
   {
        for (var i=0;i<=_currentFrame;++i)
        {
            var acc = _model.getAccumulatedScoreForFrame(i);
            if (acc > -1)
            {
                _view.setAccumulatedScoreInFrame(i,acc);
            }
        }
    }

    this.gameFinished = function()
    {
        return _gameFinished;
    };
    this.checkValue = function(turn)
    {
        _view.checkValue(turn);
    };

    this.nextFrame = function()
    {
        _model.addFrame(_tempFrame);
        _tempFrame = new _model.Frame();

        updateScoreTable();
        ++_currentFrame;
        _currentTurn = 0;

        if (_currentFrame >= Constants.NumFrames)
        {
            _gameFinished = true;
            _view.finishGame();
        }
    };
};
