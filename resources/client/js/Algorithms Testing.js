let blacks = 0;
let whites = 0;
let youGotIt = true;
let yourGuess = "look";
let word = "door";
let characters = new Array(word.length);

for (let i = 0; i < word.length; i++) {
    characters[i] = word.charAt(i);
}

for (let i = 0; i < characters.length; i++) {
    if (characters[i] === yourGuess.charAt(i)) {
        blacks += 1;
        characters[i] = "";
    } else {
        youGotIt = false;
    }

} for (let i = 0; i < characters.length; i++) {
    for (let j = 0; j < characters.length; j++) {
        if (characters[i] === yourGuess.charAt(j)) {
            whites += 1;
            characters[i] = "";
        }
    }
}



setInterval(function() {
    score -= 1;}, 1000/15);
