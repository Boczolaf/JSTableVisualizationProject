var memory = ["start"];
var memoryIndex = 0;
var countOfUndo = 0;
function undo(){
    if(memoryIndex!==0){
        let lastAction = memory[memoryIndex];
        memoryIndex = memoryIndex -1;
        countOfUndo = countOfUndo +1;
        executeAction(lastAction,"action");
    }
}

function redo(){
    if(memory[memoryIndex+1]){
        memoryIndex = memoryIndex +1;
        countOfUndo = countOfUndo - 1;
        let previousAction = memory[memoryIndex];
        executeAction(previousAction,"counter");
    }
}
//action is array containing: name , arguments used, other necessary info
function executeAction(lastAction, type) {
    let element;
    let id;
    if(type.localeCompare("action")===0){
        switch (lastAction[0]) {
            case "changedNormalField":
                element = document.getElementById(lastAction[2][0]);
                element.innerText = lastAction[1][0];
                createDeleteButton(element,"row");
                break;
            case "changedFirstRowField":
                element = document.getElementById(lastAction[2][0]);
                if(element) {
                    element.innerText = lastAction[1][0];
                    createDeleteButton(element, "column");
                }
                break;
            case "changedConnectionField":
                element = document.getElementById(lastAction[2][0]);
                element.innerText = lastAction[1][0];
                reDrawArrows(index);
                break;
            case "changedTable":
                id = lastAction[2][0];
                if(!(typeof lastAction[1][1]==='string')){
                    document.body.removeChild(document.getElementById(id));
                }
                if(!(typeof lastAction[1][0] ==='string')){
                    let copy = lastAction[1][0].cloneNode(true);
                    document.body.insertBefore(copy,canvas);
                    fixCopyOfDivTable(copy,lastAction[2][1])

                }
                reDrawArrows(index);
                break;

        }
    }
    else{
        switch (lastAction[0]) {
            case "changedNormalField":
                element = document.getElementById(lastAction[2][0]);
                element.innerText = lastAction[1][1];
                if(element.id.includes("row")){
                    createDeleteButton(element,"row");
                }
                break;
            case "changedFirstRowField":
                element = document.getElementById(lastAction[2][0]);
                element.innerText = lastAction[1][1];
                createDeleteButton(element,"column");
                break;
            case "changedConnectionField":
                element = document.getElementById(lastAction[2][0]);
                element.innerText = lastAction[1][1];
                reDrawArrows(index);
                break;
            case "changedTable":
                id = lastAction[2][0];
                if(document.getElementById(id)){
                    document.body.removeChild(document.getElementById(id));
                }
                if(!(typeof lastAction[1][1] ==='string')) {
                    let copy = lastAction[1][1].cloneNode(true);
                    document.body.insertBefore(copy, canvas);
                    fixCopyOfDivTable(copy, lastAction[2][1]);
                }
                reDrawArrows(index);
                break;
        }
    }

}

function addToMemory(action){
    //delete if adding is done after undoes
    for(let i =0; i< countOfUndo;i++){
        memory.pop();
    }
    countOfUndo =0;
    memory.push(action);
    memoryIndex = memoryIndex +1;
}
function popMemory(){
    memory.pop();
    memoryIndex = memoryIndex -1;
}
function fixCopyOfDivTable(copy, clientRect) {
    copy.boundingClientRect = clientRect;
    dragElement(copy);
    let header = copy.childNodes[0];
    let tmp;
    //clearing button
    tmp = header.innerText;
    header.innerText = tmp;
    createDeleteButton(header,"header");
    let table = copy.childNodes[1];
    let rows = table.rows;
    let cell;
    for(let i = 0;i< rows.length;i++){
        for(let j =0;j< rows[i].cells.length;j++){
            cell = rows[i].cells[j];

            if(i!==0){
                cell.style.backgroundColor=white;
                cell.setAttribute('onclick','onClick(this)');
                if(j===rows[i].cells.length-1){
                    cell.setAttribute('onclick','onClickConnection(this)');
                }
            }
            if(cell.id){
                //deleting buttons
                 tmp = cell.innerText;
                cell.innerText = tmp;
                if(cell.id.includes("column")){
                    createDeleteButton(cell,"column");
                    cell.setAttribute('onclick','onClickForFirstRow(this)');
                    if(cell.id.includes("in")){
                        cell.style.backgroundColor = blue;
                    }
                    else{
                        cell.style.backgroundColor = red;
                        cell.style.color = black;
                    }

                }
                if(cell.id.includes("row")){
                    createDeleteButton(cell,"row");

                }

            }
            cell.style.color = black;
        }
    }
}

