
var Canvas = require("./lib/canvas");
var toolbox = require("./lib/toolbox");
window.onload = function () {
    var canvasGround = new Canvas("canvas");
    toolbox(canvasGround);
};
