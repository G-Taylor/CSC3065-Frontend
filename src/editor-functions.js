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
    disableButtons(false);  // when answer is updated, allow other buttons to be pressed
}

// function that takes a editor function type as an argument, and gets the proxy URL from an external list based on response status
async function EditorFunction(func) {
    let proxyList = PROXYLIST;
    let proxyStatus;
    disableButtons(true); // disable the buttons when a function button is pressed
    // loop through the proxy list and find one that is working
    for(const[key, value] of Object.entries(proxyList)) {
        fetch(value).then(function(response) {
            proxyStatus = response.status;
            if(proxyStatus == 200){         // If the response is OK, pass the main proxy url to runRequest and continue on with the operation
                let url = [
                    value,                                                          // Proxy URL
                    "/?func=",                                                      // function query
                    func,                                                           // editor function
                    "&text=", encodeURI(document.getElementById('content').value)   // query
                ].join('');
                runRequest(url);
            } else {     // if a bad response code is returned, check the next proxy in the list and log a warning to the console
                console.warn("Proxy " + key + " offline with status code " + proxyStatus + ", trying next in list")           
            }
        });
    }

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

// query the database and display all of the saved sentences and their id's
function showSavedSentences() {
    var counter = 0;
    var savedSentences = new Array();

    // get saved sentences and add them to an array
    db.collection("sentences").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            savedSentences[counter] = [doc.id, " => ", doc.data().text];
            console.log(doc.id, " => ", doc.data().text);
            counter++;
        });
        // display the contents of the array in a new text box on the frontend
        document.getElementById('savedSentences').value = ("ID\t\t\t\tSENTENCE\n" + savedSentences.join("\n\n"))
    });
    
}

// save the contents of the 'content' text box to the database
function saveSentence(){
    // Add a new document with a generated id.
    db.collection("sentences").add({
        text: document.getElementById('content').value,
    })
    .then((docRef) => {
        alert("Sentence successfully saved");
        showSavedSentences();
    })
    .catch((error) => {
        alert("Error adding sentence: ", error);
    });
}

// Prompt the user for an ID of a saved sentence, then delete it from the database
function deleteSentence() {
    var sentenceID = prompt("Please enter the ID of the sentence you want to delete");

    db.collection("sentences").doc(sentenceID).delete().then(() => {
        alert("Document successfully deleted!");
        showSavedSentences();
    }).catch((error) => {
        alert("Error removing sentence: ", error);
    });
}

// Clear the text from the 'content' text box, and disable the buttons
function clearText() {
    document.getElementById('content').value = null;
    if(regex.test(document.getElementById('content').value) == false) {
        disableButtons(true);
    } else {
        disableButtons(false);
    }
}

// method to disable all of the buttons in the frontend
// used when text box is empty, or while an XMLHttpRequest is being performed
function disableButtons(flag) {
    $(":button").prop("disabled", flag);
}