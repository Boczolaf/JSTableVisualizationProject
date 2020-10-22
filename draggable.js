function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(element.id + "Header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(element.id + "Header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        clearCanvas();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        //check if the position is in canvas
        let parentId = getParentIDFromTableId(element.id);
        let canvasId = getCanvasIdForParentId(parentId);
        canvas = document.getElementById(canvasId);
        let canvasY = canvas.getBoundingClientRect().top + window.scrollY; // Y
        // set the element's new position:
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;
        clearCanvas();
        if((newTop>=canvasY && (canvasY + canvas.getBoundingClientRect().height)>newTop)){
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        reDrawArrows(index);
        document.onmouseup = null;
        document.onmousemove = null;
    }

}
