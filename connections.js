//var canvases = document.getElementsByTagName('canvas');
let canvas ;
var canvases =[];
let ctx ;
let canvasY ; // Y
let canvasX ; // X

function getCanvasIdForParentId(parentId){
    for(let i=0;i<=index+1;i++){
        if(canvases[i][0]===parentId){
            return canvases[i][1];
        }
    }
    return "empty";
}
function clearCanvas(){
    let tmpCanvas;
    for(let i=0;i<index;i++){
        if(canvases[i]) {
            tmpCanvas = document.getElementById(canvases[i][1]);
            ctx = tmpCanvas.getContext("2d");
            ctx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
            ctx.beginPath();
        }
    }
}

function reDrawArrows(index){
    //clearing canvas
    clearCanvas()
    //for each table, check last column if it has any connections, if it has draw arrows
    let mainDiv;
    let parentId;
    let table;
    let rows;
    let cell;
    let connections;
    let elementToConnectTo;
    let uniques = [];
    let numberOfCellsToCheck = 1;
    for(let i =0; i<=index;i++){
        mainDiv = document.getElementById("divTable"+i);
        if(mainDiv !== null){
        parentId = getDivInnerId(mainDiv.parentElement.id);
        canvas = document.getElementById(getCanvasIdForParentId(parentId));
        ctx = canvas.getContext("2d");
        canvasY = canvas.getBoundingClientRect().top; // Y
        canvasX = canvas.getBoundingClientRect().left; // X
        table = mainDiv.childNodes[1];
        rows = table.rows;
        let typeOfTable = rows[0].cells[rows[0].cells.length-1].id.split("/")[1];
        typeOfTable = typeOfTable.localeCompare("minor") !== 0;
        for(let j =1; j<rows.length;j++){
            if(typeOfTable){
                numberOfCellsToCheck = 2;
            }
            else{
                numberOfCellsToCheck = 1;
            }
            for(let b = 0; b<numberOfCellsToCheck;b++) {
                cell = rows[j].cells[rows[j].cells.length - 1 - b];
                connections = cell.innerText.split(";");
                if (connections[0] !== "" && connections[0] !== " ") {
                    for (let k = 0; k < connections.length; k++) {
                        elementToConnectTo = document.getElementById(connections[k])
                        if (elementToConnectTo !== null) {
                            //check if you are not connecting to the table cell is in
                            if (!(getParentIdFromCell(cell).localeCompare(connections[k]) === 0)) {
                                if (!uniques.includes(connections[k])) {
                                    uniques.push(connections[k]);
                                    if(b ===1){
                                        cell = rows[j].cells[rows[j].cells.length - 1];
                                    }
                                    if(checkIfTablesAreInSameDiv(elementToConnectTo.id,getParentIdFromCell(cell))) {
                                        connectElements(cell, elementToConnectTo);
                                    }
                                }
                            } else {
                                console.log("Element can't be connected to itself!")
                            }
                        }

                    }
                    uniques = [];
                }
            }
        }

        }
    }
}
//to change (implement path finding algorithm
function connectElements(fromElement, toElement){
    //here we are moving point to middle part of cell
    let startY = fromElement.getBoundingClientRect().top - canvasY + fromElement.getBoundingClientRect().height/2;// Y
    //here we are moving point to left part of cell
    let startX = window.scrollX + fromElement.getBoundingClientRect().left - canvasX + fromElement.getBoundingClientRect().width// X
    let endY =toElement.getBoundingClientRect().top - canvasY// Y
    let endX = toElement.getBoundingClientRect().left - canvasX// X
    //toDo path finding
    drawLine(startX,startY,startX+40,startY);
    drawLine(startX+40,startY,endX-40,endY)
    drawArrow(endX-40,endY,endX,endY);
}

function drawArrow(fromX, fromY, toX, toY){
    let headLen = 10;
    let angle = Math.atan2(toY-fromY,toX-fromX);

    //starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineWidth = 2;
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX-headLen*Math.cos(angle-Math.PI/7),toY-headLen*Math.sin(angle-Math.PI/7));

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(toX-headLen*Math.cos(angle+Math.PI/7),toY-headLen*Math.sin(angle+Math.PI/7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX-headLen*Math.cos(angle-Math.PI/7),toY-headLen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
}
function drawLine(fromX, fromY, toX, toY){
    let headLen = 10;
    let angle = Math.atan2(toY-fromY,toX-fromX);
    //starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineWidth = 2;
    ctx.stroke();
    //draws the paths created above
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
}


