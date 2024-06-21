var GameColors = {};

function GameColorsOnResize(isDemo_)
{
    GameColors = {};
    if (GameConfig.tColors || isDemo_)
    {
        GameColors = 
        {
            circuitBackground : "#fff",
            roadOdd : "#DDD",
            roadOddGradient : "#DDD",
            roadEven: "#DDD",
            roadEvenGradient: "#DDD",
            compatible: "#00ff00",
            gameOverHit: "#ff0000",
            incScore: [ "#555555", "#222222" ]
        };
    }
    else
    {
        GameColors = 
        {
            circuitBackground : "#f0f0f0",
            roadOddGradient : "#cccccc",
            roadOdd : "#555555",        
            roadEvenGradient: "#cccccc",
            roadEven: "#606060",        
            compatible: "#00ff00",
            gameOverHit: "#ff0000",
            incScore: [ "#ff5522", "#ffff00" ]
        };
    }
};
