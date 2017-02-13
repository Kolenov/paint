var BaseTool = require("./BaseTool");

function Pen() {
    this.lineCap = "round";
    this.lineJoin = "round";
    this.shadowBlur = 0;
}
Pen.prototype = Object.create(BaseTool);
module.exports = Pen;