var index = -1;
var totalNumberOfButtons = 0;
var deleteMode = false;
var editingTable = false;
var currentlyChosenCell = "empty";
let red = "#A52A2A";
let lightRed = "#FF0000";
let white = "#FFFFFF";
let lightGreen = "#228B22";
let lightPurple = "#cc00ff"
let black = "#000000";
let blue = "#6495ED";
let lightBlue = "#03a9fc";
let startValue = " ";
let input ;

function getNextIndex() {
    index = index + 1;
    return index;
}

function setupMainDiv() {
    let div = document.createElement("div");
    let currIndex = getNextIndex();
    div.id = "divTable" + currIndex;
    div.style.position = "absolute";
    div.appendChild(setupHeaderDiv(currIndex,"","null"));
    div.appendChild(createNewTable(currIndex));
    document.body.insertBefore(div, document.getElementById("canvas"));
    dragElement(document.getElementById(div.id));
    let oldTable = "Empty";
    let newTable = div.cloneNode(true);
    addToMemory(["changedTable",[oldTable,newTable],[div.id,div.getClientRects()]]);
}

function setupHeaderDiv(index, value, type) {
    let element = document.createElement("div");
    let name = document.getElementById("tabName").value;
    let checkedType;
    if(type.localeCompare("null")===0) {
        checkedType = document.getElementById("tableType").checked;
    }
    else{
        checkedType = type.localeCompare("major")===0;
    }
    if (!name) {
        name = "Click here to move";
    }
    element.style.cursor = "move";
    element.style.padding = "10px";
    element.style.zIndex = "10";

    if(checkedType){
        element.style.backgroundColor = lightPurple;
    }
    else{
        element.style.backgroundColor = lightGreen;
    }
    element.style.color = white;
    element.style.display = "inline-block";
    element.style.boxSizing = "border-box";
    element.id = "divTable" + index + "Header";
    if(value.localeCompare("")===0){
        element.textContent = name + "(id:" + "divTable" + index + ")";
    }
    else {
        element.textContent = value;
    }
    createDeleteButton(element, "header");
    return element;
}
function createNewTable(index) {
    let table = document.createElement("table");
    let checkedType = document.getElementById("tableType").checked;
    table.id = "table" + index;
    table.style.border = "thin solid #000000"
    table.style.borderCollapse = "collapse";
    //arguments
    //get number of rows
    let rows = document.getElementById("rowCount").value;
    if (!rows) {
        rows = 3;
    } else {
        rows = parseInt(rows);
    }
    let leftSide = document.getElementById("colNames");
    let leftSideValues = leftSide.value.split(";");
    let rightSide = document.getElementById("argNames");
    let rightSideValues = rightSide.value.split(";");
    let i;
    let row;
    let cell;
    let totalTopLength = 0;
    row = table.insertRow(0);
    setTopRowIdCell(row);
    let leftLength =leftSideValues.length;
    if(leftSideValues[0].localeCompare("") ===1){
        totalTopLength += leftSideValues.length;
    }
    else{
        leftLength=0;
    }
    if(rightSideValues[0].localeCompare("") ===1){
        totalTopLength += rightSideValues.length;
    }
//setting up top of table
    for (i = 1; i < leftLength+1; i++) {
        if (leftSideValues[i-1]) {
            cell = row.insertCell(i);
            cell.style.padding = "20px";
            cell.innerText = leftSideValues[i-1];
            cell.style.border = "thin solid #000000";
            cell.style.backgroundColor = blue;
            cell.id = table.id + "/" + "column" + i + "/" + "in";
            cell.setAttribute('onclick', 'onClickForFirstRow(this)');
            createDeleteButton(cell, "column");

        }
    }
    for (i; i < totalTopLength+1; i++) {
        if (rightSideValues[i - leftSideValues.length-1]) {
            cell = row.insertCell(i)
            cell.style.backgroundColor = white;
            cell.style.padding = "20px";
            cell.innerText = rightSideValues[i - leftSideValues.length-1];
            cell.style.border = "thin solid #000000";
            cell.style.backgroundColor = red;
            cell.id = table.id + "/" + "column" + i + "/" + "out";
            cell.setAttribute('onclick', 'onClickForFirstRow(this)');
            createDeleteButton(cell, "column");
        }

    }
    totalTopLength =row.cells.length;
    cell = row.insertCell(totalTopLength);
    cell.style.backgroundColor = white;
    cell.style.padding = "20px";
    cell.innerText = "Connections to minor(;=separator)";
    cell.style.border = "thin solid #000000";
    cell.id = table.id + "/minor";
    if(checkedType){
        cell.id = "";
        cell = row.insertCell(rightSideValues.length + leftSideValues.length +2);
        cell.id = table.id + "/major";
        cell.style.backgroundColor = white;
        cell.style.padding = "20px";
        cell.innerText = "Connections to major(;=separator)";
        cell.style.border = "thin solid #000000";
    }
    //entering rest of rows
    let j;
    let h = 0;
    let connectionIndex = 0;
    let totalLength = totalTopLength  + 1;
    if(checkedType){
        totalLength++;
    }
    for (i = 1; i < rows + 1; i++) {
        row = table.insertRow(i)
        for (j = 0; j < totalLength; j++) {
            cell = row.insertCell(j)
            cell.id = table.id + "/cell" + h;
            h++;
            cell.style.backgroundColor = white;
            cell.innerText = startValue;
            cell.style.padding = "20px";
            cell.style.border = "thin solid #000000";
            //creating invisible button that shows in deletion mode
            if (j === 0) {
                cell.id = table.id + "/" + "row" + i;
                cell.innerText = "divTable" + index+ "/" + "row" + i;
                createDeleteButton(cell, "row");
            }
            else if(((j===totalLength-2 || j===totalLength-1)  && checkedType )
                || (!checkedType && j===(totalLength-1))
            ){
                cell.id = table.id + "/" + "connection" + connectionIndex;
                connectionIndex++;
                cell.setAttribute('onclick','onClickConnection(this)');
            }
            else{
                cell.setAttribute('onclick', 'onClick(this)');
            }
        }
    }
    return table;
}

