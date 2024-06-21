function Box(x1_,y1_, x2_, y2_)
{
    var left = x1_, right = x2_, top = y1_, down = y2_;

    function width() { return right - left; }
    function height() { return down - top; }
    function moveToX(x) { return new Box(x, top, x + width(), down); }
    function moveToY(y) { return new Box(left, y, right, y + height()); }

    return {
        width: width,
        height: height,
        left: function() { return left; },
        right: function() { return right; },
        top: function() { return top; },
        down: function() { return down; },

        resizeW: function(factor_) { return new Box(left, top, left + (width() * factor_), down); },
        resizeH: function(factor_) { return new Box(left, top, right, top + (height() * factor_)); },
        fillRect: function(ctx_) {
            var _ctx = ctx_ || ctx;
            _ctx.fillRect(toPixel(left), toPixel(top), toPixel(width()), toPixel(height()));
        },
        moveToX: moveToX,
        moveToY: moveToY,
        moveTo: function(point) { return moveToX(point.x).moveToY(point.y); }
    };
}

function debugAlert(text_)
{
    if (GameConfig.debug)
    {
        alert(text_);
    }
}

function toPixel(value_)
{
    return Math.round(value_);
}

function CanvasContext()
{
    this.cnv = null;
    this.ctx = null;
    
    function setProperties(ctx)
    {
        ctx.imageSmoothingEnabled = GameConfig.imageSmoothingEnabled;
        if (ctx.webkitImageSmoothingEnabled)
        {
            ctx.webkitImageSmoothingEnabled = GameConfig.imageSmoothingEnabled;
        }
    }
    
    this.create = function (id,w,h)
    {
        this.cnv = document.createElement("canvas");
        this.cnv.id = id;
        this.cnv.width  = w;
        this.cnv.height = h;
        this.ctx = this.cnv.getContext("2d");
        setProperties(this.ctx);

        return this;
    };
    
    this.bind = function(id)
    {
        this.cnv = document.getElementById(id);
        this.ctx = this.cnv.getContext("2d");
        setProperties(this.ctx);

        return this;
    };
}

var CanvasManipulator = function(canvas_, x, y, w, h)
{
    "use strict";
    var internalCanvas = null,
    imageData = null;
    
    setCanvas(canvas_, x, y, w, h);
    
    function setCanvas(canvas_,x, y, w, h)
    {
        if (canvas_ !== null)
        {
            internalCanvas = canvas_;
            imageData = internalCanvas.ctx.getImageData(x || 0, y || 0, w || internalCanvas.cnv.width, h || internalCanvas.cnv.height);
        }
        else
        {
            internalCanvas = new CanvasContext().create("temp", w, h);
            setCanvas(internalCanvas, x, y, w, h);
        }
    }
    
    function setPixelRGBA(x, y, colorRGBA_) {
        var index = (x + y * imageData.width) * 4;
        imageData.data[index+0] = colorRGBA_.r;
        imageData.data[index+1] = colorRGBA_.g;
        imageData.data[index+2] = colorRGBA_.b;
        imageData.data[index+3] = colorRGBA_.a;
    }

    function getPixelRGBA(x, y)
    {
        var index = (x + y * imageData.width) * 4;
        var r = imageData.data[index+0];
        var g = imageData.data[index+1];
        var b = imageData.data[index+2];
        var a = imageData.data[index+3];
        return {
            r: r,
            g: g,
            b: b,
            a: a
        };
    }
    
    function putImageData(x,y)
    {
        internalCanvas.ctx.putImageData(imageData, x || 0, y || 0);
    }
    
    function copyLine(destManipulator,y,xDestBase,xSourceBase)
    {
        for (var x = 0; x < imageData.width;++x)
        {
            destManipulator.setPixelRGBA(x + xDestBase, y, getPixelRGBA(x + xSourceBase, y));
        }        
    }

    function drawEllipsoide(xEnd,startTop,destManipulator)
    {
        destManipulator = destManipulator || new CanvasManipulator(null, 0, 0, xEnd, imageData.height);

        var xDelta = xEnd - imageData.width,
        incX,
        prop;

        for (var y = 0; y < imageData.height;++y)
        {
            var d = startTop ? (imageData.height - 1) - y : y;
            var prop = (d  / (imageData.height - 1));
            incX = Math.round(xDelta * prop);
            
            copyLine(destManipulator,y,incX, 0);
        }
        
        destManipulator.putImageData(0,0);
        return destManipulator;
    }

    function createEllipsoide(xEnd,startTop,destManipulator)
    {
        return drawEllipsoide(xEnd,startTop,0,imageData.height,destManipulator);
    }

    return {
        createEllipsoide: createEllipsoide,
        drawEllipsoide: drawEllipsoide,
        setPixelRGBA: setPixelRGBA,
        getPixelRGBA: getPixelRGBA,
        putImageData: putImageData,
        copyLine: copyLine,

        internalCanvas: function() { return internalCanvas; },
        imageData: function() { return imageData; }
    };
};

