let word;
let score = 42000;
let deduction = 1000;
const deltaDeduction = 100;

/*-------------------------------------------------------
  A utility function to extract the query string parameters
  and return them as a map of key-value pairs
  ------------------------------------------------------*/
function getQueryStringParameters() {
    let params = [];
    let q = document.URL.split('?')[1];
    if (q !== undefined) {
        q = q.split('&');
        for (let i = 0; i < q.length; i++) {
            let bits = q[i].split('=');
            params[bits[0]] = bits[1];
        }
    }
    return params;
}


function getword() {

    let q = getQueryStringParameters();
    let length = q["difficulty"];

    fetch('/words/random/' + length, {method: 'get'}
    ).then(response => response.json()
    ).then(result => {

        if (result.hasOwnProperty('Error')) {
            alert(result.error);
        } else {

            console.log("Don't tell anyone, but the random word is " + result.word);

            word = result.word;

            let gameBoardHTML = "";

            gameBoardHTML += "<div style='width:calc(20% - 32px); display: inline-block; margin: 32px;'>";
            gameBoardHTML += "<input type='text' id='guess' />";
            gameBoardHTML += "</div>";

            gameBoardHTML += "<div style='width:calc(20% - 32px); display: inline-block; margin: 32px; background-color: #FFFFFF66'>";
            gameBoardHTML += "<h1>Your guesses:</h1><div id='pastGuesses'></div>";
            gameBoardHTML += "</div>";

            gameBoardHTML += "<div style='width:calc(20% - 32px); display: inline-block; margin: 32px; background-color: #FFFFFF66'>";
            gameBoardHTML += "<h1>Your matches:</h1><div id='matches'></div>";
            gameBoardHTML += "</div>";

            gameBoardHTML += "<div style='width:calc(20% - 32px); display: inline-block; margin: 32px;'>";
            gameBoardHTML += "<h1 style='background-color: white; margin: 8px'>Score:<span id='score'>" + score + "</span></h1>";
            gameBoardHTML += "</div>";

            document.getElementById("gameBoard").innerHTML = gameBoardHTML;

            document.getElementById("guess").addEventListener('keypress', function (e) {

                if (e.key === 'Enter') {

                    let yourGuess =  e.target.value;

                    if (yourGuess.length != word.length) {

                        alert("That isn't " + word.length + " letters long!");

                    } else {

                        document.getElementById("pastGuesses").innerHTML += "<h2 style='color: white '>" + yourGuess + "</h2>";
                        document.getElementById("guess").value = "";

                        let matchPattern = "";

                        let youGotIt = true;

                        for (let i = 0; i < word.length; i++) {
                            if (word.charAt(i) == yourGuess.charAt(i)) {
                                matchPattern += "●";
                            } else {
                                matchPattern += "○";
                                youGotIt = false;
                            }
                        }

                        document.getElementById("matches").innerHTML += "<h2 style='color: white '>" + matchPattern + "</h2>";

                        if (!youGotIt) {
                            score -= deduction;
                            deduction += deltaDeduction;
                            document.getElementById("score").innerHTML = score;
                        } else {
                            alert("You got it!");
                        }

                    }

                }

            });

        }

    });




}