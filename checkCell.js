function checkCellContent(value){
    //change names of columns to values

    try {
        eval(value);
    } catch (e) {
        if (e instanceof SyntaxError) {
            return "";
        }
        else{
            return value;
        }
    }
}
//example function
function sum(table){
    return table.reduce((a, b) => a + b, 0);
}
