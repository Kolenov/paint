function Erazer() {
    this.color = "rgb(255, 255, 255)";
    this.size = 40;
    this.lineCap = "square";
    this.lineJoin = "round";
}

Erazer.prototype.setPaintStyle = function (ctx ) {
    ctx.shadowColor = null;
    ctx.shadowBlur = null;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = this.size;
    ctx.lineCap = this.lineCap;
    ctx.lineJoin = this.lineJoin;
};
module.exports = Erazer;