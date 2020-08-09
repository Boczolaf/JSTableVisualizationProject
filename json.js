
function fromJson() {
    let files = document.getElementById('selectFiles').files;
    if (files.length <= 0) {
        return false;
    }
    let fr = new FileReader();
    fr.onload = function (e) {
        //delete all previous tables
        deleteAllTables();
        let result = JSON.parse(e.target.result);
        index = result['index'];
        let dataToProcess = result['data'];
        for(let i =0; i< dataToProcess.length;i++){
            createDivTableFromArray(dataToProcess[i]);
        }

    }
    fr.readAsText(files.item(0));
}
function createDivTableFromArray(data) {
    let title = data[0];
    let id = data[1];
    let indexOfFirstOut = data[2];
    let content = data[3];
    let div = document.createElement("div");
    div.id = id
    let currIndex = parseInt(id.replace("divTable",""));
    div.style.position = "absolute";
    div.appendChild(setupHeaderDiv(currIndex,title));
    div.appendChild(createTableFromContent(id,content,indexOfFirstOut));
    reDrawArrows(index);
    document.body.insertBefore(div, document.getElementById("canvas"));
    dragElement(document.getElementById(div.id));

}
function createTableFromContent(id, content,indexOfFirstOut){
    let table = document.createElement("table");
    table.id = id.replace("divTable","table");
    table.style.border = "thin solid #000000"
    table.style.borderCollapse = "collapse";
    //arguments
    //get number of rows
    let row;
    row = table.insertRow(0);
    let cell;
//setting up top of table
    for (let i = 0; i < content[0].length-1; i++) {
        cell = row.insertCell(i)
        cell.style.padding = "20px";
        cell.innerText = content[0][i];
        cell.style.border = "thin solid #000000";
        if(i<indexOfFirstOut){
            cell.id = table.id + "/column" +i +"/in"
            cell.style.backgroundColor = blue;
        }
        else{
            cell.id = table.id + "/column" +i +"/out"
            cell.style.backgroundColor = red;
        }
        cell.setAttribute('onclick', 'onClickForFirstRow(this)');
        createDeleteButton(cell, "column");

    }
    //connections
    cell = row.insertCell(content[0].length-1);
    cell.style.padding = "20px";
    cell.innerText = content[0][content[0].length-1];
    cell.style.border = "thin solid #000000";
    cell.style.backgroundColor = white;
    //rest of data
    let h =0;
    let currIndex;
    for (let i = 0; i< content.length-1;i++){
        currIndex = i+1;
        row = table.insertRow();
        for(let j =0;j < content[currIndex].length;j++){
            cell = row.insertCell(j);
            cell.style.backgroundColor = white;
            cell.innerText = content[currIndex][j];
            if(j ===0 ){
                cell.id = table.id +"/row" + i;
                createDeleteButton(cell,"row");
                cell.setAttribute('onclick', 'onClick(this)');
            }
            else if(j===content[currIndex].length-1){
                cell.id = table.id +"/connection" + i;
                cell.setAttribute('onclick', 'onClickConnection(this)');
            }
            else{
                cell.setAttribute('onclick', 'onClick(this)');
                cell.id = table.id + "/cell" + h;
                h++;
            }
            cell.style.padding = "20px";
            cell.style.border = "thin solid #000000";
        }
    }
    return table;

}

function deleteAllTables() {
    let element;
    for(let i =0; i<=index;i++){
        element = document.getElementById("divTable" + i);
        if(element){
            document.body.removeChild(element);
        }
    }

}
function toJson(){
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
    json['index'] = index;
    let indexOfFirstOut = "empty";
    let savedIndex = false;
    for(let i = 0; i<=index;i++){
        id = "divTable"+i;
        mainDiv = document.getElementById(id);
        if(mainDiv !== null){
            header = mainDiv.childNodes[0];
            data.push(header.textContent);
            data.push(id);
            table = mainDiv.childNodes[1];
            rows = table.rows;
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