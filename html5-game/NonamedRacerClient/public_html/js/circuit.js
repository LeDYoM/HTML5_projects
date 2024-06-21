var Circuit = function(isDemo_)
{
    "use strict";

    var startTime,
    currentPosition = 0.0,
    speed = 0.0,
    score = 0,
    rTime = startTime,
    numTracks = 5,
    visibleRange = 5,
    trackWidth,
    road = null,
    numRoads = 3,
    trackHeight,
    laneWidth,
    roadObjects,
    roadStructure,
    check,
    startY,
    
    numGradients,
    gradientLaneWidth,
    isDemo = isDemo_,
    
    objectFigures = [],
    oldPos = -1,
    xPos = 0,
    scrData = null,
    running = false;
    
    // racer properties
    var racerCanvasContext = null,
    currentLane = 0,
    moveLeft = false,
    moveRight = false;

    function OnStart(canvas_)
    {
        currentPosition = 0.0,
        speed = 0.0,
        score = 0,
        startTime = 60000,
        rTime = startTime,
        visibleRange = 5,
        running = true,

        roadStructure = [],
        roadObjects = [];

        for (var i = 0; i < visibleRange + 1; ++i)
        {
            roadObjects.push([]);
            for (var j = 0; j < numRoads; ++j)
            {
                roadObjects[i][j] = {value: 0};
            }
            roadStructure.push([0,0,0]);
        }

        currentLane = 0;
        racerCanvasContext = null;
        moveLeft = false;
        moveRight = false;
        scrData = new ScrData();
    }

    var Shapes = {
            TriangleDown: 0,
            Quad: 2,
            PlusSign: 3
    };
    
    function incScore(value_)
    {
        score += 100;
    }
    
    function compatibleShapeGenerate()
    {
        var period = 0;
        
        if (currentPosition < 6000)
        {
            period = 12;
        }
        else
        {
            period = 12 + Math.round(currentPosition / 2000);
        }
        
        return (random(period) === 0);
    }

    var lastAppear = 0;
    
    function gameOverShapeGenerate()
    {
        var period = 0;

        if (currentPosition < 100)
        {
            return false;
        }
        else
        {
            period = currentPosition - (currentPosition / (random(20)+1));
            if (period < 1)
                period = 1 + random(5);
            period = Math.round(period);
        }
        
        if (random(period) === 0 && (GameConfig.minGameOverShapeSeparation <= lastAppear))
        {
            lastAppear = 0;
            return true;
        }
        else
        {
            lastAppear++;
        }
    }
    
    function incPointsGenerate()
    {
        var period = 0;

        if (currentPosition < 5000)
        {
            period = 3;
        }
        else if (currentPosition < 20000)
        {
            period = 5;
        }
        else if (currentPosition < 50000)
        {
            period = Math.round(currentPosition / 10000);
        }
        
        return (random(period) === 0);
    }    

    function gameFinish()
    {
//        running = false;
    }
    
    function forceGameOver()
    {
        gameFinish();
    }
    function alphaReduce(tStart,now,canvas_)
    {
        var deltaTime = now - tStart;
        var deltaProp = deltaTime / (10000 / speed);
        
        if (deltaProp >= 1)
        {
            canvas_.ctx.globalAlpha = 0;            
            return true;
        }
        
        canvas_.ctx.globalAlpha = 1 - deltaProp;
        return false;
    }

    var figureCharacteristics = [
        {shape: Shapes.Quad, style: getStyleRuleValue("gameOverHit" ), generate: gameOverShapeGenerate, hitAction: gameFinish, disappearAnimationFunction: alphaReduce},
//        {shape:Shapes.TriangleDown, style: getStyleRuleValue("compatible" ), generate: compatibleShapeGenerate, hitAction: incScore, disappearAnimationFunction: alphaReduce},
        {shape:Shapes.PlusSign, style: getStyleRuleValue("incScore" ), generate: incPointsGenerate, hitAction: incScore, disappearAnimationFunction: alphaReduce}   
    ];

    function random(max_)
    {
        return Math.floor(Math.random()*max_);        
    }
    
    var CurveTypes = {
        None : 0,
        Left : 1,
        Right : 2,
        Total: 3
    };
    
    var CurveSubTypes = {
        Start: 0,
        Total: 6
    };
    
    function curveDirection(curveType_)
    {
        switch (curveType_)
        {
            case CurveTypes.None:
                return 0;
            case CurveTypes.Left:
                return -1;
            case CurveTypes.Right:
                return 1;
        }
        return 0;
    }

    function updateLane(newPos)
    {
        newPos;
        var newLane = [{value: 0}, {value: 0}, {value: 0}];
        
        if (!isDemo)
        {
            for (var i = 0;i<figureCharacteristics.length;++i)
            {
                // Generate random number depending on period
                if (figureCharacteristics[i]["generate"]())
                {
                    // Generate the random lane where the object will appear
                    var lane = random(newLane.length);
                    newLane[lane].value = i+1;
                }
            }
        }

        roadObjects.unshift(newLane);
        roadObjects.pop();
        
        // Check for obstacles
        if (!isDemo)
        {
            var temp = roadObjects[visibleRange-1][currentLane];
            if (temp.value !== 0)
            {
                // Execute hit_action
                figureCharacteristics[temp.value-1]["hitAction"]();
                temp.executeAnimation = true;
                temp.animationStarted = new Date().getTime();
                temp.animationFunction = figureCharacteristics[temp.value-1]["disappearAnimationFunction"];
            }
        }
        
        // Generate, perhaps, a curve
        var roadPosition = roadStructure[0][0];
        var curveType = roadStructure[0][1];
        var curveSubType = roadStructure[0][2];
        
        if (curveType === CurveTypes.None && random(10)===0)
        {
            // If we are on top left or top right, there is only one possibility
            if (roadPosition < 0)
            {
                curveType = CurveTypes.Right;
            }
            else if (roadPosition > 0)
            {
                curveType = CurveTypes.Left;
            }
            else
            {
                curveType = random(2) === 0 ? CurveTypes.Left : CurveTypes.Right;
            }
            curveSubType = CurveSubTypes.Start;
        }
        else if (curveType !== CurveTypes.None)
        {
            if (curveSubType === (CurveSubTypes.Total - 1))
            {
                roadPosition += curveDirection(curveType);
                curveType = CurveTypes.None;
                curveSubType = CurveSubTypes.Start;
            }
            else
            {
                curveSubType++;
            }
        }
        
        var result = [roadPosition, curveType, curveSubType];
        roadStructure.unshift(result);
        roadStructure.pop();
    }
    
    function createObjectsForCurve(curveType_,canvasContext_)
    {
        if ( curveType_ === CurveTypes.None)
        {
            return canvasContext_;
        }
        else
        {
            var delta = 1 / CurveSubTypes.Total;
            return new CanvasManipulator(canvasContext_).createEllipsoide(canvasContext_.cnv.width + (laneWidth * delta),curveType_-1).internalCanvas();
        }
    }
    
    function createObjectsForCurves(canvasContext_)
    {
        var result = [];
        for (var i = 0; i < CurveTypes.Total;++i)
        {
            result.push(createObjectsForCurve(i,canvasContext_));
        }
        
        return result;        
    }
    
    function min(a,b)
    {
        return a < b ? a : b;
    }
    function createObject(index)
    {
        var cTemp = new CanvasContext().create("roadObject",laneWidth, trackHeight);
        var ctx = cTemp.ctx;
        var w = cTemp.cnv.width, h = cTemp.cnv.height;
        var wm = w / 2, hm = h / 2;
        
        var propX = 0.95;
        var propY = 0.95;

        ctx.save();
        ctx.translate(w * ( (1 - propX) / 2), h * ((1 - propY) / 2));
        ctx.scale(propX,propY);
        
        var style = figureCharacteristics[index]["style"];
        
        if (Array.isArray(style))
        {
            var tempstyle = ctx.createLinearGradient(0,0,0,h);
            tempstyle.addColorStop(0,style[0]);
            tempstyle.addColorStop(1,style[1]);
            style = tempstyle;
        }

        ctx.fillStyle = style;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        
        
        switch (figureCharacteristics[index]["shape"])
        {
            case Shapes.TriangleDown:
                ctx.moveTo(0, 0);
                ctx.lineTo(w, 0);
                ctx.lineTo(wm, h);
                break;
            case Shapes.Quad:
                ctx.rect(0, 0, w, h);
                break;
            case Shapes.PlusSign:
                var len = min(w,h);
                var radius = len / 2;
                var left = wm - radius;
                var top = hm - radius;
                var delta = Math.round(len * 0.12);
                var inQuad = delta;
                ctx.strokeStyle = style;

                /*
                ctx.lineWidth = Math.round(delta * 0.2);
                ctx.arc(wm,hm,radius,0,2*Math.PI,false);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                */
                ctx.rect(left + inQuad, hm - (delta / 2), len - (inQuad * 2), delta);
                ctx.rect(wm - (delta / 2), top + inQuad, delta, len - (inQuad * 2));
                break;
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        return createObjectsForCurves(cTemp);
    }

    function OnResize(canvas_)
    {
        scrData.OnResize(canvas_);

        trackWidth = canvas_.cnv.width / visibleRange;

        road = new Box(canvas_.cnv.clientLeft + trackWidth, canvas_.cnv.clientTop, 
        (canvas_.cnv.clientLeft + canvas_.cnv.clientWidth) - trackWidth, 
        canvas_.cnv.clientTop + canvas_.cnv.clientHeight);

        xPos = (canvas_.cnv.width / 2) - (road.width() / 2);

        numGradients = numRoads * 2;
        trackHeight = road.height() / visibleRange;
        laneWidth = road.width() / numRoads;
        gradientLaneWidth = road.width() / numGradients;
        check = visibleRange;
        startY = trackHeight * check;

        for (var i = 0; i < 2; ++i)
        {
            trackCanvases[i] = createRoadTrack(i);
        }
        
        if (!isDemo)
        {
            // Now, the objects.
            // Create the temporary canvas for the objects
            objectFigures = [ ];
            for (var i = 0; i < figureCharacteristics.length; ++i)
            {
                objectFigures.push(createObject(i));
            }

            racerCanvasContext = new CanvasContext();
            racerCanvasContext.create("racerCanvas",laneWidth,trackHeight);
            racerCanvasContext.ctx.fillStyle = "#0000ff";
            racerCanvasContext.ctx.moveTo(0, trackHeight);
            racerCanvasContext.ctx.lineTo(laneWidth, trackHeight);
            racerCanvasContext.ctx.lineTo((laneWidth / 2), 0);
            racerCanvasContext.ctx.lineTo(0, trackHeight);
            racerCanvasContext.ctx.closePath();
            racerCanvasContext.ctx.fill();
        }
    }

    function drawObject(x,y,objType,curveType,canvas_)
    {
        canvas_.ctx.drawImage(objectFigures[objType-1][curveType].cnv, x, y);
    }

    function drawObjectsLane(x,y,index,curveType,canvas_)
    {
        var temp = roadObjects[index];
        var now = new Date().getTime();
        
        for (var i = 0; i < temp.length;++i)
        {
            if (temp[i].value !== 0)
            {
                canvas_.ctx.save();
                if (temp[i].executeAnimation)
                {
                    temp[i].animationFunction(temp[i].animationStarted,now,canvas_);
                }
                drawObject(x + (i * trackWidth), y, temp[i].value,curveType,canvas_);
                canvas_.ctx.restore();
            }
        }
    }

    function updateRacerPosition()
    {
        if (moveLeft)
        {
            if (currentLane > 0)
            {
                currentLane--;
            }
            moveLeft = false;
        }
        else if (moveRight)
        {
            if (currentLane < (numRoads-1))
            {
                currentLane++;
            }
            moveRight = false;
        }
    }
    
    function drawRacer(xBase,laneIndex_,canvas_)
    {
        var x = Math.round(xBase + ((laneIndex_ + currentLane) * laneWidth));
        var y = Math.round(trackHeight * (visibleRange - 1));
        canvas_.ctx.drawImage(racerCanvasContext.cnv, x, y);
    }

    function updateSpeed(frameEllapsed_)
    {
        if (isDemo)
        {
            speed = 1500;
        }
        else if (speed < 1500)
        {
            speed += frameEllapsed_;
        }
        else if (speed < 5000)
        {
            speed += (frameEllapsed_ / 2);            
        }
        else if (speed < 12000)
        {
            speed += (frameEllapsed_ / 3);            
        }
        else if (speed < 20000)
        {
            speed += (frameEllapsed_ / 4);            
        }
        else if (speed < 50000)
        {
            speed += (frameEllapsed_ / 5);            
        }
        else if (speed < 100000)
        {
            speed += (frameEllapsed_ / 6);            
        }
        else if (speed < 200000)
        {
            speed += (frameEllapsed_ / 7);            
        }
        else
        {
            speed += (frameEllapsed_ / 8);            
        }        
    }

    function update(frameEllapsed_)
    {
        if (running)
        {
            updateSpeed(frameEllapsed_);
            currentPosition += speed;

            // Normal update: increment score depending on the speed
            // and, the ellapsed time, of course.
            score += (speed * frameEllapsed_) / 20000;

            if (GameConfig.timeBased)
            {
                rTime -= frameEllapsed_;

                if (rTime <= 0.0)
                {
                    gc.game.reachGameOver();
                }
            }

            updateRacerPosition();
        }
        else
        {
            speed = 0;
        }

        DebugVars.addVar("CircuitrPos:"+currentPosition);
        DebugVars.addVar("Speed:"+speed);

    }

    function updateObsjects(tracksPassed)
    {
        var temp = Math.floor(tracksPassed);
        if (temp > oldPos)
        {
            // New circuit track reached.
            oldPos = temp;
            updateLane(temp);
        }
    }
    
    function calculateDelta(xPos_, laneIndex_, curveType_, curveSubType_)
    {
        var xDelta = laneIndex_;
        var laneWidthDelta = 0;
        if (curveType_ !== CurveTypes.None)
        {
            var step = 0;
            if (curveType_ === CurveTypes.Right)
            {
                step = curveSubType_;
            }
            else
            {
                xDelta--;
                step = (curveSubType_ - (CurveSubTypes.Total - 1));
            }
            step /= CurveSubTypes.Total;
            laneWidthDelta =  step * curveDirection(curveType_) * laneWidth;

        }
        return xPos_ + (xDelta * laneWidth) + laneWidthDelta;
    }
    
    function drawRoad(canvas_)
    {
        var scaledcp = currentPosition / 500;
        var isOdd = scaledcp % (trackHeight*2) > trackHeight,
        yPos = (scaledcp % trackHeight);
        
        var i, laneIndex, curveType, curveSubType, totalY, index;
        var iInc = (isOdd ? 1 : 0);

        updateObsjects(scaledcp / trackHeight);
        var prevDelta = 0;

        for (i = 0; i < visibleRange + 1; ++i)
        {
            laneIndex = roadStructure[i][0];
            curveType = roadStructure[i][1];
            curveSubType = roadStructure[i][2];

            totalY =  yPos + ((i-1)*trackHeight);
            index = i + iInc;

            canvas_.ctx.drawImage(trackCanvases[(index%2)][curveType].cnv, 
            calculateDelta(xPos,laneIndex, curveType, curveSubType), 
            totalY);

            if (!isDemo)
            {
                drawObjectsLane(calculateDelta(xPos,laneIndex, curveType, curveSubType),totalY,i,curveType,canvas_);

                if (i === check && curveType !== CurveTypes.None)
                {
                    var endY = totalY + trackHeight;
                    if (endY > startY)
                    {
                        prevDelta = (endY - startY) * laneWidth / (curveDirection(curveType) * trackHeight * CurveSubTypes.Total);
                        var tempDelta = (curveSubType * curveDirection(curveType) * laneWidth) / CurveSubTypes.Total;
                        prevDelta += tempDelta;
                    }
                }
            }
        }
        
        if (!isDemo)
        {
            drawRacer(xPos + prevDelta,laneIndex,canvas_);       
            scrData.draw(speed,score,0,canvas_);
        }
    }

    var roadLineHeightFactor = 0.9,
    trackCanvases = [];
    
    function createRoadTrack(index)
    {
        var grd;
        var boxTemp;

        var st;
        var end = 0;
        var indexRest = index%2;

        var cTemp = new CanvasContext().create("road"+index,road.width(), Math.ceil(trackHeight));
        var color = [[GameColors.roadOdd, GameColors.roadOddGradient],
        [GameColors.roadEven, GameColors.roadEvenGradient]];

        for (var i = 0; i < numGradients; ++i)
        {
            st = end;
            end += gradientLaneWidth;
            boxTemp = new Box(toPixel(st), 0, toPixel(end), Math.ceil(trackHeight) );
            
            grd = cTemp.ctx.createLinearGradient(boxTemp.left(), 0, boxTemp.right(), 0);

            grd.addColorStop((i%2)===0?0:1,color[indexRest][0]);
            grd.addColorStop((i%2)===0?1:0,color[indexRest][1]);
            cTemp.ctx.fillStyle = grd;
            boxTemp.fillRect(cTemp.ctx);

            if ((i%2)===0 && indexRest===0 && i !== 0)
            {
                var roadLineBox = boxTemp.resizeW(0.5).resizeH(roadLineHeightFactor);
                roadLineBox = roadLineBox.moveTo({x:roadLineBox.left() - (roadLineBox.width() / 2),
                y:roadLineBox.top() + ((roadLineBox.height() * (1 - roadLineHeightFactor)) / 2)});

                cTemp.ctx.fillStyle = "#ffffff";
                roadLineBox.fillRect(cTemp.ctx);
            }
        }
        return createObjectsForCurves(cTemp);
    }
    
    return {
        OnStart: OnStart,
        OnResize: OnResize,
        update: update,
        drawRoad: drawRoad,
        forceGameOver: forceGameOver,
        MoveLeft: function() { moveLeft = true; },
        MoveRight: function() { moveRight = true; },

        // properties
        running: function() { return running; },
        road: function() { return road; },
        trackHeight: function() { return trackHeight; },
        visibleRange: function() { return visibleRange; },
        laneWidth: function() { return laneWidth; },
        numRoads: function() { return numRoads; },
        score: function() { return score; },
        remainingTime: function() { return rTime; },
        speed: function() { return speed; }
    };
};
