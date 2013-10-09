
function doPageLoad() {

    if (window.blackberry !== null) {
    }

    var scene = {
        background:
        {
            type: "background"
            //            fillStyle: "blue"
        },
        title: {
            type: "textLabel",
            text: "jZooper",
            font:
            {
                fontType: "",
                fontSize: "80",
                fontName: "Calibri",
                textAlign: "center"
            },
            fillStyle: "blue",
            x: 768 / 2,
            y: 100
        },
        menutext1: {
            type: "textLabel",
            text: "Play",
            font:
            {
                fontType: "",
                fontSize: "80",
                fontName: "Calibri",
                textAlign: "center"
            },
            fillStyle: "red",
            x: 768 / 2,
            y: 300
        },
        menutext2: {
            type: "textLabel",
            text: "Exit",
            font:
            {
                fontType: "",
                fontSize: "80",
                fontName: "Calibri",
                textAlign: "center"
            },
            fillStyle: "yellow",
            x: 768 / 2,
            y: 380
        }
    };
    
    var je = new JE();
    je.Start();
    je.setActiveScene(scene);
}

window.addEventListener("load", doPageLoad, false);
