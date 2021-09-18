soundBox = document.getElementById("soundBox");
boxtyper = new NativeInstrument("triangle");
soundBox.addEventListener("click", verifySoundUnlocked);
//0,2,4,5,7,9,11
/*var scaleResources = {I: [0,2,4,7],
                      IV: [5,7,9,0,3],
                      iiv: [11,2,5,9],
                      iii: [4,7,11,2],
                      iv: [9,0,4,7,11],
                      ii: [2,5,9,0],
                      V: [7,11,2,5,9]
                     };*/
var scaleResources = {
    majorPentatonic: [0, 2, 4, 7, 9],
    minorPentatonic: [7, 9, 11, 4, 5],
};
var keys = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
var currentKey = keys[Math.floor(Math.random() * keys.length)];
var synthOctave1 = Math.floor(Math.random() * 3 + 3);
var theRandomNumber, degreeString, lastKeyStroke, lastNote, currentNote;
var currentResource = "majorPentatonic";
var keysDown = {};

function degreeSelect() {
    var set = scaleResources[currentResource];
    return set[Math.floor(Math.random() * set.length)];
}

function degreeToSharps(degree) {
    var idx = 0,
        sharps = "";
    while (idx < degree) {
        sharps += "#";
        idx += 1;
    }
    return sharps;
}
function newResource() {
    var oldResource = currentResource;
    currentResource = Object.keys(scaleResources)[
        (Object.keys(scaleResources).indexOf(oldResource) + 1) %
            Object.keys(scaleResources).length
    ];
}

soundBox.addEventListener("keydown", function (event) {
    if (keysDown[event.keyCode] || event.keyCode == 18) {
        event.preventDefault();
        return;
    }
    keysDown[event.keyCode] = true;
    if (event.keyCode != lastKeyStroke || event.keyCode == 0) {
        theRandomNumber = Math.random();
        if (event.keyCode == 16) {
            //shift
            currentKey = keys[Math.abs(keys.indexOf(currentKey) + 1) % 12];
        }
        if (event.keyCode == 17) {
            //control
            currentKey = keys[Math.abs(keys.indexOf(currentKey) - 1) % 12];
        }
        if (event.keyCode == 32)
            //space
            newResource();
        lastKeyStroke = event.keyCode;
        currentNote =
            currentKey +
            degreeToSharps(degreeSelect()) +
            smoothOctave(synthOctave1, 3, 5);
        lastNote = currentNote;
        boxtyper.play(currentNote, "p", event, 8);
    } else {
        boxtyper.play(lastNote, "p", event, 8);
    }
});

window.addEventListener("keyup", function (event) {
    if (keysDown[event.keyCode]) keysDown[event.keyCode] = false;
});

function smoothOctave(indentity, rangeLow, rangeHigh) {
    theRandomNumber = Math.random();
    if (indentity == rangeLow) {
        if (theRandomNumber < 0.5) indentity += 1;
    } else if (indentity == rangeHigh) {
        if (theRandomNumber < 0.5) indentity -= 1;
    } else {
        if (theRandomNumber < 0.33) indentity -= 1;
        if (theRandomNumber >= 0.66) indentity += 1;
    }
    return indentity;
}
