var Pen = require("./pen");
var Brush = require("./brush");
var Eraser = require("./eraser");

/**
 *
 * @param {String} type
 * @returns {*}
 */
function tools(type) {
    if (type.trim() === "pen") {
        return new Pen;
    }
    if (type.trim() === "brush") {
        return new Brush;
    }
    if (type.trim() === "eraser") {
        return new Eraser;
    }
}

module.exports = tools;