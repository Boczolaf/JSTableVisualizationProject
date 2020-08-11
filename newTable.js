var index = -1;
var totalNumberOfButtons = 0;
var deleteMode = false;
var editingTable = false;
let red = "#A52A2A";
let lightRed = "#FF0000";
let white = "#FFFFFF";
let lightGreen = "#228B22";
let lightPurple = "#cc00ff"
let black = "#000000";
let blue = "#6495ED";
let startValue = " ";

function getNextIndex() {
    index = index + 1;
    return index;
}

function setupMainDiv() {
    let div = document.createElement("div");
    let currIndex = getNextIndex();
    div.id = "divTable" + currIndex;
    div.style.position = "absolute";
    div.appendChild(setupHeaderDiv(currIndex,""));
    div.appendChild(createNewTable(currIndex));
    document.body.insertBefore(div, document.getElementById("canvas"));
    dragElement(document.getElementById(div.id));
    let oldTable = "Empty";
    let newTable = div.cloneNode(true);
    addToMemory(["changedTable",[oldTable,newTable],[div.id,div.getClientRects()]]);
}

function setupHeaderDiv(index, value) {
    let element = document.createElement("div");
    let name = document.getElementById("tabName").value;
    let checkedType = document.getElementById("tableType").checked;
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
    row = table.insertRow(0);
    let cell;
    cell = row.insertCell(0);
    cell.style.padding = "20px";
    cell.innerText = "Row id's";
    cell.style.border = "thin solid #000000";
    cell.style.backgroundColor = white;
//setting up top of table
    for (i = 1; i < leftSideValues.length+1; i++) {
        cell = row.insertCell(i);
        cell.style.padding = "20px";
        if (leftSideValues[i]) {
            cell.innerText = leftSideValues[i];
        } else {
            cell.innerText = "Example input";
        }
        cell.style.border = "thin solid #000000";
        cell.style.backgroundColor = blue;
        cell.id = table.id + "/" + "column" + i + "/" + "in";
        cell.setAttribute('onclick', 'onClickForFirstRow(this)');
        createDeleteButton(cell, "column");
    }
    for (i; i < rightSideValues.length + leftSideValues.length+1; i++) {
        cell = row.insertCell(i)
        cell.style.backgroundColor = white;
        cell.style.padding = "20px";
        if (rightSideValues[i - leftSideValues.length]) {
            cell.innerText = rightSideValues[i - leftSideValues.length];
        } else {
            cell.innerText = "Example output"
        }
        cell.style.border = "thin solid #000000";
        cell.style.backgroundColor = red;
        cell.id = table.id + "/" + "column" + i + "/" + "out";
        cell.setAttribute('onclick', 'onClickForFirstRow(this)');
        createDeleteButton(cell, "column");

    }
    cell = row.insertCell(rightSideValues.length + leftSideValues.length+1);
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
    let totalLength = rightSideValues.length + leftSideValues.length + 2;
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
                cell.innerText = cell.id;
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
    let editField = document.getElementById("editField");
    let oldValue = element.innerText;
    let newValue = editField.value;
    if (newValue && newValue!==oldValue) {
        //action is array containing: name , arguments used, other necessary info
        element.innerText = newValue;
        addToMemory(["changedNormalField",[oldValue,newValue],[element.id]]);
        element.style.color = white;
        element.style.color = black;
        if (element.id.includes("row")) {
            createDeleteButton(element, "row")
        }
    } else {
        if (element.innerText) {
            editField.value = element.innerText;
        }
    }

}

function onClickForFirstRow(element) {
    let editField = document.getElementById("editField");
    let newValue = editField.value;
    let oldValue = element.innerText;
    if (newValue && newValue!==oldValue) {
        addToMemory(["changedFirstRowField",[oldValue,newValue],[element.id]]);
        element.innerText = newValue
        createDeleteButton(element, "column");
    } else {
        if (element.innerText) {
            editField.value = element.innerText;
        }
    }


}
function onClickConnection(element) {
    let editField = document.getElementById("editField");
    let newValue = editField.value;
    let oldValue = element.innerText;
    if (newValue && newValue!==oldValue) {
        addToMemory(["changedConnectionField",[oldValue,newValue],[element.id]]);
        element.innerText = newValue
        reDrawArrows(index);
    } else {
        if (element.innerText) {
            editField.value = element.innerText;
        }
    }


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
    let tableId = id.split("Header")[0];
    let divTable = document.getElementById(tableId);
    let oldTable = divTable.cloneNode(true);
    let element = document.getElementById(tableId);
    element.parentNode.removeChild(element);
    let newTable = "Empty";
    addToMemory(["changedTable",[oldTable,newTable],[tableId,divTable.getClientRects()]]);
    reDrawArrows(index);
}
