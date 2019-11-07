// get elements
var go = document.getElementById('go');
var textInput = document.getElementById('input-text');
var textDisplay = document.getElementById('text-display');
var readTime = document.getElementById('read-time');
var wpm = document.getElementById('wpm');

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

function isWordEndOfSentence( word ){
    let lastChar = word.slice(-1);
    return pausePunctuations.includes(lastChar);
}

function getWordWait( word ){
    let lastChar = word.slice(-1);
    let isEndOfSentence = pausePunctuations.includes(lastChar);
    if (isEndOfSentence) {
        // wait twice as long for end of sentence words
        return ms * 2;
    }
    return ms;
}

function getTotalTime( milliseconds ){

    let rs = "";

    let ms = parseInt((milliseconds % 1000) / 100);
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    let hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    rs += "The following can be read in "

    if ( hours > 0 ){
        rs += " " + hours + " hour";
        if ( hours > 1){ rs += "s"; }
    }

    if ( minutes > 0 ){
        rs += " " + minutes + " minute";
        if ( minutes > 1){ rs += "s"; }
    }

    // only show seconds if there are no hours
    // and minutes is less than 15
    if (hours == 0 && minutes < 15){
        if ( seconds > 0 ){
            rs += " " + seconds + " second";
            if ( seconds > 1){ rs += "s"; }
        }
    }

    // only show milliseconds if less than a second total
    if (milliseconds < 1000){
        rs += " less than a second.";
    }

    return rs;
}

function getWordArray( paragraph )
{
    // remove new lines
    let text = textInput.value.replace(/\r?\n|\r/g, "");

    // remove tabs
    text = text.replace('\t','');

    // split into array and filter empty strings
    return text.split(" ").filter(function(el){
        return el != "";
    });
}

function updated(){
    ms = (60 / wpm.value) * 1000;

    let time = 0;
    let tempArray = getWordArray( textInput.value );
    tempArray.forEach( function( word ){
        time += getWordWait( word );
    });
    if (time <= 0 ){
        readTime.innerHTML = "";
        return;
    }
    //time = time / 1000;
    readTime.innerHTML = getTotalTime( time );
    //readTime.innerHTML = time.toFixed(2) + ' seconds to read';
}

function processWord(){
    if (i >= wordArray.length)
    {
        console.log("FINISHED");
        return;
    }

    // show the current word
    textDisplay.innerHTML = wordArray[i];

    // check if word is end of sentence
    let wait = ms;
    if (isWordEndOfSentence(wordArray[i])) {
        wait *= 2 // wait twice as long for end of sentence words
    }

    console.log(wait, wordArray[i]);

    i++;

    return setTimeout( function(){
        process = processWord();
    }, wait);
};

// setup go button
go.onclick = function(){

    console.log(wpm.value);
    console.log("milliseconds per word:", ms);

    // stop current process
    clearTimeout(process);

    // split into array and filter empty strings
    wordArray = getWordArray(textInput.value);

    // reset word index
    i = 0;

     // start process
    process = processWord();
};

wpm.onchange = updated;
textInput.oninput = updated;

// initialize values
updated();
