let word;
let score = 100000;
let deduction = 1000;
const deltaDeduction = 125;

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

function marking (word, yourGuess, youGotIt) {
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
    } for (let j = 0; j < wordTemp.length; j++) {
        for (let k = 0; k < wordTemp.length; k++) {
            if (wordTemp.charAt(j) === yourGuess.charAt(k)) {
                whites += 1;
                matchPattern += "○";
                wordTemp = wordTemp.substr(0, k) + "_" + wordTemp.substr(k + 1);
            }
        }
    } let c = 0;
    while (blacks + whites + c < word.length) {
        matchPattern += "◘";
        c += 1;
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
            gameBoardHTML += "<h1 style='background-color: white; margin: 8px'>Score:<span id='score'>" + score + "</span></h1>";
            gameBoardHTML += "</div>";

            document.getElementById("gameBoard").innerHTML = gameBoardHTML;
            document.getElementById("guess").addEventListener('keypress', function (e) {

                let youGotIt = false;
                setInterval(function() {
                    score -= 1; document.getElementById("score").innerHTML = score;}, 40);

                if (e.key === 'Enter') {
                    let yourGuess =  e.target.value;

                    if (yourGuess.length !== word.length) {
                        alert("That isn't " + word.length + " letters long!");

                    } else {

                        marking(word, yourGuess, youGotIt);

                        score -= deduction;
                        deduction += deltaDeduction;
                        document.getElementById("score").innerHTML = score;
                    }
                }
            });
        }
    });
}