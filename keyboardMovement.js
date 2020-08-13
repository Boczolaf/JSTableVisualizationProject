function leftArrowPressed() {
    if(typeof currentlyChosenCell !== 'string'){
        let index = currentlyChosenCell.cellIndex-1;
        let row = currentlyChosenCell.parentElement;
        if(index !== 0){
            setCurrentlyChosenCell(row.cells[index]);
        }
    }
}

function rightArrowPressed() {
    if(typeof currentlyChosenCell !== 'string'){
        let index = currentlyChosenCell.cellIndex+1;
        let row = currentlyChosenCell.parentElement;
        if(index !== row.cells.length){
            setCurrentlyChosenCell(row.cells[index]);
        }
    }
}

function upArrowPressed() {
    if(typeof currentlyChosenCell !== 'string'){
        let index = currentlyChosenCell.cellIndex;
        let rowIndex = currentlyChosenCell.parentElement.rowIndex-1;
        let table = currentlyChosenCell.parentElement.parentElement;
        if(rowIndex !== 0){
            setCurrentlyChosenCell(table.rows[rowIndex].cells[index]);
        }

    }
}

function downArrowPressed() {
    if(typeof currentlyChosenCell !== 'string'){
        let index = currentlyChosenCell.cellIndex;
        let rowIndex = currentlyChosenCell.parentElement.rowIndex+1;
        let table = currentlyChosenCell.parentElement.parentElement;
        if(rowIndex !== table.rows.length){
            setCurrentlyChosenCell(table.rows[rowIndex].cells[index]);
        }
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