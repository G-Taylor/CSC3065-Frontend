// standalone function to handle the response from the functions and update the answer
function UpdateAnswer(j) {
    let answer;

    console.log(j)
    if (j.error === "false" || !j.error) {
        answer = j.answer;
    } else {
        answer = "Error";
    }
    document.getElementById('output').value = answer;
}

// one main function that takes a function type as an argument, and gets the URL from an external list
function EditorFunction(func) {
    // let urlStart = "http://";
    // let urlEnd = ".40234272.qpc.hal.davecutting.uk";
    let proxy = "http://proxy.40234272.qpc.hal.davecutting.uk"
    let xhttp = new XMLHttpRequest();
    let functions = function_list;

    if (functions[func] == undefined){
        document.getElementById('output').value = "Function Undefined";
    } else {
        xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var j = JSON.parse(this.response);
            UpdateAnswer(j);
        }};
    }

    // let url = [
    //     // http://
    //     urlStart, 
    //     // editor function
    //     functions[func],
    //     // rancher endpoint 
    //     urlEnd, 
    //     // query
    //     "/?text=", encodeURI(document.getElementById('content').value)
    // ].join('');

    let url = [
        // Proxy URL
        proxy,
        //function query
        "/?func=", 
        // editor function
        functions[func], 
        // query
        "&text=", encodeURI(document.getElementById('content').value)
    ].join('');
    console.log(url);
    xhttp.open("GET", url);
    xhttp.send();
}