function onClick(element) {
    setCurrentlyChosenCell(element);
    refreshInput();
    input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            let oldValue = element.innerText;
            let newValue = input.value;
            if (newValue && newValue!==oldValue) {
                //action is array containing: name , arguments used, other necessary info
                element.innerText = newValue;
                addToMemory(["changedNormalField",[oldValue,newValue],[element.id]]);
                element.style.color = white;
                element.style.color = black;
                if (element.id.includes("row")) {
                    createDeleteButton(element, "row")
                }
            }
        }});
    if (element.innerText) {
        input.value = element.innerText;
    }
    else{
        input.value = "";
    }

}

function onClickForFirstRow(element) {
    setCurrentlyChosenCell(element);
    refreshInput();
    input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            let newValue = input.value;
            let oldValue = element.innerText;
            if (newValue && newValue!==oldValue) {
                addToMemory(["changedFirstRowField", [oldValue, newValue], [element.id]]);
                element.innerText = newValue
                createDeleteButton(element, "column");
            }
        }
    });
    if (element.innerText) {
        input.value = element.innerText;
    }
    else{
        input.value = "";
    }

}
function onClickConnection(element) {
    setCurrentlyChosenCell(element);
    refreshInput();
    input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            let newValue = input.value;
            let oldValue = element.innerText;
            if (newValue && newValue!==oldValue) {
                addToMemory(["changedConnectionField", [oldValue, newValue], [element.id]]);
                element.innerText = newValue
                reDrawArrows(index);
            }
        }
    });
    if (element.innerText) {
        input.value = element.innerText;
    }
    else{
        input.value = "";
    }
}

function setCurrentlyChosenCell(element){
    if(currentlyChosenCell !== element){
        if(typeof currentlyChosenCell !== "string"){
            currentlyChosenCell.style.borderColor = black;
            currentlyChosenCell.style.border = "solid thin";
        }
        currentlyChosenCell = element;
        currentlyChosenCell.style.border = "solid thick";
        currentlyChosenCell.style.borderColor = lightBlue;
    }
    else {
        currentlyChosenCell = "empty";
        element.style.borderColor = black;
        element.style.border = "solid thin";
        //empty the function on input
        refreshInput();
    }

}

function refreshInput(){
    input = document.getElementById("editField");
    let new_element = input.cloneNode(true);
    input.parentNode.replaceChild(new_element, input);
    input = document.getElementById("editField");
}

function switchDeleteMode() {
    let btn;
    deleteMode = !deleteMode;
    let switchButton = document.getElementById("deleteModeButton");
    if (deleteMode) {
        switchButton.style.backgroundColor = lightRed;
    } else {
        switchButton.style.backgroundColor = white;
    }
    for (let i = 0; i < totalNumberOfButtons; i++) {
        btn = document.getElementById("deleteButton" + i);
        if (btn) {

            if (!deleteMode) {
                btn.disabled = true;
                btn.style.visibility = "hidden";
            } else {
                btn.disabled = false;
                btn.style.visibility = "visible";
            }
        }
    }

}
function createDeleteButton(cell, type) {
    let btn = document.createElement('input');
    btn.type = "button";
    btn.className = "btn";
    btn.style.backgroundColor = lightRed;
    if (!deleteMode) {
        btn.disabled = true;
        btn.style.visibility = "hidden";
    }
    btn.id = "deleteButton" + totalNumberOfButtons.toString();
    totalNumberOfButtons++;
    btn.style.color = black;
    btn.value = "X";
    let id = cell.id
    if (type.includes("column")) {
        btn.onclick = function () {
            deleteColumn(id)
        };
        btn.onmouseover = function () {
            mouseHoverColumn(id)
        };
        btn.onmouseout = function () {
            mouseHoverColumnOut(id)
        };
    }
    if (type.includes("row")) {
        btn.onclick = function () {
            deleteRow(id)
        };
        btn.onmouseover = function () {
            mouseHoverRow(id,"over");
        };
        btn.onmouseout = function () {
            mouseHoverRow(id,"out");
        };
    }
    if (type.includes("header")) {
        btn.value = "Delete table";
        btn.onclick = function () {
            deleteTable(id);
        };
    }
    cell.appendChild(btn);
}
function deleteColumn(id) {
    //to unselect cell (to not cause problems)
    setCurrentlyChosenCell(currentlyChosenCell);
    let tableInfo = id.split("/");
    let divTableId = tableInfo[0].replace("table","divTable");
    let divTable = document.getElementById(divTableId);
    let oldTable = divTable.cloneNode(true);
    let table = document.getElementById(tableInfo[0]);

    let rows = table.rows;
    let columnToDelete;
    //finding the right one
    for (let j = 0; j < rows[0].cells.length; j++) {
        if (rows[0].cells[j].id.localeCompare(id) === 0) {
            columnToDelete = j;
            break;
        }
    }
    for (let k = 0; k < rows.length; k++) {
        rows[k].deleteCell(columnToDelete);
    }
    if (columnToDelete === 0) {
        for (let j = 1; j < rows.length; j++) {
            rows[j].cells[0].id = table.id + "/" + "row" + j;
            createDeleteButton(rows[j].cells[0], "row");
        }
    }
    let newTable = divTable.cloneNode(true);
    addToMemory(["changedTable",[oldTable,newTable],[divTableId,divTable.getClientRects()]]);
}

