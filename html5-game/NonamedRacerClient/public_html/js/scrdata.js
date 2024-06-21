var ScrData = function()
{
    "use strict";
    var backWidth = 0;
    var backHeight = 0;
   
    // Constants
    var scoreText = "SCORE:";
    var speedText = "kmh";
    var textFontFace = "SourceSans";
    var textFontStyle = "";
    var startScoreText;
    var startSpeedText;
    var reqDigitsScore = 6;
    var reqDigitSpeed = 4;
    var textFont = "";
    var dataCanvas = null;
    
    function zFill(nz)
    {
        var zStr = "";
        for (var i=0;i<nz;++i) zStr += "0";
        return zStr;
    }
    
    function setStyle(fillStyle_)
    {
        dataCanvas.ctx.fillStyle = fillStyle_;
        dataCanvas.ctx.strokeStyle = "#000000";
        dataCanvas.ctx.lineWidth = Math.floor(backHeight / 20);        
    }
    
    function OnResize(canvas_)
    {
        backWidth = canvas_.cnv.width;
        backHeight = (canvas_.cnv.height * 0.12)+1;
        dataCanvas = new CanvasContext().create("dataCanvas",backWidth,backHeight);
        startSpeedText = 0;
        var fontHeight = Math.floor(backHeight) + 1;
        var tText = scoreText + speedText + zFill(reqDigitsScore) + zFill(reqDigitSpeed);
        var tTextSize;
        do
        {
            fontHeight--;
            backHeight--;
            textFont = textFontStyle + " " + fontHeight + "px " + textFontFace;
            dataCanvas.ctx.font = textFont;
            tTextSize = dataCanvas.ctx.measureText(tText).width;
        } while (tTextSize > backWidth);
    }

    function drawZeroesAndStr(quantity_,totalLen,startX,startY)
    {
        var txt = Math.floor(quantity_).toString();
        var nZ = totalLen - txt.length;
        
        if (nZ > 0)
        {
            var zStr = zFill(nZ);
            setStyle("#888888");
            dataCanvas.ctx.fillText(zStr,startX,startY);
            dataCanvas.ctx.strokeText(zStr,startX,startY);
            
            return dataCanvas.ctx.measureText(zStr).width;
        }
        return 0;
    }
    
    function drawScoreText(score_,y_)
    {
        var startY = y_ - (backHeight * 0.18);
        var temp = 0;
        dataCanvas.ctx.font = textFont;
        dataCanvas.ctx.textBaseline = "top";
        setStyle("#0055ff");
        temp += dataCanvas.ctx.measureText(scoreText).width;
        dataCanvas.ctx.fillText(scoreText,startScoreText,startY);
        dataCanvas.ctx.strokeText(scoreText,startScoreText,startY);

        var l = drawZeroesAndStr(score_, reqDigitsScore, startScoreText + temp,startY);
        temp += l;
        setStyle("#0055ff");
        dataCanvas.ctx.fillText(Math.floor(score_),startScoreText + temp,startY);
        dataCanvas.ctx.strokeText(Math.floor(score_),startScoreText + temp,startY);        
        temp += dataCanvas.ctx.measureText(Math.floor(score_).toString()).width;
        startScoreText = backWidth - temp;
    }

    function drawSpeed(speed_,y_)
    {
        var startY = y_ - (backHeight * 0.18);
        var temp = 0;
        dataCanvas.ctx.font = textFont;
        dataCanvas.ctx.textBaseline = "top";
        var l = drawZeroesAndStr(speed_, reqDigitSpeed, startSpeedText,startY);
        temp += l;
        setStyle("#0055ff");
        dataCanvas.ctx.fillText(Math.floor(speed_),startSpeedText + temp,startY);
        dataCanvas.ctx.strokeText(Math.floor(speed_),startSpeedText + temp,startY);
        temp += dataCanvas.ctx.measureText(Math.floor(speed_).toString()).width;
        dataCanvas.ctx.fillText(speedText, startSpeedText + temp,startY);
        dataCanvas.ctx.strokeText(speedText, startSpeedText + temp,startY);
    }

    function draw(speed_, score_,y_,canvas_)
    {
        if (dataCanvas !== null)
        {
            dataCanvas.cnv.width = dataCanvas.cnv.width;
            dataCanvas.ctx.fillStyle = "rgba(40,200,100,0.7)";
            dataCanvas.ctx.fillRect(0,y_,backWidth, backHeight);
            drawSpeed(speed_/250,y_);
            drawScoreText(score_,y_);
            canvas_.ctx.drawImage(dataCanvas.cnv,0, 0);
        }
    }
    
    return {
        draw: draw,
        OnResize: OnResize
    };
};
