function editTableById() {
    editingTable = true;
    let id = document.getElementById("tabId").value;
    document.getElementById("tableType").style.visibility = "hidden";
    document.getElementById("tableTypeText").style.visibility = "hidden";
    if (id) {
        let table = document.getElementById(id);
        if(typeof table !== 'undefined') {
            document.getElementById("addButton").innerText = "Add columns and/or rows";
            document.getElementById("addButton").onclick = function () {
                changeDiv()
            };
            document.getElementById("tabName").value = table.childNodes[0].innerText.split("(id:")[0];
        }
    }

}

function changeDiv() {
    editingTable = false;
    document.getElementById("addButton").innerText = "Add table";
    document.getElementById("tableType").style.visibility = "visible";
    document.getElementById("tableTypeText").style.visibility = "visible";
    document.getElementById("addButton").onclick = function () {
    setupMainDiv()
    };

    let id = document.getElementById("tabId").value;
    let oldTable = document.getElementById(id).cloneNode(true);
    let mainDiv = document.getElementById(id);
    let headerDiv = mainDiv.childNodes[0];
    let table = mainDiv.childNodes[1];
    let rows = table.rows;
    let typeOfTable = rows[0].cells[rows[0].cells.length-1].id.split("/")[1];
    typeOfTable = typeOfTable.localeCompare("minor") !== 0;
    headerDiv.innerText = document.getElementById("tabName").value + "(id:" + id + ")";
    createDeleteButton(headerDiv, "header");
    //adding columns
    let colsToAddIn = document.getElementById("colNames").value.split(";");
    let colsToAddOut = document.getElementById("argNames").value.split(";");
    let cell;
    if (colsToAddIn || colsToAddOut) {

        let typeOfNext;
        //getting to right spot (first adding in then out)
        for (let i = 0; i < rows[0].cells.length; i++) {
            if (typeof rows[0].cells[i].id.split("/")[2] === 'undefined') {
                typeOfNext = "null";
            } else {
                typeOfNext = rows[0].cells[i].id.split("/")[2];
            }
            if (rows[0].cells.length === 1 || (!(colsToAddIn[0].localeCompare("") === 0) && typeOfNext.localeCompare("out") === 0)) {
                for (let k = 0; k < colsToAddIn.length; k++) {
                    cell = rows[0].insertCell(k);
                    setInColumnCellForAdding(cell, colsToAddIn[k], table);
                    for (let j = 1; j < rows.length; j++) {
                        cell = rows[j].insertCell(k);
                        setNormalCellForAdding(cell);
                        if (k === 0) {
                            cell.id = table.id + "/" + "row" + j;
                            createDeleteButton(cell, "row");
                        }
                    }
                }
                break;
            } else if ((!(colsToAddIn[0].localeCompare("") === 0) && typeOfNext.localeCompare("in") === 0)) {
                if (rows[0].cells[i + 1].id.split("/")[2].localeCompare("out") === 0) {
                    for (let k = 0; k < colsToAddIn.length; k++) {
                        cell = rows[0].insertCell(i + 1 + k);
                        setInColumnCellForAdding(cell, colsToAddIn[k], table);
                        for (let j = 1; j < rows.length; j++) {
                            cell = rows[j].insertCell(i + 1 + k);
                            setNormalCellForAdding(cell);
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
                if(typeOfTable){
                    indexToInsert = rows[i].cells.length - 2;
                }
                cell = rows[i].insertCell(indexToInsert);
                if (i === 0) {
                    setOutColumnCellForAdding(cell, colsToAddOut[m], table);
                } else {
                    setNormalCellForAdding(cell);
                    if (rows[0].cells.length - 1 === 0) {
                        cell.id = table.id + "/" + "row" + i;

                        createDeleteButton(cell, "row");
                    }
                }
            }
        }
        }
    }
    //adding rows
    let numberOfRows = document.getElementById("rowCount").value;
    let row;
    let connectionId = 1;
    let startingRowLength = table.rows.length;
    if(typeof numberOfRows !== 'undefined'){
        if(parseInt(numberOfRows)){
            for(let i =0; i<numberOfRows;i++){
                row = table.insertRow(rows.length);
                for(let j =0; j<rows[0].cells.length;j++){
                    cell = row.insertCell(j);
                    setNormalCellForAdding(cell);
                    if(j===0){
                        cell.id = table.id + "/" + "row" + (rows.length-1);
                        createDeleteButton(cell, "row");
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
    let newTable = document.getElementById(id).cloneNode(true);
    addToMemory(["changedTable",[oldTable,newTable],[id,document.getElementById(id).getClientRects()]]);
}

function setInColumnCellForAdding(cell,value ,table) {
    cell.style.padding = "20px";
    cell.innerText = value;
    cell.style.border = "thin solid #000000";
    cell.style.backgroundColor = blue;
    cell.id = table.id + "/" + "column" + (table.rows[0].cells.length + 1) + "/" + "in";
    cell.setAttribute('onclick', 'onClickForFirstRow(this)');
    createDeleteButton(cell, "column");
}
function setOutColumnCellForAdding(cell, value, table) {
    cell.style.padding = "20px";
    cell.style.border = "thin solid #000000";
    cell.style.backgroundColor = red;
    cell.innerText = value;
    cell.id = table.id + "/" + "column" + (table.rows[0].cells.length + 1) + "/" + "out";
    cell.setAttribute('onclick', 'onClickForFirstRow(this)');
    createDeleteButton(cell, "column");
}

function setNormalCellForAdding(cell) {
    cell.style.backgroundColor = white;
    cell.innerText = startValue;
    cell.style.padding = "20px";
    cell.style.border = "thin solid #000000";
    cell.setAttribute('onclick', 'onClick(this)');
}
function setTopRowIdCell(row){
    let cell;
    cell = row.insertCell(0);
    cell.style.padding = "20px";
    cell.innerText = "Row id's";
    cell.style.border = "thin solid #000000";
    cell.style.backgroundColor = white;
}
function cleanUpWrongButtons(table){
    let rows = table.rows;
    for(let i = 1;i<rows.length;i++){
        for(let j = 1;j<rows[i].cells.length;j++){
            rows[i].cells[j].innerText = rows[i].cells[j].innerText.split("<input")[0];
        }
    }

}