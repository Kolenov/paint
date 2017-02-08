var Pen = require("./pen");
var Brush = require("./brush");
var Eraser = require("./eraser");
/**
 *
 * @param {String} type
 * @returns {*}
 */
function tools(type) {
    var tool = null;
    if (type.trim() === "pen") {
        tool = new Pen();
    }
    if (type.trim() === "brush") {
        tool = new Brush();
    }
    if (type.trim() === "eraser") {
        tool = new Eraser();
    }
    return tool;
}

module.exports = tools;