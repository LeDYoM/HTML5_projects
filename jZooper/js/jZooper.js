
function doPageLoad() {
    
    var program = {

        scenes:
        {
            menu:
            {
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
                },
                bt: {
                    type: "ui.button",
                    text: "This is button"
                }
            }
        },
        nextScene: function()
        {
            return this.scenes.menu;
        }
    };

    je.setProgramData(program);
    je.Start();
}
var je = new JE.Core();

window.addEventListener("load", doPageLoad, false);
