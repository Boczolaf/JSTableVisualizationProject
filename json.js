
function fromJson(parentId) {
    if(typeof currentlyChosenCell !=='string'){
        setCurrentlyChosenCell(currentlyChosenCell,parentId);
    }
    let files = document.getElementById('selectFiles'+parentId).files;
    if (files.length <= 0) {
        return false;
    }
    let fr = new FileReader();
    fr.onload = function (e) {
        //delete all previous tables
        deleteAllTables(parentId);
        let result = JSON.parse(e.target.result);
        let dataToProcess = result['data'];
        for(let i =0; i< dataToProcess.length;i++){
            createDivTableFromArray(dataToProcess[i],parentId);
        }

    }
    fr.readAsText(files.item(0));
}
function createDivTableFromArray(data,parentId) {
    let title = data[0];
    let type = data[1];
    let tableInfo = data[2][0];
    let indexOfFirstOut = data[3];
    let content = data[4];
    let div = document.createElement("div");
    let id = "divTable" + getNextIndex();
    div.id = id;
    let currIndex = parseInt(id.replace("divTable",""));
    div.style.position = "absolute";
    div.appendChild(setupHeaderDiv(currIndex,title,type,parentId));
    div.appendChild(createTableFromContent(id,content,indexOfFirstOut,type,parentId));
    reDrawArrows(index);
    let parentDiv = document.getElementById(getDivOuterId(parentId));
    parentDiv.insertBefore(div, document.getElementById("canvas"+parentId));
    dragElement(document.getElementById(div.id));
    div.style.left = tableInfo.left.toString() + "px";
    div.style.top = tableInfo.top.toString() + "px";

}
function createTableFromContent(id, content,indexOfFirstOut,type,parentId){
    let table = document.createElement("table");
    let typeOfTable = type.localeCompare("major")===0;
    table.id = id.replace("divTable","table");
    table.className = "table";
    //arguments
    //get number of rows
    let row;
    row = table.insertRow(0);
    let cell;
    setTopRowIdCell(row);
    let topLength = content[0].length-1;
    if(typeOfTable){
        topLength--;
    }
//setting up top of table
    for (let i = 1; i < topLength; i++) {
        cell = row.insertCell(i)
        cell.innerText = content[0][i];
        if(i<indexOfFirstOut){
            cell.id = table.id + "/column" +i +"/in"
            cell.className = "leftSideValues";
        }
        else{
            cell.id = table.id + "/column" +i +"/out"
            cell.className = "rightSideValues";
        }
        cell.setAttribute('onclick', 'onClickForFirstRow(this)');
        createDeleteButton(cell, "column",parentId);

    }
    //connections
    cell = row.insertCell(topLength);
    cell.className = "connections";
    cell.innerText = "Connections to minor(;=separator)";
    cell.id = table.id + "/minor";
    if(typeOfTable){
        cell.className = "connections";
        cell.id = "";
        cell = row.insertCell(content[0].length-1);
        cell.id = table.id + "/major";
        cell.innerText = "Connections to major(;=separator)";
    }

    //rest of data
    let h =0;
    let currIndex;
    let connectionId = 0;
    for (let i = 0; i< content.length-1;i++) {
        currIndex = i + 1;
        row = table.insertRow();
        for (let j = 0; j < content[currIndex].length; j++) {
            cell = row.insertCell(j);
            cell.className = "normalCell";
            cell.innerText = content[currIndex][j];
            if (j === 0) {
                cell.id = table.id + "/row" + i;
                cell.innerText = cell.id;
                createDeleteButton(cell, "row",parentId);
            } else if ((j === content[currIndex].length - 1 && !typeOfTable)||(typeOfTable &&(j === content[currIndex].length - 1 || j === content[currIndex].length - 2))) {
                cell.id = table.id + "/connection" + connectionId;
                connectionId++;
                cell.setAttribute('onclick', 'onClickConnection(this)');
            } else {
                cell.setAttribute('onclick', 'onClick(this)');
                cell.id = table.id + "/cell" + h;
                h++;
            }

        }

    }
    return table;

}

function deleteAllTables(parentIndex) {
    let element;
    let id;
    for(let i =0; i<=index;i++){
        id = "divTable" + i;
        if(checkIfTableBelongsInDiv(id,parentIndex)) {
            element = document.getElementById(id);
            if (element) {
                document.body.removeChild(element);
            }
        }
    }
    deleteTablesFromParentId(parentIndex);

}
function toJson(parentId){
    if(typeof currentlyChosenCell !=='string'){
        setCurrentlyChosenCell(currentlyChosenCell,parentId);
    }
    let json={};
    let mainDiv;
    let header;
    let table;
    let id;
    let rows;
    let wholeData =[];
    let data = []
    let dataRows = []
    let dataCells = [];
    let type;
    let tableInfo;
    let indexOfFirstOut = "empty";
    let savedIndex = false;
    for(let i = 0; i<=index;i++){
        id = "divTable"+i;
        if(checkIfTableBelongsInDiv(id,parentId)){
        mainDiv = document.getElementById(id);
        if(mainDiv !== null){
            header = mainDiv.childNodes[0];
            data.push(header.textContent);
            table = mainDiv.childNodes[1];
            rows = table.rows;
            type = rows[0].cells[rows[0].cells.length-1].id.split("/")[1];
            data.push(type);
            tableInfo = mainDiv.getClientRects();
            data.push(tableInfo);
            for(let j =0; j<rows.length;j++){
                dataCells = []
                for(let k = 0; k< rows[j].cells.length;k++){
                    if(rows[j].cells[k].id){
                        if(typeof rows[j].cells[k].id.split("/")[2] !== 'undefined'){
                            if(rows[j].cells[k].id.split("/")[2].localeCompare("out")===0 && !savedIndex){
                                indexOfFirstOut = k;
                                savedIndex = true;
                            }
                        }
                    }
                    dataCells.push(rows[j].cells[k].innerText);
                }
                dataRows.push(dataCells);
            }
            data.push(indexOfFirstOut);
            data.push(dataRows);
            dataRows =[];
        }
        if(data.length){
            wholeData.push(data);
            data = [];
        }
        }
    }

    json['data'] = wholeData;
    downloadObjectAsJson(json,"MyTables")

}
function downloadObjectAsJson(exportObj, exportName){
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}