function mouseHoverColumn(id) {
    let tableInfo = id.split("/");
    let table = document.getElementById(tableInfo[0]);
    if (table.rows.length) {
        let rows = table.rows;
        let columnToDelete;
        //finding the right one
        for (let j = 0; j < rows[0].cells.length; j++) {
            if (rows[0].cells[j].id.localeCompare(id) === 0) {
                columnToDelete = j;
                for (let k = 0; k < rows.length; k++) {
                    rows[k].cells[columnToDelete].style.backgroundColor = black;
                    rows[k].cells[columnToDelete].style.color = white;
                }
                break;
            }
        }

    }
}

function mouseHoverColumnOut(id) {
    let tableInfo = id.split("/");
    let table = document.getElementById(tableInfo[0]);
    if(table.rows.length) {
        let rows = table.rows;
        let columnToDelete;
        //finding the right one
        for (let j = 0; j < rows[0].cells.length; j++) {
            if (rows[0].cells[j].id.localeCompare(id) === 0) {
                columnToDelete = j;
                for (let k = 0; k < rows.length; k++) {
                    if (k === 0) {
                        if (tableInfo[2].localeCompare("in") === 0) {
                            rows[k].cells[columnToDelete].style.backgroundColor = blue;
                        }
                        if (tableInfo[2].localeCompare("out") === 0) {
                            rows[k].cells[columnToDelete].style.backgroundColor = red;
                        }

                        rows[k].cells[columnToDelete].style.color = black;
                    } else {
                        rows[k].cells[columnToDelete].style.backgroundColor = white;
                        rows[k].cells[columnToDelete].style.color = black;
                    }
                }
                break;
            }
        }
    }

}

function deleteRow(id) {
    //to unselect cell (to not cause problems)
    setCurrentlyChosenCell(currentlyChosenCell);
    let tableInfo = id.split("/");
    let table = document.getElementById(tableInfo[0]);
    let divTableId = tableInfo[0].replace("table","divTable");
    let divTable = document.getElementById(divTableId);
    let oldTable = divTable.cloneNode(true);
    //finding the right row
    let rows = table.rows;
    let rowToDelete;
    for (let j = 1; j < rows.length; j++) {
        if (rows[j].cells[0].id.localeCompare(id) === 0) {
            rowToDelete = j;
            break;
        }
    }
    table.deleteRow(rowToDelete);
    let newTable = divTable.cloneNode(true);
    addToMemory(["changedTable",[oldTable,newTable],[divTableId,divTable.getClientRects()]]);
    //to delete changefield
}

function mouseHoverRow(id,type) {
    let tableInfo = id.split("/");
    let table = document.getElementById(tableInfo[0]);
    let rows = table.rows;
    for (let j = 1; j < rows.length; j++) {
        if (rows[j].cells[0].id.localeCompare(id) === 0) {
            for (let k = 0; k < rows[j].cells.length; k++) {
                if(type.localeCompare("over")===0) {
                    rows[j].cells[k].style.backgroundColor = black;
                    rows[j].cells[k].style.color = white;
                }
                else{
                    rows[j].cells[k].style.backgroundColor = white;
                    rows[j].cells[k].style.color = black;
                }

            }
            break;
        }
    }
}

function deleteTable(id) {
    //to unselect cell (to not cause problems)
    setCurrentlyChosenCell(currentlyChosenCell);
    let tableId = id.split("Header")[0];
    let divTable = document.getElementById(tableId);
    let oldTable = divTable.cloneNode(true);
    let element = document.getElementById(tableId);
    element.parentNode.removeChild(element);
    let newTable = "Empty";
    addToMemory(["changedTable",[oldTable,newTable],[tableId,divTable.getClientRects()]]);
    reDrawArrows(index);
}