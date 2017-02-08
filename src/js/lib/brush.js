function Brush() {
    this.color = "rgb(0, 0, 0)";
    this.size = 10;
    this.lineCap = "round";
    this.lineJoin = "round";
}

Brush.prototype.setPaintStyle = function (ctx) {
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.size / 2;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.lineCap = this.lineCap;
    ctx.lineJoin = this.lineJoin;
};

module.exports = Brush;