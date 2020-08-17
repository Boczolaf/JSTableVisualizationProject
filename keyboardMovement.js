function leftArrowPressed() {
    if(typeof currentlyChosenCell !== 'string'){
        let index = currentlyChosenCell.cellIndex-1;
        let row = currentlyChosenCell.parentElement;
        if(index !== 0){
            let cell = row.cells[index];
            let type = cell.id.split("/")[1];
            if(type.includes("cell")){
                onClick(cell);
            }
            else if(type.includes("connection")){
                onClickConnection(cell);
            }
            else if(type.includes("column")){
                onClickForFirstRow(cell);
            }
        }
    }
}

function rightArrowPressed() {
    if(typeof currentlyChosenCell !== 'string'){

        let index = currentlyChosenCell.cellIndex+1;
        let row = currentlyChosenCell.parentElement;
        if(index !== row.cells.length){
            let cell = row.cells[index];
            let type = cell.id.split("/")[1];
            if(type.includes("cell")){
                onClick(cell);
            }
            else if(type.includes("connection")){
                onClickConnection(cell);
            }
            else if(type.includes("column")){
                onClickForFirstRow(cell);
            }
        }
    }
}

function upArrowPressed() {
    if(typeof currentlyChosenCell !== 'string'){
        let index = currentlyChosenCell.cellIndex;
        let rowIndex = currentlyChosenCell.parentElement.rowIndex-1;
        let table = currentlyChosenCell.parentElement.parentElement;
        if(rowIndex !== 0){
            let cell = table.rows[rowIndex].cells[index];
            changeSelectedCellForArrowMovement(cell);
    }
}
}

function downArrowPressed() {
    if(typeof currentlyChosenCell !== 'string'){

        let index = currentlyChosenCell.cellIndex;
        let rowIndex = currentlyChosenCell.parentElement.rowIndex+1;
        let table = currentlyChosenCell.parentElement.parentElement;
        if(rowIndex !== table.rows.length){
            let cell = table.rows[rowIndex].cells[index];
            changeSelectedCellForArrowMovement(cell);
        }
    }
}

function changeSelectedCellForArrowMovement(cell){
    let type = cell.id.split("/")[1];
    if(type.includes("cell")){
        onClick(cell);
    }
    else if(type.includes("connection")){
        onClickConnection(cell);
    }
    else if(type.includes("column")){
        onClickForFirstRow(cell);
    }
}

function moveSelection(evt) {
    switch (evt.keyCode) {
        case 37:
            if(evt.location ===3){
                leftArrowPressed();
            }
            break;
        case 39:
            if(evt.location ===3) {
                rightArrowPressed();
            }
            break;
        case 38:
            if(evt.location ===3) {
                upArrowPressed();
            }
            break;
        case 40:
            if(evt.location ===3) {
                downArrowPressed();
            }
            break;
    }
}

function loadMacros()
{
    window.addEventListener('keydown', moveSelection);
}