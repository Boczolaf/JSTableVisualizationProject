function checkCellContent(value,element){
    //change names of columns to values
    let columns = getColumns(element);
    let tmpValue = value;
    let colName;
    let tmpColumn;
    if(value.includes(";")){
        return "";
    }
    for(let i =0; i< columns.length;i++){
        colName = "#"+columns[i][0];
        tmpColumn = columns[i].slice(1);
        tmpColumn = "[" + tmpColumn.toString() + "]";
        tmpValue = tmpValue.replace(colName,tmpColumn);
    }
    console.log(tmpValue);
    //try to execute code
    try {
       eval(tmpValue);
    } catch (e) {
        return "";
    }
    return value;
}
function getColumns(element){
    let parentId = getParentIdFromCell(element);
    let returnValue = [];
    let columnInfo;
    let table = document.getElementById(parentId).childNodes[1];
    let rows = table.rows;
    for(let i =1; i< rows[0].cells.length;i++){
        if(rows[0].cells[i].id.includes("minor") || rows[0].cells[i].id.includes("major")){
            break;
        }
        columnInfo =[];
        columnInfo.push(rows[0].cells[i].textContent);
        for(let j=1; j< rows.length;j++){
        columnInfo.push(rows[j].cells[i].textContent);
        }
        returnValue.push(columnInfo);
    }
    return returnValue;

}
//example function
function sum(table){
    return table.reduce((a, b) => a + b, 0);
}
