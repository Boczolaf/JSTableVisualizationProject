function editTableById(divId) {
    let parentIndex = getDivInnerId(divId);
    let id = document.getElementById("tabId"+parentIndex).value;
    id = findIdFromName(id);
    if (id) {
        let table = document.getElementById(id);
        if(checkIfTableBelongsInDiv(table.id,parentIndex)){
            document.getElementById("tableType"+parentIndex).style.visibility = "hidden";
            document.getElementById("tableTypeText"+parentIndex).style.visibility = "hidden";
        if(typeof table !== 'undefined') {
            document.getElementById("addButton"+parentIndex).innerText = "Add columns and/or rows";
            document.getElementById("addButton"+parentIndex).onclick = function () {
                changeDiv(parentIndex)
            };
            document.getElementById("tabName"+parentIndex).value = table.childNodes[0].innerText;
        }
    }
    }

}

function changeDiv(parentIndex) {
    document.getElementById("addButton"+parentIndex).innerText = "Add table";
    document.getElementById("tableType"+parentIndex).style.visibility = "visible";
    document.getElementById("tableTypeText"+parentIndex).style.visibility = "visible";
    document.getElementById("addButton"+parentIndex).onclick = function () {
    setupMainDiv(getDivOuterId(parentIndex));
    };
    let id = findIdFromName(document.getElementById("tabId"+parentIndex).value);
    let oldTable = document.getElementById(id).cloneNode(true);
    let mainDiv = document.getElementById(id);
    let headerDiv = mainDiv.childNodes[0];
    let table = mainDiv.childNodes[1];
    let rows = table.rows;
    let typeOfTable = rows[0].cells[rows[0].cells.length-1].id.split("/")[1];
    typeOfTable = typeOfTable.localeCompare("minor") !== 0;
    headerDiv.innerText = document.getElementById("tabName"+parentIndex).value;
    createDeleteButton(headerDiv, "header");
    //adding columns
    let colsToAddIn = document.getElementById("colNames"+parentIndex).value.split(";");
    let colsToAddOut = document.getElementById("argNames"+parentIndex).value.split(";");
    let cell;
    let h=1
    let maxNormal = getLastNormalCellIndex(table);
    if (colsToAddIn || colsToAddOut) {
        let typeOfNext;
        //getting to right spot (first adding in then out)
        for (let i = 0; i < rows[0].cells.length; i++) {
            if (typeof rows[0].cells[i].id.split("/")[2] === 'undefined') {
                typeOfNext = "null";
            } else {
                typeOfNext = rows[0].cells[i].id.split("/")[2];
            }
            if ((!(colsToAddIn[0].localeCompare("") === 0) && (typeOfNext.localeCompare("out") === 0) )) {
                for (let k = 0; k < colsToAddIn.length; k++) {
                    cell = rows[0].insertCell(k+1);
                    setInColumnCellForAdding(cell, colsToAddIn[k], table,parentIndex);
                    for (let j = 1; j < rows.length; j++) {
                        cell = rows[j].insertCell(k+1);
                        setNormalCellForAdding(cell,table,parentIndex,maxNormal +h);
                        h++;
                        if (k === 0) {
                            cell.id = table.id + "/" + "row" + j;
                            createDeleteButton(cell, "row",parentIndex);
                        }
                    }
                }
                break;
            } else if ((!(colsToAddIn[0].localeCompare("") === 0) && (typeOfNext.localeCompare("in")=== 0)||(typeOfNext.localeCompare("null") === 0) )) {
                if (rows[0].cells[i + 1].id.split("/")[2].localeCompare("out") === 0) {
                    for (let k = 0; k < colsToAddIn.length; k++) {
                        cell = rows[0].insertCell(i + 1 + k);
                        setInColumnCellForAdding(cell, colsToAddIn[k], table,parentIndex);
                        for (let j = 1; j < rows.length; j++) {
                            cell = rows[j].insertCell(i + 1 + k);
                            setNormalCellForAdding(cell,table,parentIndex,maxNormal+h);
                            h++;
                        }
                    }
                    break;
                }
            }
        }
        //now adding out
        let indexToInsert;
        if(!(colsToAddOut[0].localeCompare("")===0)) {
            for (let i = 0; i < rows.length; i++) {
                for (let m = 0; m < colsToAddOut.length; m++) {
                    indexToInsert = rows[i].cells.length - 1;
                    if (typeOfTable) {
                        indexToInsert = rows[i].cells.length - 2;
                    }
                    cell = rows[i].insertCell(indexToInsert);
                    if (i === 0) {
                        setOutColumnCellForAdding(cell, colsToAddOut[m], table, parentIndex);
                    } else {
                        setNormalCellForAdding(cell,table,parentIndex,maxNormal+h);
                        h++;
                        if (rows[0].cells.length - 1 === 0) {
                            cell.id = table.id + "/" + "row" + i;

                            createDeleteButton(cell, "row", parentIndex);
                        }
                    }
                }
            }
        }
        }
    //adding rows
    let numberOfRows = document.getElementById("rowCount"+parentIndex).value;
    let row;
    let connectionId = 1;
    let startingRowLength = table.rows.length;
    if(typeof numberOfRows !== 'undefined'){
        if(parseInt(numberOfRows)){
            for(let i =0; i<numberOfRows;i++){
                row = table.insertRow(rows.length);
                for(let j =0; j<rows[0].cells.length;j++){
                    cell = row.insertCell(j);
                    setNormalCellForAdding(cell,table,parentIndex,maxNormal+h);
                    h++;
                    if(j===0){
                        cell.id = table.id + "/" + "row" + (rows.length-1);
                        cell.innerText = mainDiv.id+ "/" + "row" + (rows.length-1);
                        createDeleteButton(cell, "row",parentIndex);
                    }
                    else if(j===rows[0].cells.length-1 && !typeOfTable){
                        cell.id = table.id + "/" + "connection" + (rows.length-1);
                    }
                    else if((j===rows[0].cells.length-2 || j===rows[0].cells.length-1) && typeOfTable){
                        cell.id = table.id + "/" + "connection" + (startingRowLength + connectionId);
                        connectionId++;
                    }
                }
            }
        }
    }
    cleanUpWrongButtons(table);
    let newTable =  document.getElementById(id).cloneNode(true);
    addToMemory(parentIndex,oldTable,newTable,"changedTable",[newTable.id,newTable.getClientRects()]);
}

