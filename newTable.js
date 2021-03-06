let index = -1;
let totalNumberOfButtons = 0;
let deleteMode = [];
let currentlyChosenCell = "empty";
let white = "#FFFFFF";
let startValue = " ";
let input =[];
let allTables = []; //structure in which there is separate table for each parent index with table ids inside

function addTableToAllTables(parentIndex,id){
    for(let i =0;i<=index;i++){
        if(allTables[i]) {
            if (allTables[i][0] === parentIndex) {
                allTables[i].push(id);
                return;
            }
        }
    }
    let tmp = [];
    tmp.push(parentIndex);
    tmp.push(id);
    allTables.push(tmp);
}
function checkIfTablesAreInSameDiv(firstId,secondId){
    let parentIdOfFirst;
    let parentIdOfSecond;
    for(let i=0;i<=index;i++){
        if(parentIdOfFirst && parentIdOfSecond){
            break;
        }
        if(allTables[i]) {
            for(let j =1;j<allTables[i].length;j++){
                if(allTables[i][j].localeCompare(firstId)===0){
                    parentIdOfFirst=allTables[i][0];
                }
                if(allTables[i][j].localeCompare(secondId)===0){
                    parentIdOfSecond=allTables[i][0];
                }
            }
        }
    }
    return parentIdOfFirst === parentIdOfSecond;
}
function checkIfTableBelongsInDiv(tableId,parentIndex){
    for(let i =0;i<=index;i++){
        if(allTables[i]) {
            for(let j =1;j<allTables[i].length;j++){
                if(allTables[i][j].localeCompare(tableId)===0){
                    return allTables[i][0] === parentIndex;
                }

            }
        }
    }
    return false;
}

function deleteTablesFromParentId(parentIndex){
    for(let i =0;i<=index;i++){
        if(allTables[i]) {
            if(allTables[i][0]===parentIndex){
                allTables.splice(i, 1);
            }
        }
    }
    return false;
}
function getParentIDFromTableId(tableId){
    for(let i =0;i<=index;i++){
        if(allTables[i]) {
            for(let j =1;j<allTables[i].length;j++){
                if(allTables[i][j].localeCompare(tableId)===0){
                   return allTables[i][0];
                }

            }
        }
    }
    return -1;
}
function getNextIndex() {
    index = index + 1;
    return index;
}
function getInput(parentIndex){
    if(input[parentIndex]){
        return input[parentIndex];
    }

}

function setupMainDiv(divId) {
    let parentDiv = document.getElementById(divId);
    let parentId = getDivInnerId(divId);
    let div = document.createElement("div");
    let currIndex = getNextIndex();
    div.id = "divTable" + currIndex;
    div.style.position = "absolute";
    div.appendChild(setupHeaderDiv(currIndex,"","null",parentId));
    div.appendChild(createNewTable(currIndex,parentId));
    parentDiv.insertBefore(div, document.getElementById(getCanvasIdForParentId(parentId)));
    dragElement(document.getElementById(div.id));
    let oldTable = "Empty";
    let newTable = div.cloneNode(true);
    addToMemory(parentId,oldTable,newTable,"changedTable",[div.id,div.getClientRects()]);
    addTableToAllTables(getDivInnerId(parentDiv.id),div.id);
}

