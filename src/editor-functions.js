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

// function that takes a editor function type as an argument, and gets the proxy URL from an external list based on response status
async function EditorFunction(func) {
    let proxyList = PROXYLIST;
    let proxyStatus;

    // get the response from the main proxy URL
    fetch(proxyList['main']).then(function(response) {
        proxyStatus = response.status;
        if(proxyStatus == 200){         // If the response is OK, pass the main proxy url to runRequest and continue on with the operation
            let url = [
                proxyList['main'],                                              // Proxy URL
                "/?func=",                                                      // function query
                func,                                                           // editor function
                "&text=", encodeURI(document.getElementById('content').value)   // query
            ].join('');
            runRequest(url);
        } else {                        // if a bad response code is returned, use the backup proxy
            let url = [
                proxyList['backup'],
                "/?func=", 
                func, 
                "&text=", encodeURI(document.getElementById('content').value)
            ].join('');
            runRequest(url);
        }
    });

    // separated out the main request to allow for response code checking for proxy
    function runRequest(validURL) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", validURL);
        if (func == undefined){
            document.getElementById('output').value = "Function Undefined";
        } else {
            xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                UpdateAnswer(this.response);
            }};
        }
        xhttp.send();
    }
    
}