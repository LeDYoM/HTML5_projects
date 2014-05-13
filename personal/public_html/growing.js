var ActionList = function()
{
    var actions = [];
    var Actions = {
        BoardSizeChanged: 0,
        updateBoard: 1
    };
   
    return {
        Actions: Actions,
        add: function(obj_) { actions.push(obj_); },
        dequeue: function() { return actions.shift(); },
        length: function() { return actions.length; },
        isEmpty: function() { return actions.length === 0; }
    };
    
};

var GrowingModel = function()
{
    var board = [];
    var actionList = null;
    
    function getRealX(x_)
    {
        return (x_ < 0) ? board.length + x_ : x_;        
    }

    function getRealY(y_)
    {
        return (y_ < 0) ? board[0].length + y_ : y_;        
    }

    function getCell(x_,y_)
    {       
        return board[getRealX(x_)][getRealY(y_)];
    }

    function setCell(x_,y_,value_)
    {
        board[getRealX(x_)][getRealY(y_)] = value_;
    }
    
    function countAdjacents(x_,y_)
    {
        var count = 0;
        for (var x = x_ - 1; x < x_ + 1; ++x)
        {
            for (var y = y_ - 1; y < y_ + 1; ++y)
            {
                var oldValue = board[getRealX(x)][getRealY(y)];
                if (oldValue > 0)
                {
                    count++;
                }
            }
        }
        return count;
    }
    
    function random(max_)
    {
        return Math.floor(Math.random() * max_);
    }
    
    function setRandom()
    {
        for (var x = 0; x < board.length; ++x)
        {
            for (var y = 0; y < board[x].length; ++y)
            {
                board[x][y] = random(1);
            }
        }
        actionList.add({action: actionList.Actions.updateBoard});        
    }
    function doStep()
    {
        var newBoard = [];
        
        for (var x = 0; x < board.length; ++x)
        {
            newBoard[x] = [];
            for (var y = 0; y < board[x].length; ++y)
            {
                var adj = countAdjacents(x,y);
                
                // Apply rules
                if (adj < 2 || adj > 5)
                {
                    newBoard[x][y] = 1;
                }
                else
                {
                    newBoard[x][y] = 0;
                }
            }
        }
        board = newBoard;
        actionList.add({action: actionList.Actions.updateBoard});
    }
    
    function init(actionList_,w,h)
    {
        actionList = actionList_;
        createBoard(w,h);
    }
    
    function createBoard(w,h)
    {
        board = [];
        for (var x = 0; x < w; ++x)
        {
            var line = [];
            for (var y = 0; y < h; ++y)
            {
                line.push(0);
            }
            board.push(line);
        }
        actionList.add({action: actionList.Actions.BoardSizeChanged, w: w, h: h});
    }

    return {
        init: init,
        getCell: getCell,
        doStep: doStep,
        setCell: setCell,
        createBoard: createBoard,
        setRandom: setRandom,
        board: function() { return board; }
    };
};

var GrowingView = function()
{
    var parent = null;

    function init(parent_)
    {
        parent = parent_;
    }
    
    function getViewElement(x,y)
    {
        return MiniDom.byId("mButton_"+x+y);
    }
    
    function setBoardSize(w,h,clickCallback_)
    {
        var _ = MiniDom;
        var elem = "";
        for (var x = 0; x < w; ++x)
        {
            for (var y = 0; y < h; ++y)
            {
                elem += _.build("button",{innerText:"0",id:"mButton_"+x+y});
            }
            elem += _.build("br");
        }
        parent.innerHTML = elem;
        for (var x = 0; x < w; ++x)
        {
            for (var y = 0; y < h; ++y)
            {
                var elem = getViewElement(x,y);
                _.on(elem,"click",clickCallback_);
                elem.dataset["x"] = x;
                elem.dataset["y"] = y;
            }
        }
    }
    
    function updateBoard(modelBoard_)
    {
        for (var x = 0; x < modelBoard_.length; ++x)
        {
            for (var y = 0; y < modelBoard_[x].length; ++y)
            {
                var elem = getViewElement(x,y);
                elem.textContent = modelBoard_[x][y];
            }
        }
    }
    
    return {
        init: init,
        setBoardSize: setBoardSize,
        updateBoard: updateBoard
    };
};

var GrowingController = function()
{
    var model = null;
    var view = null;
    var actionList = null;
    
    function init(element,menu,w,h)
    {
        actionList = new ActionList();
        model = new GrowingModel();
        view = new GrowingView();
        
        view.init(element);
        model.init(actionList,w,h);
        setMenu(menu,this);
        
        processQueue(-1);
    }
    
    function setMenu(container_,self_)
    {
        var _ = MiniDom;
        
        var tmp = _.build("button",{id:"doSteps",innerText:"Do"});
        tmp += "Num steps:";
        tmp += _.build("input",{type:"number",id:"numSteps",class:"stepsInput",value:"1",min:"-1",max:"9999"});
        tmp += _.build("br");
        tmp += "Board Width:";
        tmp += _.build("input",{type:"number",id:"boardw",class:"sizeBoard",value:"1",min:"-1",max:"9999"});
        tmp += "Board Height:";
        tmp += _.build("input",{type:"number",id:"boardh",class:"sizeBoard",value:"1",min:"-1",max:"9999"});
        tmp += _.build("button",{id:"setBoardSize",innerText:"Set board size"});
        tmp += _.build("button",{id:"randomize",innerText:"Random"});

        container_.innerHTML = tmp;

        _.on("doSteps","click",function(e)
        {
            var steps = Number(document.getElementById("numSteps").value);
            if (typeof steps === 'NaN')
            {
                steps = 1;
            }
            doSteps(steps,true);
        });

        _.on("setBoardSize","click",function(e)
        {
            var bw = Number(document.getElementById("boardw").value);
            var bh = Number(document.getElementById("boardh").value);
            
            if (typeof bw === 'NaN')
            {
                bw = 1;
            }

            if (typeof bh === 'NaN')
            {
                bh = 1;
            }

            model.createBoard(bw,bh);
            processQueue(-1);
        });

        _.on("randomize","click",function(e)
        {
            model.setRandom();
            processQueue(-1);
        });
    }

    function processQueueElement()
    {
        var element = actionList.dequeue();
        switch (element.action)
        {
            case (actionList.Actions.BoardSizeChanged):
                view.setBoardSize(element.w, element.h,
                function(e)
                {
                    var elementView = e.target;
                    var x = elementView.dataset["x"];
                    var y = elementView.dataset["y"];
                    if (e.target.textContent === "0")
                    {
                        e.target.textContent = "1";
                        model.setCell(x,y,1);
                    }
                    else
                    {
                        e.target.textContent = "0";
                        model.setCell(x,y,0);
                    }
                });
                break;
            case (actionList.Actions.updateBoard):
                view.updateBoard(model.board());
                break;
        }
    }
    function processQueue(numElements)
    {
        while (numElements !== 0 && !actionList.isEmpty())
        {
            processQueueElement();
            numElements--;
        }
    }
    
    function doSteps(numSteps_,updateEach_)
    {
        updateEach_ = true;
        for (var i = 0; i < numSteps_; ++i)
        {
            model.doStep();
            if (updateEach_)
            {
                processQueue(1);
            }
        }
        processQueue(-1);
    }
    
    return {
        init: init,
        doSteps: doSteps
    };
};
