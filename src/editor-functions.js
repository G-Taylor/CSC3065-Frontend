// standalone function to handle the response from the functions and update the answer
function UpdateAnswer(response) {
    let answer;

    var j = JSON.parse(response);
    if (j.error === "false" || !j.error) {
        answer = j.answer;
    } else {
        answer = "Error";
    }
    document.getElementById('output').value = answer;
}

// one main function that takes a function type as an argument, and gets the URL from an external list
function EditorFunction(func) {

    let proxy = "http://proxy.40234272.qpc.hal.davecutting.uk"
    let xhttp = new XMLHttpRequest();

    if (func == undefined){
        document.getElementById('output').value = "Function Undefined";
    } else {
        xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            UpdateAnswer(this.response);
        }};
    }

    let url = [
        // Proxy URL
        proxy,
        //function query
        "/?func=", 
        // editor function
        func, 
        // query
        "&text=", encodeURI(document.getElementById('content').value)
    ].join('');

    xhttp.open("GET", url);
    xhttp.send();
}