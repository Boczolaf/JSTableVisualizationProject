let scripts = ["changeTable.js","checkCell.js","connections.js","divDataTableInsert.js","draggable.js","history.js",
    "json.js","keyboardMovement.js","newTable.js"]
function loadScript(url)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

for(let i =0;i<scripts.length;i++){
    loadScript(scripts[i])
}

