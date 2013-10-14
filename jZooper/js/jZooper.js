
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
        /*
        background:
        {
            group: "core",
            type: "background"
        },
        title: {
            group: "core",
            type: "textLabel",
            text: "jZooper",
            font: fonts.titleFont,
            fillStyle: "blue",
            x: 768 / 2,
            y: 100
        },
        menutext1: {
            group: "core",
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
                */
        menutext2: {
            group: "ui",
            type: "button",
            text: "Peich"
        }
    };
    
    var je = new JE.Core();
    je.Start();
    je.setActiveScene(scene);
}

window.addEventListener("load", doPageLoad, false);
