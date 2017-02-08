function Pen() {
    this.size = 1;
    this.color = "#000";
    this.lineCap = "round";
    this.lineJoin = "round";
}

Pen.prototype.setPaintStyle = function (ctx) {
    ctx.shadowColor = null;
    ctx.shadowBlur = null;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.lineCap = this.lineCap;
    ctx.lineJoin = this.lineJoin;
};

module.exports = Pen;