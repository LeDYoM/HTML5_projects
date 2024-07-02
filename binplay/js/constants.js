const Constants = {
    BitsPerByte: 8
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