function getStyleRuleValue(selector) {
/* F*** Chrome - does not allow to access CSS elements if loaded ALL from local file due to "Cross scripting CSS access"
    var sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
    for (var i = 0, l = sheets.length; i < l; i++) {
        var sheet = sheets[i];
        
        if( !sheet.cssRules ) { continue; }
        for (var j = 0, k = sheet.cssRules.length; j < k; j++) {
            var rule = sheet.cssRules[j];
            if (rule.selectorText && rule.selectorText.split(',').indexOf(selector) !== -1) {
                return rule.style[style];
            }
        }
    } */ 
    
    return GameColors[selector];
}

var DebugVars =
{
    fontSize: 16,
    cont: this.fontSize,
    vars: [],

    drawText: function (text_)
    {
        GlobalCanvas.ctx.fillText(text_,0,this.cont);
        this.cont += this.fontSize;
    },
    
    draw: function()
    {
        if (!GameConfig.debug)
            return;

        GlobalCanvas.ctx.save();

        GlobalCanvas.ctx.font = this.fontSize +"px Arial";
        GlobalCanvas.ctx.fillStyle = "green";
        this.drawText("");
        this.drawText("windowSize:"+window.innerWidth+","+window.innerHeight);
        this.drawText("canvasSize:"+GlobalCanvas.cnv.width+","+GlobalCanvas.cnv.height);

        for (var i=0;i<this.vars.length;++i)
        {
            this.drawText(this.vars[i]);            
        }
        GlobalCanvas.ctx.restore();
        
        this.clear();
    },
    
    addVar: function(str_)
    {
        if (!GameConfig.debug)
            return;
        this.vars.push(str_);
    },
    
    clear: function()
    {
        this.vars = [];
        this.cont = 0;
    }
};

var MyTemplates =
{
    gameTitle: "<img src='css/srtitle.png' class='title' alt='Shape Racer'>",
    setFullScreen: "<button class='prominentButton' onclick='goFullScreen();'/></button>",
    helpButton: "<button class='helpButton' onclick='GameSingleton.pauseGame(true,0);'/>Help</button>",    
    createChallenge: "<button id='createChallengeButton' class='centerButton'>Start new challenge</button>",
    endGameTableStart: "<h3><b>Game Over</b></h3><table class='gameOverResults'>",
    yourResultMessage: function(isWinner_) { return "<tr><td colspan='2' class='resultMessage'>"+(isWinner_ ? " You won!" : "You lost!") + "</td></tr>" ; },
    opponentScore: function(score_) { return "<tr><td class='score'>Opponent score:</td><td>"+ Math.floor(score_)+"</td></tr>"; },
    endGameTableEnd: "</table>",
    endGameBackButton: "<button id='back' class='centerButton'>Main menu</button>",
    endGameShowPlayer: function(user_) { return "<tr><td class='player'>player:</td><td><input type='text' class='player' id='playerLogin' value='"+user_.login+"'></input></td></tr>"; },
    endGameYourScore: function(score_) { return "<tr><td class='score'>You scored:</td><td class='score'>" + Math.floor(score_)+"</td></tr>"; },

    endGameWithChallengeStatus: function(user_, isSessionWinner_,  winner_score_, loser_score_, competitor_)
    {
            return MyTemplates.endGameTableStart
            + MyTemplates.endGameShowPlayer(user_)
            + MyTemplates.endGameYourScore(isSessionWinner_ ? winner_score_.result : loser_score_.result)
            + MyTemplates.yourResultMessage(isSessionWinner_)
            + MyTemplates.opponentScore(isSessionWinner_ ? loser_score_.result : winner_score_.result)
            + MyTemplates.endGameTableEnd
            + MyTemplates.endGameBackButton;
    },
    endGameWithoutChallengeStatus: function(user_, score_)
    {
            return MyTemplates.endGameTableStart
            + MyTemplates.endGameShowPlayer(user_)
            + MyTemplates.endGameYourScore(score_)
            + MyTemplates.endGameTableEnd
            + MyTemplates.endGameBackButton;
    }
};

function requestPerPage()
{
    return Math.floor(window.innerHeight / 100);
}