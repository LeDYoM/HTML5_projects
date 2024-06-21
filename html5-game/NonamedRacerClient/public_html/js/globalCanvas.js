var GlobalCanvas = GlobalCanvas ||
{
    canvas: null,
    ctx: null
};

// Connect to the fullscreen event.
document.addEventListener("fullscreenchange", FShandler);
document.addEventListener("webkitfullscreenchange", FShandler);
document.addEventListener("mozfullscreenchange", FShandler);
document.addEventListener("msfullscreenchange", FShandler);
window.addEventListener("resize", onResizeGlobal);

var resized = false;

function onResizeGlobal()
{
    resized = true;
}

function FShandler(e)
{
    var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    document.getElementById("setFullScreen").style.visibility = isFullScreen ? "hidden" : "visible";

        // Try the lock
    var lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
    if (lockOrientation)
    {
        lockOrientation("portrait");
    }
}

function launchFullscreen(element) {
    if (element.webkitEnterFullscreen) {
        return element.webkitEnterFullscreen();
    } else if (element.requestFullscreen) {
        return element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        return element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        return element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        return element.msRequestFullscreen();
    } else
    {
        return false;
    }
}

function exitFullscreen() {
    if(document.exitFullscreen) {
        return document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
        return document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
        return document.webkitExitFullscreen();
    } else if(document.msExitFullscreen) {
        return document.msExitFullscreen();
    }
    return false;
}

function goFullScreen()
{
    launchFullscreen(document.documentElement);
}

var requestId = 0;
var time;
var frameEllapsed;

function updateCanvas()
{
    window.cancelAnimationFrame(requestId);
    requestId = window.requestAnimationFrame(updateCanvas);

    if (GameSingleton && GameSingleton.gameSingletonNotNull())
    {
        if (resized)
        {
            if (!GameSingleton.gameSingleton.whantsUpdate() || GameSingleton.gameSingleton.isDemo())
            {
                GlobalCanvas.cnv.width = window.innerWidth;
                GlobalCanvas.cnv.height = window.innerHeight;

                GameSingleton.OnResize(GlobalCanvas);
                resized = false;
            }
        }
        if (GameSingleton.gameSingleton.whantsUpdate())
        {
            var now = new Date().getTime(); 
            frameEllapsed = now - (time || now);

            time = now;

            GameSingleton.gameSingleton.updateGame(frameEllapsed,GlobalCanvas);
        }
    }
}
