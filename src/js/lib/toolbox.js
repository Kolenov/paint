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
