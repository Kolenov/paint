// Fat Stupid Ugly Controller
var makeTool = require("./makeTool");
var baseTool = require("./BaseTool");

function toolbox(canvas) {

    var svgObj = document.getElementById("tools");
    var toolBar = svgObj.contentDocument;
    var swatches = toolBar.getElementById("swatches");
    var selectedColor = toolBar.getElementById("selected-color");
    var tools = toolBar.getElementById("tools");
    var saveButton = toolBar.getElementById("button-save");
    var size = toolBar.getElementById("tool-size");
    var clearButton = toolBar.getElementById("button-clear");
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