var divIndex = 0;
insertDataTables("MyNewDiv0");
function insertDataTables(divId){
    let div = document.getElementById(divId);
    let form = document.createElement("form");
    let tmpInput = createInput("text","tabName"+divIndex,"name"+divIndex);
    let tmp;
    let tmp1;
    form.appendChild(createLabel(tmpInput.id,"Insert table name "));
    form.appendChild(createBr());
    form.appendChild(tmpInput);
    form.appendChild(createLabel(tmpInput.id," Or edit table (type id in the field) "));
    div.appendChild(form);
    tmpInput = createInput("text","tabId"+divIndex,"tabId"+divIndex);
    form.appendChild(tmpInput);
    form.appendChild(createButton("button","editTableByIdButton"+ divIndex,function () {editTableById()},"Get"));
    form.appendChild(createBr());
    tmp = document.createElement("label");
    tmp.class = "switch";
    tmp.appendChild(createInput("checkbox","tableType"+ divIndex,""));
    tmp1 = document.createElement("span");
    tmp1.id = "tableTypeText" + divIndex;
    tmp1.innerText = "Type of table (if checked major)";
    tmp.appendChild(tmp1);
    form.appendChild(tmp);
    form.appendChild(createBr());
    tmpInput = createInput("text","colNames"+divIndex,"cols"+divIndex);
    form.appendChild(createLabel(tmpInput.id,"Insert columns headers separated with \";\", first inputs, then outputs:)"));
    form.appendChild(createBr());
    form.appendChild(tmpInput);
    form.appendChild(createInput("text","argNames"+ divIndex,"args" + divIndex));
    form.appendChild(createBr());
    tmpInput = createInput("text","rowCount"+divIndex);
    form.appendChild(createLabel(tmpInput.id," Number of rows ",""));
    form.appendChild(createBr());
    form.appendChild(tmpInput);
    form.appendChild(createBr());
    form.appendChild(createButton("button","addButton"+divIndex,function () {setupMainDiv()}," Add table"));
    div.appendChild(createBr());
    div.appendChild(createButton("button","downloadJson" + divIndex,"toJson()","download .json file"));
    tmpInput = document.createElement("input");
    tmpInput.type = "file";
    tmpInput.id = "selectFiles" + divIndex;
    div.appendChild(tmpInput);
    div.appendChild(createButton("button","import" + divIndex,function () {fromJson()},"upload .json file"));
    div.appendChild(createBr());
    tmp = document.createElement("p");
    tmp.innerText = "Hold green or purple element do drag table. Green tables are minor, the purple are major";
    div.appendChild(tmp);
    div.appendChild(createBr());
    div.appendChild(createButton("button","undo" + divIndex,function () {undo()},"undo"));
    div.appendChild(createButton("button","redo" + divIndex,function () {redo()},"redo"));
    tmp = document.createElement("p");
    tmp.appendChild(createLabel("editField" + divIndex,"Edit field : "));
    tmp.appendChild(createInput("text","editField" +divIndex));
    tmp.appendChild(createButton("button","deleteModeButton"+ divIndex,function() {switchDeleteMode()},"Delete mode"));
    div.appendChild(tmp);
    tmp = document.createElement("canvas");
    tmp.id = "canvas" + divIndex;
    tmp.width = 3000;
    tmp.height = 1500;
    tmp.textContent = "Your browser does not support the HTML canvas tag.";
    div.appendChild(tmp);
    divIndex++;
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
    button.onclick = onClick;
    button.innerText = innerText;
    return button;
}

function createBr(){
    return document.createElement("br");
}
