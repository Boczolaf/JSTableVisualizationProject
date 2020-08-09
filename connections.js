let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext("2d");
let canvasY = window.scrollY + canvas.getBoundingClientRect().top // Y
let canvasX = window.scrollX + canvas.getBoundingClientRect().left // X
function testFunction(){
    console.log(document.getElementById('divTable0').style.right);
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 100);
    ctx.stroke();
}
function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
}
function reDrawArrows(index){
    //clearing canvas
    clearCanvas()
    //for each table, check last column if it has any connections, if it has draw arrows
    let mainDiv;
    let table;
    let rows;
    let cell;
    let connections;
    let elementToConnectTo;
    let uniques = [];
    for(let i =0; i<=index;i++){
        mainDiv = document.getElementById("divTable"+i);
        if(mainDiv !== null){
            table = mainDiv.childNodes[1];
            rows = table.rows;
            for(let j =1; j<rows.length;j++){
                cell = rows[j].cells[rows[j].cells.length-1];
                connections = cell.innerText.split(";");
                if(connections[0]!=="" && connections[0]!==" "){
                    for(let k = 0;k<connections.length;k++){
                        elementToConnectTo = document.getElementById(connections[k])
                        if(elementToConnectTo!==null){
                            //check if you are not connecting to the table cell is in
                            if(!(cell.parentElement.parentElement.parentElement.parentElement.id.localeCompare(connections[k])===0)){
                                if(!uniques.includes(connections[k])){
                                    uniques.push(connections[k]);
                                    connectElements(cell,elementToConnectTo);
                                }
                            }
                            else{
                                console.log("Element can't be connected to itself!")
                            }
                        }

                    }
                    uniques =[];
                }
            }

        }
    }
}
//to change (implement path finding algorithm
function connectElements(fromElement, toElement){
    //here we are moving point to middle part of cell
    let startY = window.scrollY + fromElement.getBoundingClientRect().top - canvasY + fromElement.getBoundingClientRect().height/2// Y
    //here we are moving point to left part of cell
    let startX = window.scrollX + fromElement.getBoundingClientRect().left - canvasX + fromElement.getBoundingClientRect().width// X
    let endY = window.scrollY + toElement.getBoundingClientRect().top - canvasY// Y
    let endX = window.scrollX + toElement.getBoundingClientRect().left - canvasX// X
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


