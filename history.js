var memory = [];
function undo(parentId){
    let curr;
    //first we need to find first(iterating from back) not undone cell with matching parent id and then just undo()
    for(let i=1;i<=memory.length;i++){
        curr = memory.length-i;
        if(memory[curr].parentId===parentId && !memory[curr].undone){
            memory[curr].undo();
            break;
        }
    }
}

function redo(parentId){
    let curr;
    //first we need to find first undone cell with matching parent id and then just reddo()
    for(let i=0;i<memory.length;i++){
        if(memory[i].parentId===parentId && memory[i].undone){
            memory[i].redo();
            break;
        }
    }
}
//type
function addToMemory(parentId,previous,next,type,info){
    let memoryCell = new MemorySlot(parentId,previous,next,type,info);
    let curr;
    for(let i=1;i<=memory.length;i++){
        curr = memory.length-i;
        if(memory[curr].parentId===parentId && memory[curr].undone){
            memory.splice(curr, 1);
        }
    }
    memory.push(memoryCell);
}
class MemorySlot{
    constructor(parentId,previous,next,type,info) {
        this.previousState = previous;
        this.nextState = next;
        this.type = type;
        this.info = info;
        this.parentId = parentId;
        this.undone = false;
    }
    undo(){
        let element;
        let id;
        if(!this.undone) {
            this.undone = true;
            switch (this.type) {
                case "changedNormalField":
                    element = document.getElementById(this.info);
                    element.innerText = this.previousState;
                    createDeleteButton(element, "row",this.parentId);
                    break;
                case "changedFirstRowField":
                    element = document.getElementById(this.info);
                    if (element) {
                        element.innerText = this.previousState;
                        createDeleteButton(element, "column",this.parentId);
                    }
                    break;
                case "changedConnectionField":
                    element = document.getElementById(this.info);
                    element.innerText = this.previousState;
                    reDrawArrows(index);
                    break;
                case "changedTable":
                    id = this.info[0];
                    let parentDiv;
                    if (typeof this.previousState === 'string') {
                        console.log(this.previousState);
                        parentDiv = document.getElementById(getDivOuterId(this.parentId));
                        parentDiv.removeChild(document.getElementById(id));
                    }
                    if (!(typeof this.previousState === 'string')) {
                        let copy = this.previousState.cloneNode(true);
                        canvas = document.getElementById(getCanvasIdForParentId(this.parentId));
                        parentDiv = document.getElementById(getDivOuterId(this.parentId));
                        parentDiv.insertBefore(copy, canvas);
                        this.fixCopyOfDivTable(copy, this.info[1])

                    }
                    reDrawArrows(index);
                    break;

            }
        }
    }
    redo(){
        let element;
        let id;
        if(this.undone) {
            this.undone = false;
            switch (this.type) {
                case "changedNormalField":
                    element = document.getElementById(this.info);
                    element.innerText = this.nextState;
                    if (element.id.includes("row")) {
                        createDeleteButton(element, "row",this.parentId);
                    }
                    break;
                case "changedFirstRowField":
                    element = document.getElementById(this.info);
                    element.innerText = this.info;
                    createDeleteButton(element, "column",this.parentId);
                    break;
                case "changedConnectionField":
                    element = document.getElementById(this.info);
                    element.innerText = this.info;
                    reDrawArrows(index);
                    break;
                case "changedTable":
                    id = this.info[0];
                    let parentDiv = document.getElementById(getDivOuterId(this.parentId));
                    if (document.getElementById(id)) {
                        parentDiv.removeChild(document.getElementById(id));
                    }
                    if (!(typeof this.nextState === 'string')) {
                        let copy = this.nextState.cloneNode(true);
                        canvas = document.getElementById(getCanvasIdForParentId(this.parentId));
                        parentDiv.insertBefore(copy, canvas);
                        this.fixCopyOfDivTable(copy, this.info[1]);
                    }
                    reDrawArrows(index);
                    break;
            }
        }
    }
    fixCopyOfDivTable(copy, clientRect) {
    copy.boundingClientRect = clientRect;
    dragElement(copy);
    let header = copy.childNodes[0];
    let tmp;
    //clearing button
    tmp = header.innerText;
    header.innerText = tmp;
    createDeleteButton(header,"header",this.parentId);
    let table = copy.childNodes[1];
    let rows = table.rows;
    let cell;
    for(let i = 0;i< rows.length;i++){
        for(let j =0;j< rows[i].cells.length;j++){
            cell = rows[i].cells[j];

            if(i!==0){
                cell.style.backgroundColor=white;
                cell.setAttribute('onclick','onClick(this)');
                if(j===rows[i].cells.length-1){
                    cell.setAttribute('onclick','onClickConnection(this)');
                }
            }
            if(cell.id){
                //deleting buttons
                tmp = cell.innerText;
                cell.innerText = tmp;
                if(cell.id.includes("column")){
                    createDeleteButton(cell,"column",this.parentId);
                    cell.setAttribute('onclick','onClickForFirstRow(this)');
                    if(cell.id.includes("in")){
                        cell.style.backgroundColor = blue;
                    }
                    else{
                        cell.style.backgroundColor = red;
                        cell.style.color = black;
                    }

                }
                if(cell.id.includes("row")){
                    createDeleteButton(cell,"row",this.parentId);

                }

            }
            cell.style.color = black;
        }
    }

}
}




