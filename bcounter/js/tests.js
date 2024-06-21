var Tests = function()
{
    var _currentTestIndex = 0;
    
    this.testGame = function(testData,expectedResult)
    {
        controller = new Controller();
        controller.start();

        assert(testData.length===Constants.NumFrames,"Invalid test data");
        for (var i=0;i<Constants.NumFrames;++i)
        {
            for (var j=0;j<testData[i].length;++j)
            {
                assert(parseInt(gebId("pins-down").max)>=testData[i][j],"Malformed test");
                gebId("pins-down").value = testData[i][j];
                gebId("accept-button").click();
            }
        }
        
        assert(controller.gameFinished(),"Error: game is not finished");
        var result = controller.getAccumulatedScoreForFrame(Constants.NumFrames-1);
        assert(result === expectedResult,"Error in result. Expected: "+expectedResult+" and obtained: "+result);
    };
    
    var testsData = [
        [
            [10],
            [10],
            [10],
            [10],
            [10],
            [10],
            [10],
            [10],
            [10],
            [10,10,10]
        ],
        [
            [5,4],
            [10],
            [1,1],
            [0,0],
            [8,2],
            [5,5],
            [1,0],
            [2,0],
            [10],
            [10,0,10]
        ],
        [
            [0,0],
            [0,0],
            [0,0],
            [0,0],
            [0,0],
            [0,0],
            [0,0],
            [0,0],
            [0,0],
            [0,0]
        ],
        [
            [5,5],
            [5,5],
            [5,5],
            [5,5],
            [5,5],
            [5,5],
            [5,5],
            [5,5],
            [5,5],
            [5,5,5]
        ],
        [
            [1,2],
            [3,4],
            [5,5],
            [6,4],
            [0,0],
            [7,2],
            [1,1],
            [2,2],
            [10],
            [10,5,5]
        ]
    ];
    
    var resultData = [
        300,
        92,
        0,
        150,
        96
    ];

    this.nextTest = function()
    {
        this.testGame(testsData[_currentTestIndex],resultData[_currentTestIndex]);
        ++_currentTestIndex;

        gebId("next-test").style.visibility = _currentTestIndex >= testsData.length ? "hidden" : "visible";
    };
        
};