function setupHeaderDiv(index, value, type, parentIndex) {
    let element = document.createElement("div");
    let name = document.getElementById("tabName"+getDivOuterId(parentIndex)).value;
    let checkedType;
    if(type.localeCompare("null")===0) {
        checkedType = document.getElementById("tableType"+getDivOuterId(parentIndex)).checked;
    }
    else{
        checkedType = type.localeCompare("major")===0;
    }
    if (!name) {
        name = "Click here to move";
    }

    if(checkedType){
        element.className = "divHeaderMajor";
    }
    else{
        element.className = "divHeaderMinor";
    }

    element.id = "divTable" + index + "Header";
    if(value.localeCompare("")===0){
        element.textContent = name;
    }
    else {
        element.textContent = value;
    }
    createDeleteButton(element, "header",parentIndex);
    return element;
}
function createNewTable(index,parentIndex) {
    let table = document.createElement("table");
    let checkedType = document.getElementById("tableType"+getDivOuterId(parentIndex)).checked;
    table.id = "table" + index;
    table.className = "table";
    //arguments
    //get number of rows
    let rows = document.getElementById("rowCount"+getDivOuterId(parentIndex)).value;
    if (!rows) {
        rows = 0;
    } else {
        rows = parseInt(rows);
    }
    let leftSide = document.getElementById("colNames"+getDivOuterId(parentIndex));
    let leftSideValues = leftSide.value.split(";");
    let rightSide = document.getElementById("argNames"+getDivOuterId(parentIndex));
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
            cell.id = table.id + "/" + "column" + i + "/" + "in";
            cell.innerText = leftSideValues[i-1];
            cell.className = "leftSideValues";
            cell.setAttribute('onclick', 'onClickForFirstRow(this,'+parentIndex+')');
            createDeleteButton(cell, "column",parentIndex);

        }
    }
    for (i; i < totalTopLength+1; i++) {
        if (rightSideValues[i - leftSideValues.length-1]) {
            cell = row.insertCell(i)
            cell.innerText = rightSideValues[i - leftSideValues.length-1];
            cell.id = table.id + "/" + "column" + i + "/" + "out";
            cell.className = "rightSideValues";
            cell.setAttribute('onclick', 'onClickForFirstRow(this,'+parentIndex+')');
            createDeleteButton(cell, "column",parentIndex);
        }

    }
    totalTopLength =row.cells.length;
    cell = row.insertCell(totalTopLength);
    cell.innerText = "Minor(;=separator)";
    cell.className = "connections";
    cell.id = table.id + "/minor";
    if(checkedType){
        cell.id = "";
        let leftLen ;
        let rightLen ;
        if(leftSideValues[0].localeCompare("")===0){
            leftLen = 0;
        }
        else{
            leftLen = leftSideValues.length;
        }
        if(rightSideValues[0].localeCompare("")===0){
            rightLen = 0;
        }
        else{
            rightLen = rightSideValues.length;
        }
        let tmp = rightLen+leftLen +2 ;
        cell = row.insertCell(tmp);
        cell.id = table.id + "/major";
        cell.innerText = "Major(;=separator)";
        cell.className = "connections";
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
            cell.innerText = startValue;
            cell.className = "normalCell"
            //creating invisible button that shows in deletion mode
            if (j === 0) {
                cell.id = table.id + "/" + "row" + i;
                cell.innerText = "divTable" + index+ "/" + "row" + i;
                createDeleteButton(cell, "row",parentIndex);
            }
            else if(((j===totalLength-2 || j===totalLength-1)  && checkedType )
                || (!checkedType && j===(totalLength-1))
            ){
                cell.id = table.id + "/" + "connection" + connectionIndex;
                connectionIndex++;
                cell.setAttribute('onclick','onClickConnection(this,'+parentIndex+')');
            }
            else{
                cell.setAttribute('onclick', 'onClick(this,'+parentIndex+')');
            }
        }
    }
    return table;
}

function onClick(element,parentIndex) {
    setCurrentlyChosenCell(element);
    refreshInput(parentIndex);
    let tmpInput =getInput(parentIndex);
    tmpInput = document.getElementById(tmpInput);
    tmpInput.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            let oldValue = element.innerText;
            let newValue = tmpInput.value;
            if (newValue && newValue!==oldValue) {
                //action is array containing: name , arguments used, other necessary info
                element.innerText = checkCellContent(newValue,element);
                addToMemory(parentIndex,oldValue,newValue,"changedNormalField",element.id);
                if (element.id.includes("row")) {
                    createDeleteButton(element, "row",parentIndex)
                }
            }
        }});
    if (element.innerText) {
        tmpInput.value = element.innerText;
    }
    else{
        tmpInput.value = "";
    }

}

function onClickForFirstRow(element,parentIndex) {
    setCurrentlyChosenCell(element);
    refreshInput(parentIndex);
    let tmpInput =getInput(parentIndex);
    tmpInput = document.getElementById(tmpInput);
    tmpInput.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            let newValue = tmpInput.value;
            let oldValue = element.innerText;
            if (newValue && newValue!==oldValue) {
                addToMemory(parentIndex,oldValue,newValue,"changedFirstRowField",element.id);
                element.innerText = newValue
                createDeleteButton(element, "column",parentIndex);
            }
        }
    });
    if (element.innerText) {
        tmpInput.value = element.innerText;
    }
    else{
        tmpInput.value = "";
    }

}
function onClickConnection(element,parentIndex) {
    setCurrentlyChosenCell(element);
    refreshInput(parentIndex);
    let tmpInput = getInput(parentIndex);
    tmpInput = document.getElementById(tmpInput);
    tmpInput.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            let newValue = tmpInput.value;
            let oldValue = element.innerText;
            if (newValue && newValue!==oldValue) {
                addToMemory(parentIndex,oldValue,newValue,"changedConnectionField", element.id);
                element.innerText = newValue
                reDrawArrows(index);
            }
        }
    });
    if (element.innerText) {
        tmpInput.value = element.innerText;
    }
    else{
        tmpInput.value = "";
    }
}

