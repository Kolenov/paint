(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Canvas = require("./lib/canvas");
var toolbox = require("./lib/toolbox");
window.onload = function () {
    var canvasGround = new Canvas("canvas");
    toolbox(canvasGround);
};

},{"./lib/canvas":4,"./lib/toolbox":8}],2:[function(require,module,exports){
var baseTool = {
    strokeStyle: "#000000",
    lineWidth: 1,
    shadowColor : "#000000"
};

module.exports = baseTool;
},{}],3:[function(require,module,exports){
var BaseTool = require("./BaseTool");

function Brush() {
    this.lineCap = "round";
    this.lineJoin = "round";
    this.shadowBlur = this.lineWidth === 1 ? this.lineWidth : this.lineWidth / 2;
}

Brush.prototype = Object.create(BaseTool);

module.exports = Brush;
},{"./BaseTool":2}],4:[function(require,module,exports){
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
    this.context.save();

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
    this.ref.width = 871;
};

Canvas.prototype.save = function (link, filename) {
    var name = filename || "canvas";
    var time = new Date().getTime().toString();
    var data = this.ref.toDataURL();
    link.href = data;
    link.download = name + "_" + time + ".png";
};

module.exports = Canvas;

},{}],5:[function(require,module,exports){
var BaseTool = require("./BaseTool");

function Eraser (){
    this.strokeStyle = "#FFFFFF";
    this.lineWidth = 40;
    this.lineCap = "round";
    this.lineJoin = "round";
    this.shadowBlur = 0;
}


module.exports = Eraser;


},{"./BaseTool":2}],6:[function(require,module,exports){
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
},{"./brush":3,"./eraser":5,"./pen":7}],7:[function(require,module,exports){
var BaseTool = require("./BaseTool");

function Pen() {
    this.lineCap = "round";
    this.lineJoin = "round";
    this.shadowBlur = 0;
}
Pen.prototype = Object.create(BaseTool);
module.exports = Pen;
},{"./BaseTool":2}],8:[function(require,module,exports){
// Fat Stupid Ugly Controller
var makeTool = require("./makeTool");
var baseTool = require("./BaseTool");

function toolbox(canvas) {

    var svgObj = document.getElementById("tools");
    var toolBar = svgObj.contentDocument;
    var swatches = toolBar.getElementById("swatches");
    var selectedColor = toolBar.getElementById("selected-color");
    var tools = toolBar.getElementById("tools");
    var saveButton = document.getElementById("button-save");
    var size = toolBar.getElementById("tool-size");
    var clearButton = document.getElementById("button-clear");
    var currentTool = makeTool("pen");

    console.info("Base Tool Object:");
    console.dir(baseTool);
    console.info("Current Tool Object:");
    console.dir(currentTool);

    clearButton.addEventListener("click", clearCanvas, false);
    swatches.addEventListener("click", setStyle, false);
    swatches.addEventListener("click", setActive, false);
    tools.addEventListener("click", setTool, false);
    tools.addEventListener("click", setActive, false);
    size.addEventListener("click", setSize, false);
    size.addEventListener("click", setActive, false);

    function clearCanvas() {
        canvas.clear();
    }

    saveButton.addEventListener("click", function () {
        canvas.save(this);
    }, false);

    function setTool(event) {
        var toolType = event.target.parentNode.id;
        currentTool = makeTool(toolType);
        setContextPaintStyle(currentTool);
        console.info("Tool was setup:");
        console.dir(currentTool);
    }

    function setSize(event) {
        var style = getTargetObjectStyle(event.target);
        baseTool.lineWidth = parseFloat(style.strokeWidth);
        setContextPaintStyle(currentTool);
        console.info("Tool Size was setup for:");
        console.dir(currentTool);
    }

    function setStyle(event) {
        var obj = event.target;
        var style = getTargetObjectStyle(obj);
        selectedColor.removeAttribute("class");
        selectedColor.setAttribute("class", obj.getAttribute("class"));
        baseTool.strokeStyle = style.fill;
        baseTool.shadowColor = style.fill;
        setContextPaintStyle(currentTool);
        console.info("Color Style was setup for:");
        console.dir(currentTool);
    }

    function setContextPaintStyle(tool) {
        canvas.setPaintStyle(tool);
    }

    function setActive(event) {
        var element = event.target.parentNode;
        Array.prototype.forEach.call(element.parentNode.children, function (element) {
            setInactive(element);
        });
        element.classList.toggle("active", true);
        console.info("Event target: " + element.id);
    }

    function setInactive(element) {
        element.classList.remove("active");
    }

    function getTargetObjectStyle(obj) {
        var style = getComputedStyle(obj);
        console.info("Picked Object Styles:");
        return style;
    }

}

module.exports = toolbox;
},{"./BaseTool":2,"./makeTool":6}]},{},[1]);
