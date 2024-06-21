var Constants = {
    NumFrames: 10,
    NumTurns: 2,
    NumExtraTurns: 1,
    NumBowls: 10
};

function assert(condition,message)
{
    if (!condition)
    {
        console.error(message);
    }
}

function gebId(str)
{
    var result = document.getElementById(str);
    assert(result !== null,"Element "+str+" is null");
    return result;
}