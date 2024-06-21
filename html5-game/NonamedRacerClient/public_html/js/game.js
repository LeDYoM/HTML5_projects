var Game = function()
{
    "use strict";
    var isDemo = true,
    gameOver = null,

    tStarted = null,
    controlPosition = { x:0, y:0 },
    controlDown = false,
    circuit = null,
    whantsUpdate = false;
    
    function addControlHandlers(addMouse, addTouch, canvas_)
    {
        if (canvas_ !== null)
        {
            removeControlHandlers(canvas_);
            if (addMouse)
            {
                canvas_.addEventListener("mousedown", onMouseDown, false);
                canvas_.addEventListener("mouseup", onMouseUp, false);
                canvas_.addEventListener("mousemove", onMouseMove, false);
            }

            if (addTouch)
            {
                canvas_.addEventListener("touchstart", onTouchDown, false);
                canvas_.addEventListener("touchend", onTouchUp, false);
                canvas_.addEventListener("touchmove", onTouchMove, false);            
            }
        }
    }

    function removeControlHandlers(canvas_)
    {           
        canvas_.removeEventListener("mousedown", onMouseDown, false);
        canvas_.removeEventListener("mouseup", onMouseUp, false);
        canvas_.removeEventListener("mousemove", onMouseMove, false);

        canvas_.removeEventListener("touchstart", onTouchDown, false);
        canvas_.removeEventListener("touchend", onTouchUp, false);
        canvas_.removeEventListener("touchmove", onTouchMove, false);            
    }

    function onMouseDown(e)
    {
        e.preventDefault();
        onControlDown({x: e.x, y: e.y});
    }

    function onMouseUp(e)
    {
        e.preventDefault();
        onControlUp({x: e.x, y: e.y});
    }

    function getFirstAvailableTouch(e)
    {
        if (e.targetTouches)
        {
            if (e.targetTouches.length > 0)
            {
                return e.targetTouches[0];
            }
        }
        
        if (e.changedTouches)
        {
            if (e.changedTouches.length > 0)
            {
                return e.changedTouches[0];
            }
        }
        return e;
    }
    
    function onTouchDown(e)
    {
        e.preventDefault();
        var a = getFirstAvailableTouch(e);
        onControlDown({x: a.pageX, y: a.pageY});
    }

    function onTouchUp(e)
    {
        e.preventDefault();
        var a = getFirstAvailableTouch(e);
        onControlUp({x: a.pageX, y: a.pageY});
    }

    function onControlDown(e)
    {
        controlDown = true;
        tStarted = {x: e.x, y: e.y};
        controlPosition = {x: e.x, y: e.y};
    }

    function onControlUp(e)
    {
        controlDown = false;
        if (tStarted.x && tStarted.y)
        {
            if (tStarted.x < e.x)
            {
                circuit.MoveRight();
            }
            else
            {
                circuit.MoveLeft();
            }
            controlPosition = { x:e.x, y:e.y };
        }
    }

    function onMouseMove(e)
    {
        e.preventDefault();
        controlPosition = { x:e.x, y:e.y };
    }

    function onTouchMove(e)
    {
        e.preventDefault();
        var a = getFirstAvailableTouch(e);
        controlPosition = { x:a.changedTouches[0].pageX, y:a.changedTouches[0].pageY };
    }

    function updateInput()
    {
        DebugVars.addVar("ControlDown:"+controlDown);
        DebugVars.addVar("ControlPos:"+controlPosition.x+","+controlPosition.y);
    }

    function start(demo_,gameOver_,canvas_)
    {
        addControlHandlers(true, true, canvas_.cnv);        
        gameOver = gameOver_;
        isDemo = demo_;

        OnStart(canvas_);
        OnResize(canvas_);
        whantsUpdate = true;
    }

    function OnStart(canvas_)
    {
        canvas_.cnv.width = window.innerWidth;
        canvas_.cnv.height = window.innerHeight;

        GameColorsOnResize(isDemo);
        
        // Create classes.
        circuit = new Circuit(isDemo);
        circuit.OnStart();
    }

    function OnResize(canvas_)
    {
        whantsUpdate = false;    
        GameColorsOnResize(isDemo);
        circuit.OnResize(canvas_);
        whantsUpdate = true;
    }
    
    function drawBackground(canvas_)
    {
        canvas_.ctx.fillStyle = GameColors.circuitBackground;
        canvas_.ctx.fillRect(0, 0, canvas_.cnv.width, canvas_.cnv.height);
    }
    
    function reachGameOver()
    {
        if (gameOver && gameOver !== null)
        {
            gameOver(circuit.score());
        }
    }
    
    var ellapsed = 0;
    var secEllapsed = 0;
    var fps = 0;
    var lastfps = 0;
    var gameOverReached = false;
    function updateGame(frameEllapsed,canvas_)
    {
        ellapsed += frameEllapsed;
        secEllapsed += frameEllapsed;
        fps++;
        
        if (secEllapsed >= 1000)
        {
            secEllapsed -= 1000;
            lastfps = fps;
            fps = 0;
        }

        drawBackground(canvas_);
        circuit.update(frameEllapsed);
        circuit.drawRoad(canvas_);
        
        if (!circuit.running() && !gameOverReached)
        {
            gameOverReached = true;
            reachGameOver();
        }

        DebugVars.addVar("Ellapsed:"+ellapsed);
        DebugVars.addVar("FrameEllapsed:"+frameEllapsed);
        DebugVars.addVar("Demo:"+isDemo);
        DebugVars.addVar("FPS:"+lastfps);

        // Comment in release ;)
        updateInput();
        DebugVars.draw();
        DebugVars.clear();
    }
    
    function forceGameOver()
    {
        if (GameConfig.debug)
        {
            circuit.forceGameOver();
        }
    }

    return {
        start: start,
        OnResize: OnResize,
        reachGameOver: reachGameOver,
        updateGame: updateGame,
        forceGameOver: forceGameOver,
        isDemo: function() { return isDemo; },
        whantsUpdate: function() { return whantsUpdate; }
    };
};
