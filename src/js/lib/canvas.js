"use strict";
// var contextDefault = {
//     fillStyle: "#000000",
//     filter: "none",
//     font: "10px sans-serif",
//     globalAlpha: 1,
//     globalCompositeOperation: "source-over",
//     imageSmoothingEnabled: true,
//     imageSmoothingQuality: "low",
//     lineCap: "butt",
//     lineDashOffset: 0,
//     lineJoin: "miter",
//     lineWidth: 1,
//     miterLimit: 10,
//     shadowBlur: 0,
//     shadowColor: "rgba(0, 0, 0, 0)",
//     shadowOffsetX: 0,
//     shadowOffsetY: 0,
//     strokeStyle: "#000000",
//     textAlign: "start",
//     textBaseline: "alphabetic"
// };

function Canvas(id) {
    this.ref = document.getElementById(id);
    this.ref.width = 871;
    this.ref.height = 480;
    this.ref.addEventListener("mousemove", getPointerPosition, false);
    this.ref.addEventListener("mousedown", setPointerPosition, false);
    this.ref.addEventListener("mouseup", removeEventPaint, false);
    this.context = this.ref.getContext("2d");
    this.bound = this.ref.getBoundingClientRect();
    this.pointer = {
        x: 0,
        y: 0
    };

    var that = this;
    var ctx = that.context;

    function getPointerPosition(event) {
        that.pointer.x = event.pageX - that.bound.left;
        that.pointer.y = event.pageY - that.bound.top;
    }

    function setPointerPosition() {
        ctx.moveTo(that.pointer.x, that.pointer.y);
        ctx.beginPath();
        that.ref.addEventListener("mousemove", paint, false);
        console.info("Add Event ('mousemove', paint) to canvas");
    }

    function paint() {
        ctx.lineTo(that.pointer.x, that.pointer.y);
        ctx.stroke();
    }

    function removeEventPaint() {
        that.ref.removeEventListener("mousemove", paint, false);
        console.info("Remove Event ('mousemove', paint) from canvas");
    }
}

Canvas.prototype.setPaintStyle = function (tool) {
    var ctx = this.context;

    for (var props in tool) {
        ctx[props] = tool[props];
    }
    console.info("Pain Style for canvas object was changed.")
    console.dir(ctx);
};

Canvas.prototype.clear = function () {
    this.context.save();
    this.context.fillStyle = "#FFFFFF";
    this.context.fillRect(0, 0, this.ref.width, this.ref.height);
    this.context.restore();
};

Canvas.prototype.save = function (link, filename) {
    var name = filename || "canvas";
    var time = new Date().getTime().toString();
    var data = this.ref.toDataURL();
    link.href = data;
    link.download = name + "_" + time + ".png";
};

module.exports = Canvas;
