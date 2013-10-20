
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
            type: "core.quad",
            x: 100,
            y: 100,
            width: 200,
            height: 250,
            fill: true,
            stroke: true,
            fillStyle: "black",
            lineWidth: 7,
            strokeStyle: "red"
        },
        title: {
            type: "core.text",
            text: "jZooper",
            font: "80 Calibri",
            textAlign: "left",
            textBaseline: "top",
            fill: true,
            stroke: true,
            fillStyle: "yellow",
            lineWidth: 2,
            strokeStyle: "red",
            x: 768 / 2,
            y: 100
        }

    };

    var scene2 = {
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
        }/*,
        
        menutext2: {
            group: "ui",
            type: "button",
            text: "Peich"
        }*/
    };
    
    je.Start();
    je.setActiveScene(scene);
}
var je = new JE.Core();

window.addEventListener("load", doPageLoad, false);
