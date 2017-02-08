(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Canvas = require("./lib/canvas");
var toolbox = require("./lib/toolbox");
window.onload = function () {
    var canvasGround = new Canvas("canvas");
    toolbox(canvasGround);
};

},{"./lib/canvas":3,"./lib/toolbox":7}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{"./makeTool":5}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./brush":2,"./eraser":4,"./pen":6}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
var makeTool = require("./makeTool");

function toolbox(canvas) {

    var swatches = document.getElementById("swatches");
    var selectedColor = document.getElementById("selected-color");
    var tools = document.getElementById("tools");
    var saveButton = document.getElementById("save-button");
    var size = document.getElementById("size");
    var clear = document.getElementById("clear");

    clear.addEventListener("click", clearCanvas, false);

    function clearCanvas() {
        canvas.context.fillStyle = "#FFFFFF";
        canvas.context.fillRect(0, 0, canvas.ref.width, canvas.ref.height);
    }

    saveButton.addEventListener("click", function () {
        canvas.save(this);
    }, false);


    (function () {
        for (var i = 0; i < swatches.childElementCount; ++i) {
            swatches.children[i].addEventListener("click", setStyle, false);
        }
    })();

    (function () {
        for (var i = 0; i < tools.childElementCount; ++i) {
            tools.children[i].addEventListener("click", setTool, false);
            tools.children[i].addEventListener("click", setActive, false);
        }
    }());

    (function () {
        for (var i = 0; i < size.childElementCount; ++i) {
            size.children[i].addEventListener("click", setSize, false);
            size.children[i].addEventListener("click", setActive, false);
        }
    }());

    function setTool() {
        var currentTool = makeTool(this.id);
        canvas.currentTool = currentTool;
        setContextPaintStyle(canvas.currentTool);
    }

    function setSize() {
        var style = getComputedStyle(this);
        canvas.currentTool.size = parseFloat(style.strokeWidth);
        setContextPaintStyle(canvas.currentTool);
    }

    function setStyle() {
        selectedColor.removeAttribute("class");
        selectedColor.setAttribute("class", this.getAttribute("class"));
        var style = getComputedStyle(this);
        canvas.currentTool.color = style.fill;
        setContextPaintStyle(canvas.currentTool);
        console.info(canvas.currentTool);
    }

    function setContextPaintStyle(tool) {
        canvas.setPaintStyle(tool);
        console.info(tool);
    }
    
    function setActive() {
        Array.prototype.forEach.call(this.parentNode.children, function (element) {
            setInactive(element);
        });
        this.classList.toggle("active", true);
    }

    function setInactive(element) {
        element.classList.remove("active");
        console.info(element.classList);
    }
}

