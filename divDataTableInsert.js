var divIndex = 0;
//variable that holds real id and divIndex for each data tables instance
var divTranslate = [];
insertDataTables("MyNewDiv0");
insertDataTables("MyNewDiv1");
//creating whole top bar
function insertDataTables(divId){
    if(!checkIfDivIsIn(divId)) {
        divTranslate.push([divId, divIndex]);
        let div = document.getElementById(divId);
        let form = document.createElement("form");
        let tmpInput = createInput("text", "tabName" +divIndex , "name" );
        let tmp;
        let tmp1;
        form.appendChild(createLabel(tmpInput.id, "Insert table name "));
        form.appendChild(createBr());
        form.appendChild(tmpInput);
        form.appendChild(createLabel(tmpInput.id, " Or edit table (type id in the field) "));
        div.appendChild(form);
        tmpInput = createInput("text", "tabId" +divIndex, "tabId" );
        form.appendChild(tmpInput);
        form.appendChild(createButton("button", "editTableByIdButton"+divIndex , "editTableById("+divIndex+")", "Get"));
        form.appendChild(createBr());
        tmp = document.createElement("label");
        tmp.class = "switch";
        tmp.appendChild(createInput("checkbox", "tableType"+divIndex , ""));
        tmp1 = document.createElement("span");
        tmp1.id = "tableTypeText"+divIndex ;
        tmp1.innerText = "Type of table (if checked major)";
        tmp.appendChild(tmp1);
        form.appendChild(tmp);
        form.appendChild(createBr());
        tmpInput = createInput("text", "colNames"+divIndex , "cols" );
        form.appendChild(createLabel(tmpInput.id, "Insert columns headers separated with \";\", first inputs, then outputs:)"));
        form.appendChild(createBr());
        form.appendChild(tmpInput);
        form.appendChild(createInput("text", "argNames"+divIndex , "args" ));
        form.appendChild(createBr());
        tmpInput = createInput("text", "rowCount"+divIndex );
        form.appendChild(createLabel(tmpInput.id, " Number of rows ", ""));
        form.appendChild(createBr());
        form.appendChild(tmpInput);
        form.appendChild(createBr());
        form.appendChild(createButton("button", "addButton"+divIndex , "setupMainDiv("+divIndex+")", " Add table"));
        div.appendChild(createBr());
        div.appendChild(createButton("button", "downloadJson"+divIndex , "toJson("+divIndex+")", "download .json file"));
        tmpInput = document.createElement("input");
        tmpInput.type = "file";
        tmpInput.id = "selectFiles"+divIndex ;
        div.appendChild(tmpInput);
        div.appendChild(createButton("button", "import"+divIndex , "fromJson("+divIndex+")", "upload .json file"));
        div.appendChild(createBr());
        tmp = document.createElement("p");
        tmp.innerText = "Hold green or purple element do drag table. Green tables are minor, the purple are major";
        div.appendChild(tmp);
        div.appendChild(createBr());
        div.appendChild(createButton("button", "undo"+divIndex , "undo("+divIndex+")", "undo"));
        div.appendChild(createButton("button", "redo"+divIndex , "redo("+divIndex+")", "redo"));
        tmp = document.createElement("p");
        tmp.appendChild(createLabel("editField"+divIndex , "Edit field : "));
        tmp1 =createInput("text", "editField"+divIndex,"editField" );
        tmp.appendChild(tmp1);
        input.push([divIndex,tmp1.id])
        tmp.appendChild(createButton("button", "deleteModeButton"+divIndex , "switchDeleteMode("+divIndex+")", "Delete mode"));
        deleteMode.push(false);
        div.appendChild(tmp);
        // single canvas for testing already in new.html
        tmp = document.createElement("canvas");
        tmp.id = "canvas" +divIndex ;
        canvases.push([divIndex,tmp.id]);
        tmp.width = 3000;
        tmp.height = 1500;
        tmp.textContent = "Your browser does not support the HTML canvas tag.";
        div.appendChild(tmp);
        divIndex++;
    }
}

function createLabel(forElement, innerText){
    let label = document.createElement("label");
    label.innerText = innerText;
    label.htmlFor = forElement;
    return label;
}

function createInput(type, id, name){
    let input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = name;
    return input;
}

function createButton(type, id, onClick, innerText){
    let button = document.createElement("button");
    button.type = type;
    button.id = id;
    button.setAttribute('onclick',onClick);
    button.innerText = innerText;
    return button;
}

function createBr(){
    return document.createElement("br");
}

function checkIfDivIsIn(divId){
    for(let i=0;i<divTranslate.length;i++){
        if(divTranslate[i][0].localeCompare(divId)===0){
            return true;
        }
    }
    return false;
}
//inner id = id that this script assigns, not the user's id
function getDivInnerId(outerId){
    for(let i=0;i<divTranslate.length;i++){
        if(divTranslate[i][0].localeCompare(outerId)===0){
            return divTranslate[i][1];
        }
    }
    return "";
}
//outer id = id given to div by a user
function getDivOuterId(innerId){
    for(let i=0;i<divTranslate.length;i++){
        if(divTranslate[i][1]===innerId){
            return divTranslate[i][0];
        }
    }
    return "";
}
function getParentIdFromCell(cell){
    return cell.parentElement.parentElement.parentElement.parentElement.id;
}