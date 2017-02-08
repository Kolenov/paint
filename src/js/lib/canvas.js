"use strict";

var setTool = require("./makeTool");

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

    this.currentTool = setTool("brush");
    this.setPaintStyle(this.currentTool);

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

Canvas.prototype.setPaintStyle = function setTool(tool) {
    tool.setPaintStyle(this.context);
};

Canvas.prototype.save = function save(link, filename) {
    var name = filename || "canvas";
    var time = new Date().getTime().toString();
    var data = this.ref.toDataURL();
    link.href = data;
    link.download = name + "_" + time + ".png";
};

module.exports = Canvas;