function setCurrentlyChosenCell(element,parentIndex){
if(element !== "empty") {
    if (currentlyChosenCell !== element) {
        if (typeof currentlyChosenCell !== "string") {
            if(currentlyChosenCell.id.includes("/in")){
                currentlyChosenCell.className = "leftSideValues";
            }
            else if(currentlyChosenCell.id.includes("/out")){
                currentlyChosenCell.className = "rightSideValues";
            }
            else{
                currentlyChosenCell.className = "normalCell";
            }

        }
        currentlyChosenCell = element;
        if(currentlyChosenCell.id.includes("/in")){
            currentlyChosenCell.className = "leftSideChosenCell";
        }
        else if(currentlyChosenCell.id.includes("/out")){
            currentlyChosenCell.className = "rightSideChosenCell";
        }
        else{
            currentlyChosenCell.className = "normalChosenCell";
        }
    } else {
        currentlyChosenCell = "empty";
        if(element.id.includes("/in")){
            element.className = "leftSideValues";
        }
        else if(element.id.includes("/out")){
            element.className = "rightSideValues";
        }
        else{
            element.className = "normalCell";
        }
        //empty the function on input
        refreshInput(parentIndex);
    }
}
}

function refreshInput(parentId){
    let tmpInput = getInput(parentId);
    tmpInput = document.getElementById(tmpInput);
    if(tmpInput) {
        let new_element = tmpInput.cloneNode(true);
        tmpInput.parentNode.replaceChild(new_element, tmpInput);
    }
}

function switchDeleteMode(divId) {
    let parentIndex = getDivInnerId(divId);
    let btn;
    deleteMode[parentIndex] = !deleteMode[parentIndex];
    let switchButton = document.getElementById("deleteModeButton"+divId);
    if (deleteMode[parentIndex]) {
        switchButton.className = "deleteButton";
    } else {
        switchButton.style.backgroundColor = white;
    }
    let id;
    let tmp;
    let tmp2;
    for (let i = 0; i < totalNumberOfButtons; i++) {
        btn = document.getElementById("deleteButton" + i);
        if (btn) {
            id = btn.parentElement.id;
            tmp = id.split("/");
            tmp2 = tmp;
            if(tmp.length>=2){
                tmp2 = tmp[0].replace("table","divTable");
            }
            else{
                tmp2 = id.split("Header")[0];
            }
           if(getParentIDFromTableId(tmp2)===parentIndex) {
               if (!deleteMode[parentIndex]) {
                   btn.disabled = true;
                   btn.style.visibility = "hidden";
               } else {
                   btn.disabled = false;
                   btn.style.visibility = "visible";
               }
           }
        }
    }

}
function createDeleteButton(cell, type,parentId) {
    let btn = document.createElement('input');
    btn.type = "button";
    btn.className = "deleteButton";
    if (!deleteMode[parentId]) {
        btn.disabled = true;
        btn.style.visibility = "hidden";
    }
    btn.id = "deleteButton" + totalNumberOfButtons.toString();
    totalNumberOfButtons++;
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
            deleteTable(id,parentId);
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
    let parentId = getParentIDFromTableId(divTableId);
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
            createDeleteButton(rows[j].cells[0], "row",parentId);
        }
    }
    let newTable = divTable.cloneNode(true);
    addToMemory(parentId,oldTable,newTable,"changedTable",[divTableId,divTable.getClientRects()]);
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
                    rows[k].cells[columnToDelete].className = "hoveredRowOrColumn";
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
                            rows[k].cells[columnToDelete].className = "leftSideValues";
                        }
                        if (tableInfo[2].localeCompare("out") === 0) {
                            rows[k].cells[columnToDelete].className = "rightSideValues";
                        }

                    } else {
                        rows[k].cells[columnToDelete].className = "normalCell";
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
    let parentId = getParentIDFromTableId(divTableId);
    addToMemory(parentId,oldTable,newTable,"changedTable",[divTableId,divTable.getClientRects()]);
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
                    rows[j].cells[k].className = "hoveredRowOrColumn";
                }
                else{
                    rows[j].cells[k].className = "normalCell";
                }

            }
            break;
        }
    }
}

function deleteTable(id,parentId) {
    //to unselect cell (to not cause problems)
    setCurrentlyChosenCell(currentlyChosenCell,parentId);
    let tableId = id.split("Header")[0];
    let divTable = document.getElementById(tableId);
    let oldTable = divTable.cloneNode(true);
    let element = document.getElementById(tableId);
    element.parentNode.removeChild(element);
    let newTable = "Empty";
    addToMemory(parentId,oldTable,newTable,"changedTable",[divTable.id,divTable.getClientRects()]);
    reDrawArrows(index);
}