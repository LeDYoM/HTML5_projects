
function doPageLoad() {

    if (window.blackberry !== null) {
    }
    
    var fonts = {
        titleFont:
        {
            fontType: "80 Calibri",
            textAlign: "center"
        }
    };

    var scene = {
        background:
        {
            type: "background"
        },
        title: {
            type: "textLabel",
            text: "jZooper",
            font: fonts.titleFont,
            fillStyle: "blue",
            x: 768 / 2,
            y: 100
        },
        menutext1: {
            type: "textLabel",
            text: "Play",
            font:
            {
                fontType: "80 Calibri",
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
                fontType: "80 Calibri",
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
