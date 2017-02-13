var BaseTool = require("./BaseTool");

function Brush() {
    this.lineCap = "round";
    this.lineJoin = "round";
    this.shadowBlur = this.lineWidth === 1 ? this.lineWidth : this.lineWidth / 2;
}

Brush.prototype = Object.create(BaseTool);

module.exports = Brush;