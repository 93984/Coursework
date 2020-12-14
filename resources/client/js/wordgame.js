let word;
let scoreTotal = 100000;
let guessDecrement = 1000;
const extraGuessDecrement = 125;
let attempts = 0;
const maxAttempts = 16;
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

/*
function lowercase (word) {
    StringBuilder lower = new StringBuilder();   // creates a string variable that is able to add other characters to the end of the string
    for (let i = 0; i < word.length; i += 1) {   // repeats for each character in the word
        let asc = (int) word.charAt(i);          // finds the ascii value of the character
        if (asc >= 65 && asc <= 90) {            // if the character is a capital letter
            asc += 32;                           // converts to lowercase
        } else if (asc < 97 || asc > 122) {      // any other illegal character
            alert("Invalid character);           // the error return
        } let c = (char) asc;                    // converts the ascii value back into its character
        lower.append(c);                         // adds this value to the end of the appendable string
    } return lower.toString();
}

function numberBlacks (lowercase(word), lowercase(guess), youGotIt) {
    document.getElementById("pastGuesses").innerHTML = "<h2 style='color: white '>" + guess + "</h2>" + document.getElementById("pastGuesses").innerHTML;
    document.getElementById("guess").value = "";
    let wordTemp = word;
    let blacks = 0;
    let matchPattern = "";
    for (let i = 0; i < wordTemp.length; i++) { //repeats for each character in the word
        if (wordTemp.charAt(i) === guess.charAt(i)) { //guess is correct AND in the correct position
            blacks += 1;
            matchPattern += "●";
            wordTemp = wordTemp.substr(0, i) + "_" + wordTemp.substr(i + 1);
            if (blacks === word.length) {
                youGotIt = true;
                alert("You got it! The secret word was " + word);
            }
        }
    }
    numberWhites(wordTemp, guess, matchPattern);
}

function numberWhites(wordTemp, guess, matchPattern, blacks) {
    let whites = 0;
    for (let j = 0; j < wordTemp.length; j++) {
        for (let k = 0; k < wordTemp.length; k++) {
            if (wordTemp.charAt(j) === guess.charAt(k)) {
                whites += 1;
                matchPattern += "○";
                wordTemp = wordTemp.substr(0, k) + "_" + wordTemp.substr(k + 1);
            }
        }
    }
    rest(wordTemp, matchPattern);
}

function rest(wordTemp, matchPattern) {
    while (wordTemp.length !== 0) {
        matchPattern += "◘";
    }
    document.getElementById("matches").innerHTML = "<h2 style='color: white '>" + matchPattern + "</h2>" + document.getElementById("matches").innerHTML;
}
*/


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
            if (blacks === word.length) {
                youGotIt = true;
                alert("You got it! The secret word was " + word);
            }
        }
    }
    if (attempts === maxAttempts && youGotIt === false) {
        alert("You have ran out of attempts");
    }
    for (let j = 0; j < wordTemp.length; j++) {
        for (let k = 0; k < wordTemp.length; k++) {
            if (wordTemp.charAt(j) === yourGuess.charAt(k)) {
                whites += 1;
                matchPattern += "○";
                wordTemp = wordTemp.substr(0, k) + "_" + wordTemp.substr(k + 1);
            }
        }
    }
    while (matchPattern.length < word.length) {
        matchPattern += "◘";
    }
    document.getElementById("matches").innerHTML = "<h2 style='color: white '>" + matchPattern + "</h2>" + document.getElementById("matches").innerHTML;
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
            console.log("Don't tell anyone, but the random word is " + result.word);
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
            gameBoardHTML += "<h1 style='background-color: white; margin: 8px'>scoreTotal:<span id='scoreTotal'>" + scoreTotal + "</span></h1>";
            gameBoardHTML += "</div>";

            document.getElementById("gameBoard").innerHTML = gameBoardHTML;
            document.getElementById("guess").addEventListener('keypress', function (e) {

                setInterval(function() {
                    scoreTotal -= 1; document.getElementById("scoreTotal").innerHTML = scoreTotal;}, 40);

                if (e.key === 'Enter') {
                    let yourGuess =  e.target.value;

                    if (yourGuess.length !== word.length) {
                        alert("That isn't " + word.length + " letters long!");

                    } else {
                        attempts += 1;
                        marking(word, yourGuess, youGotIt, attempts, maxAttempts);

                        scoreTotal -= guessDecrement;
                        guessDecrement += extraGuessDecrement;
                        document.getElementById("scoreTotal").innerHTML = scoreTotal;
                    }
                }
            });
        }
    });
}