function setInColumnCellForAdding(cell,value ,table,parentIndex) {
    cell.className = "leftSideValues";
    cell.innerText = value;
    cell.id = table.id + "/" + "column" + (table.rows[0].cells.length + 1) + "/" + "in";
    cell.setAttribute('onclick', 'onClickForFirstRow(this,'+parentIndex+')');
    createDeleteButton(cell, "column",parentIndex);
}
function setOutColumnCellForAdding(cell, value, table,parentIndex) {
    cell.className = "rightSideValues";
    cell.innerText = value;
    cell.id = table.id + "/" + "column" + (table.rows[0].cells.length + 1) + "/" + "out";
    cell.setAttribute('onclick', 'onClickForFirstRow(this,'+parentIndex+')');
    createDeleteButton(cell, "column",parentIndex);
}

function setNormalCellForAdding(cell,table,parentIndex,maxNormal) {
    cell.className = "normalCell";
    cell.innerText = startValue;
    cell.id =  table.id + "/" +"cell" + maxNormal;
    cell.setAttribute('onclick', 'onClick(this,'+parentIndex+')');
}
function setTopRowIdCell(row){
    let cell;
    cell = row.insertCell(0);
    cell.className = "normalCell";
    cell.innerText = "Row id's";
}
function cleanUpWrongButtons(table){
    let rows = table.rows;
    for(let i = 1;i<rows.length;i++){
        for(let j = 1;j<rows[i].cells.length;j++){
            rows[i].cells[j].innerText = rows[i].cells[j].innerText.split("<input")[0];
        }
    }

}
function getLastNormalCellIndex(table){
    let rows = table.rows;
    let max =0
    let tmp;
    for(let i=1;i<rows.length;i++){
        tmp = parseInt(rows[i].cells[rows[i].cells.length-1].id.split("cell")[1]);
        if(tmp>max){
            max = tmp;
        }
    }
    return max;
}