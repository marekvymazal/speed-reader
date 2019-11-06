// get elements
var go = document.getElementById('go');
var textInput = document.getElementById('input-text');
var textDisplay = document.getElementById('text-display');
var wpm = document.getElementById("wpm");

var ms = 1000;
var i = 0;
var wordArray = [];
var process = null;

var pausePunctuations = [
    ".",
    ",",
    "!",
    "?"
];

function processWord(){
    if (i >= wordArray.length)
    {
        console.log("FINISHED");
        return;
    }

    // show the current word
    textDisplay.innerHTML = wordArray[i];

    // check if word is end of sentence
    let lastChar = wordArray[i].slice(-1);
    let hasPunctuation = pausePunctuations.includes(lastChar);

    let wait = ms;
    if (hasPunctuation) {
        // wait twice as long for end of sentence words
        wait *= 2
    }

    console.log(wait, wordArray[i]);

    i++;

    return setTimeout( function(){
        process = processWord();
    }, wait);
};

// setup go button
go.onclick = function(){

    clearTimeout(process);

    ms = (60 / wpm.value) * 1000;
    console.log(wpm.value);
    console.log("milliseconds per word:", ms);
    console.log("pressed go button");
    console.log(textInput.value);

    wordArray = textInput.value.split(" ");
    i = 0;

    process = processWord();
};
