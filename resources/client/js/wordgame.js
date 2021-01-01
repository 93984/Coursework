let word;
let scoreTotal = 10000;
let guessDecrement = 1000;
const extraGuessDecrement = 125;
let attempts = 0;
const maxAttempts = 16;
let interval = 50;
let youGotIt = false;

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

function lowercase(userInput) {
    let yourGuess = "";

    for (let i = 0; i < userInput.length; i += 1) {
        let asc = userInput.charCodeAt(i);
        if (asc >= 65 && asc <= 90) {            //test for uppercase
            asc += 32;
            ``
        } else if (asc < 97 || asc > 122) {      //test if it is lowercase
            return ("error");
        } yourGuess += String.fromCharCode(asc);
    } return (yourGuess);
}

function marking (word, yourGuess, youGotIt, attempts, maxAttempts) {
    document.getElementById("pastGuesses").innerHTML = "<h2 style='color: white '>" + yourGuess + "</h2>" + document.getElementById("pastGuesses").innerHTML;
    document.getElementById("guess").value = "";
    let blacks = 0;
    let whites = 0;
    let wordTemp = word;
    let matchPattern = "";

    for (let i = 0; i < wordTemp.length; i++) { //repeats for each character in the word
        if (wordTemp.charAt(i) === yourGuess.charAt(i)) { //guess is correct AND in the correct position
            blacks += 1;
            matchPattern += "●";
            wordTemp = wordTemp.substr(0, i) + "_" + wordTemp.substr(i + 1);
            yourGuess = yourGuess.substr(0, i) + "-" + yourGuess.substr(i + 1);
            if (blacks === word.length) {
                youGotIt = true;
                alert("You got it! The secret word was " + word + ". Your final score is " + scoreTotal);
                returnToMenu();
                //add to leaderboard
            }
        }
    } if (attempts === maxAttempts && youGotIt === false) {
        alert("You have ran out of attempts! The secret word was " + word);
        returnToMenu();
    } for (let j = 0; j < wordTemp.length; j++) {
        for (let k = 0; k < wordTemp.length; k++) {
            if (yourGuess.charAt(j) === wordTemp.charAt(k)) {
                whites += 1;
                matchPattern += "○";
                wordTemp = wordTemp.substr(0, k) + "_" + wordTemp.substr(k + 1);
                yourGuess = yourGuess.substr(0, j) + "-" + yourGuess.substr(j + 1);
            }
        }
    }

    while (matchPattern.length < word.length) {
        matchPattern += "◘";
    } document.getElementById("matches").innerHTML = "<h2 style='color: white '>" + matchPattern + "</h2>" + document.getElementById("matches").innerHTML;
}


function returnToMenu() {
    window.location.href="/client/index.html";
}

function getWord() {
    let q = getQueryStringParameters();
    let length = q["difficulty"];
    fetch('/words/random/' + length, {method: 'get'}
    ).then(response => response.json()
    ).then(result => {

        if (result.hasOwnProperty('Error')) {
            alert(result.error);
        } else {
            word = result.word;
            let gameBoardHTML = "";

            gameBoardHTML += "<div style='width:calc(20% - 32px); display: inline-block; margin: 32px;'>";
            gameBoardHTML += "<input type='text' id='guess' />";
            gameBoardHTML += "</div>";

            gameBoardHTML += "<div style='width:calc(20% - 32px); display: inline-block; margin: 32px; color: white; background-color: #00000080'>";
            gameBoardHTML += "<h1>Your guesses:</h1><div id='pastGuesses'></div>";
            gameBoardHTML += "</div>";

            gameBoardHTML += "<div style='width:calc(20% - 32px); display: inline-block; margin: 32px; color: white; background-color: #00000080'>";
            gameBoardHTML += "<h1>Your matches:</h1><div id='matches'></div>";
            gameBoardHTML += "</div>";

            gameBoardHTML += "<div style='width:calc(20% - 32px); display: inline-block; margin: 32px;'>";
            gameBoardHTML += "<h1 style='background-color: white; margin: 8px'>Score: <span id='scoreTotal'>" + scoreTotal + "</span></h1>";
            gameBoardHTML += "</div>";

            setInterval(function() {
                if (scoreTotal <= 0) {
                    alert("You ran out of time! The secret word was " + word);
                    returnToMenu();
                } scoreTotal -= 1; document.getElementById("scoreTotal").innerHTML = scoreTotal;
                }, 1000/interval);


            document.getElementById("gameBoard").innerHTML = gameBoardHTML;
            document.getElementById("guess").addEventListener('keypress', function (e) {

                if (e.key === 'Enter') {
                    let yourGuess =  e.target.value;

                    if (yourGuess.length !== word.length) {
                        alert("That isn't " + word.length + " letters long or you have entered an invalid character!");
                    } else {
                        yourGuess = lowercase(yourGuess);
                        attempts += 1;
                        scoreTotal -= guessDecrement;
                        guessDecrement += extraGuessDecrement;
                        document.getElementById("scoreTotal").innerHTML = scoreTotal;
                        marking(word, yourGuess, youGotIt, attempts, maxAttempts);
                    }
                }
            });
        }
    });
}