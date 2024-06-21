var GameSingleton = {

    gameSingleton: null,

    gameSingletonNotNull: function()
    {
        return GameSingleton.gameSingleton !== null;
    },
    destroyGameSingleton: function()
    {
        if (GameSingleton.gameSingletonNotNull())
        {
            delete GameSingleton.gameSingleton;
            GameSingleton.gameSingleton = null;
        }
    },
    resetGameSingleton: function()
    {
        GameSingleton.destroyGameSingleton();
        GameSingleton.gameSingleton = new Game();
    },
    startGame: function (demo_,gameOver_,canvas_)
    {
        GameSingleton.resetGameSingleton();
        GameSingleton.gameSingleton.start(demo_,gameOver_,canvas_);
    },
    OnResize: function(canvas_)
    {
        if (GameSingleton.gameSingletonNotNull())
        {
            GameSingleton.gameSingleton.OnResize(canvas_);
        }
    }
};