module.exports = toolbox;

},{"./makeTool":5}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvbGliL2JydXNoLmpzIiwic3JjL2pzL2xpYi9jYW52YXMuanMiLCJzcmMvanMvbGliL2VyYXNlci5qcyIsInNyYy9qcy9saWIvbWFrZVRvb2wuanMiLCJzcmMvanMvbGliL3Blbi5qcyIsInNyYy9qcy9saWIvdG9vbGJveC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG52YXIgQ2FudmFzID0gcmVxdWlyZShcIi4vbGliL2NhbnZhc1wiKTtcbnZhciB0b29sYm94ID0gcmVxdWlyZShcIi4vbGliL3Rvb2xib3hcIik7XG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW52YXNHcm91bmQgPSBuZXcgQ2FudmFzKFwiY2FudmFzXCIpO1xuICAgIHRvb2xib3goY2FudmFzR3JvdW5kKTtcbn07XG4iLCJmdW5jdGlvbiBCcnVzaCgpIHtcbiAgICB0aGlzLmNvbG9yID0gXCJyZ2IoMCwgMCwgMClcIjtcbiAgICB0aGlzLnNpemUgPSAxMDtcbiAgICB0aGlzLmxpbmVDYXAgPSBcInJvdW5kXCI7XG4gICAgdGhpcy5saW5lSm9pbiA9IFwicm91bmRcIjtcbn1cblxuQnJ1c2gucHJvdG90eXBlLnNldFBhaW50U3R5bGUgPSBmdW5jdGlvbiAoY3R4KSB7XG4gICAgY3R4LnNoYWRvd0NvbG9yID0gdGhpcy5jb2xvcjtcbiAgICBjdHguc2hhZG93Qmx1ciA9IHRoaXMuc2l6ZSAvIDI7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5zaXplO1xuICAgIGN0eC5saW5lQ2FwID0gdGhpcy5saW5lQ2FwO1xuICAgIGN0eC5saW5lSm9pbiA9IHRoaXMubGluZUpvaW47XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJydXNoOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc2V0VG9vbCA9IHJlcXVpcmUoXCIuL21ha2VUb29sXCIpO1xuXG5mdW5jdGlvbiBDYW52YXMoaWQpIHtcbiAgICB0aGlzLnJlZiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICB0aGlzLnJlZi53aWR0aCA9IDg3MTtcbiAgICB0aGlzLnJlZi5oZWlnaHQgPSA0ODA7XG4gICAgdGhpcy5yZWYuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBnZXRQb2ludGVyUG9zaXRpb24sIGZhbHNlKTtcbiAgICB0aGlzLnJlZi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHNldFBvaW50ZXJQb3NpdGlvbiwgZmFsc2UpO1xuICAgIHRoaXMucmVmLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHJlbW92ZUV2ZW50UGFpbnQsIGZhbHNlKTtcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLnJlZi5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgdGhpcy5ib3VuZCA9IHRoaXMucmVmLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMucG9pbnRlciA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgIH07XG5cbiAgICB0aGlzLmN1cnJlbnRUb29sID0gc2V0VG9vbChcImJydXNoXCIpO1xuICAgIHRoaXMuc2V0UGFpbnRTdHlsZSh0aGlzLmN1cnJlbnRUb29sKTtcblxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgY3R4ID0gdGhhdC5jb250ZXh0O1xuXG4gICAgZnVuY3Rpb24gZ2V0UG9pbnRlclBvc2l0aW9uKGV2ZW50KSB7XG4gICAgICAgIHRoYXQucG9pbnRlci54ID0gZXZlbnQucGFnZVggLSB0aGF0LmJvdW5kLmxlZnQ7XG4gICAgICAgIHRoYXQucG9pbnRlci55ID0gZXZlbnQucGFnZVkgLSB0aGF0LmJvdW5kLnRvcDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRQb2ludGVyUG9zaXRpb24oKSB7XG4gICAgICAgIGN0eC5tb3ZlVG8odGhhdC5wb2ludGVyLngsIHRoYXQucG9pbnRlci55KTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGF0LnJlZi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHBhaW50LCBmYWxzZSk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIkFkZCBFdmVudCAoJ21vdXNlbW92ZScsIHBhaW50KSB0byBjYW52YXNcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFpbnQoKSB7XG4gICAgICAgIGN0eC5saW5lVG8odGhhdC5wb2ludGVyLngsIHRoYXQucG9pbnRlci55KTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUV2ZW50UGFpbnQoKSB7XG4gICAgICAgIHRoYXQucmVmLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgcGFpbnQsIGZhbHNlKTtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiUmVtb3ZlIEV2ZW50ICgnbW91c2Vtb3ZlJywgcGFpbnQpIGZyb20gY2FudmFzXCIpO1xuICAgIH1cbn1cblxuQ2FudmFzLnByb3RvdHlwZS5zZXRQYWludFN0eWxlID0gZnVuY3Rpb24gc2V0VG9vbCh0b29sKSB7XG4gICAgdG9vbC5zZXRQYWludFN0eWxlKHRoaXMuY29udGV4dCk7XG59O1xuXG5DYW52YXMucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiBzYXZlKGxpbmssIGZpbGVuYW1lKSB7XG4gICAgdmFyIG5hbWUgPSBmaWxlbmFtZSB8fCBcImNhbnZhc1wiO1xuICAgIHZhciB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTtcbiAgICB2YXIgZGF0YSA9IHRoaXMucmVmLnRvRGF0YVVSTCgpO1xuICAgIGxpbmsuaHJlZiA9IGRhdGE7XG4gICAgbGluay5kb3dubG9hZCA9IG5hbWUgKyBcIl9cIiArIHRpbWUgKyBcIi5wbmdcIjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FudmFzOyIsImZ1bmN0aW9uIEVyYXplcigpIHtcbiAgICB0aGlzLmNvbG9yID0gXCJyZ2IoMjU1LCAyNTUsIDI1NSlcIjtcbiAgICB0aGlzLnNpemUgPSA0MDtcbiAgICB0aGlzLmxpbmVDYXAgPSBcInNxdWFyZVwiO1xuICAgIHRoaXMubGluZUpvaW4gPSBcInJvdW5kXCI7XG59XG5cbkVyYXplci5wcm90b3R5cGUuc2V0UGFpbnRTdHlsZSA9IGZ1bmN0aW9uIChjdHggKSB7XG4gICAgY3R4LnNoYWRvd0NvbG9yID0gbnVsbDtcbiAgICBjdHguc2hhZG93Qmx1ciA9IG51bGw7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCIjRkZGRkZGXCI7XG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuc2l6ZTtcbiAgICBjdHgubGluZUNhcCA9IHRoaXMubGluZUNhcDtcbiAgICBjdHgubGluZUpvaW4gPSB0aGlzLmxpbmVKb2luO1xufTtcbm1vZHVsZS5leHBvcnRzID0gRXJhemVyOyIsInZhciBQZW4gPSByZXF1aXJlKFwiLi9wZW5cIik7XG52YXIgQnJ1c2ggPSByZXF1aXJlKFwiLi9icnVzaFwiKTtcbnZhciBFcmFzZXIgPSByZXF1aXJlKFwiLi9lcmFzZXJcIik7XG4vKipcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIHRvb2xzKHR5cGUpIHtcbiAgICB2YXIgdG9vbCA9IG51bGw7XG4gICAgaWYgKHR5cGUudHJpbSgpID09PSBcInBlblwiKSB7XG4gICAgICAgIHRvb2wgPSBuZXcgUGVuKCk7XG4gICAgfVxuICAgIGlmICh0eXBlLnRyaW0oKSA9PT0gXCJicnVzaFwiKSB7XG4gICAgICAgIHRvb2wgPSBuZXcgQnJ1c2goKTtcbiAgICB9XG4gICAgaWYgKHR5cGUudHJpbSgpID09PSBcImVyYXNlclwiKSB7XG4gICAgICAgIHRvb2wgPSBuZXcgRXJhc2VyKCk7XG4gICAgfVxuICAgIHJldHVybiB0b29sO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvb2xzOyIsImZ1bmN0aW9uIFBlbigpIHtcbiAgICB0aGlzLnNpemUgPSAxO1xuICAgIHRoaXMuY29sb3IgPSBcIiMwMDBcIjtcbiAgICB0aGlzLmxpbmVDYXAgPSBcInJvdW5kXCI7XG4gICAgdGhpcy5saW5lSm9pbiA9IFwicm91bmRcIjtcbn1cblxuUGVuLnByb3RvdHlwZS5zZXRQYWludFN0eWxlID0gZnVuY3Rpb24gKGN0eCkge1xuICAgIGN0eC5zaGFkb3dDb2xvciA9IG51bGw7XG4gICAgY3R4LnNoYWRvd0JsdXIgPSBudWxsO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuc2l6ZTtcbiAgICBjdHgubGluZUNhcCA9IHRoaXMubGluZUNhcDtcbiAgICBjdHgubGluZUpvaW4gPSB0aGlzLmxpbmVKb2luO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQZW47IiwidmFyIG1ha2VUb29sID0gcmVxdWlyZShcIi4vbWFrZVRvb2xcIik7XG5cbmZ1bmN0aW9uIHRvb2xib3goY2FudmFzKSB7XG5cbiAgICB2YXIgc3dhdGNoZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN3YXRjaGVzXCIpO1xuICAgIHZhciBzZWxlY3RlZENvbG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RlZC1jb2xvclwiKTtcbiAgICB2YXIgdG9vbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvb2xzXCIpO1xuICAgIHZhciBzYXZlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLWJ1dHRvblwiKTtcbiAgICB2YXIgc2l6ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2l6ZVwiKTtcbiAgICB2YXIgY2xlYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsZWFyXCIpO1xuXG4gICAgY2xlYXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsZWFyQ2FudmFzLCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBjbGVhckNhbnZhcygpIHtcbiAgICAgICAgY2FudmFzLmNvbnRleHQuZmlsbFN0eWxlID0gXCIjRkZGRkZGXCI7XG4gICAgICAgIGNhbnZhcy5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy5yZWYud2lkdGgsIGNhbnZhcy5yZWYuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBzYXZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbnZhcy5zYXZlKHRoaXMpO1xuICAgIH0sIGZhbHNlKTtcblxuXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzd2F0Y2hlcy5jaGlsZEVsZW1lbnRDb3VudDsgKytpKSB7XG4gICAgICAgICAgICBzd2F0Y2hlcy5jaGlsZHJlbltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2V0U3R5bGUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvb2xzLmNoaWxkRWxlbWVudENvdW50OyArK2kpIHtcbiAgICAgICAgICAgIHRvb2xzLmNoaWxkcmVuW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZXRUb29sLCBmYWxzZSk7XG4gICAgICAgICAgICB0b29scy5jaGlsZHJlbltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2V0QWN0aXZlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9KCkpO1xuXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplLmNoaWxkRWxlbWVudENvdW50OyArK2kpIHtcbiAgICAgICAgICAgIHNpemUuY2hpbGRyZW5baV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNldFNpemUsIGZhbHNlKTtcbiAgICAgICAgICAgIHNpemUuY2hpbGRyZW5baV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNldEFjdGl2ZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSgpKTtcblxuICAgIGZ1bmN0aW9uIHNldFRvb2woKSB7XG4gICAgICAgIHZhciBjdXJyZW50VG9vbCA9IG1ha2VUb29sKHRoaXMuaWQpO1xuICAgICAgICBjYW52YXMuY3VycmVudFRvb2wgPSBjdXJyZW50VG9vbDtcbiAgICAgICAgc2V0Q29udGV4dFBhaW50U3R5bGUoY2FudmFzLmN1cnJlbnRUb29sKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRTaXplKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMpO1xuICAgICAgICBjYW52YXMuY3VycmVudFRvb2wuc2l6ZSA9IHBhcnNlRmxvYXQoc3R5bGUuc3Ryb2tlV2lkdGgpO1xuICAgICAgICBzZXRDb250ZXh0UGFpbnRTdHlsZShjYW52YXMuY3VycmVudFRvb2wpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFN0eWxlKCkge1xuICAgICAgICBzZWxlY3RlZENvbG9yLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICAgICAgICBzZWxlY3RlZENvbG9yLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikpO1xuICAgICAgICB2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMpO1xuICAgICAgICBjYW52YXMuY3VycmVudFRvb2wuY29sb3IgPSBzdHlsZS5maWxsO1xuICAgICAgICBzZXRDb250ZXh0UGFpbnRTdHlsZShjYW52YXMuY3VycmVudFRvb2wpO1xuICAgICAgICBjb25zb2xlLmluZm8oY2FudmFzLmN1cnJlbnRUb29sKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRDb250ZXh0UGFpbnRTdHlsZSh0b29sKSB7XG4gICAgICAgIGNhbnZhcy5zZXRQYWludFN0eWxlKHRvb2wpO1xuICAgICAgICBjb25zb2xlLmluZm8odG9vbCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldEFjdGl2ZSgpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbCh0aGlzLnBhcmVudE5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBzZXRJbmFjdGl2ZShlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCB0cnVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRJbmFjdGl2ZShlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGVsZW1lbnQuY2xhc3NMaXN0KTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9vbGJveDtcbiJdfQ==
