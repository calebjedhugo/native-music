function NativeInstrument(type) {
    this.type = type;
}

gainNodes = {};
sourceNodes = {};
soundingNodes = {};

NativeInstrument.prototype.play = function (note, dynamic, length, decayRate) {
    clearTimeout(this.stopCall);
    this.newSource = soundscape.createOscillator();
    this.newSource.type = this.type;
    this.newSource.gain = soundscape.createGain();
    this.newSource.frequency.value = noteConvert.convert(note, true);
    this.newSource.gain.value = dynamics[dynamic];
    this.newSource.connect(this.newSource.gain);
    this.newSource.gain.connect(soundscape.destination);
    //make an error handler so that we know that a note doesn't exist
    var self = this;
    if (dynamic) {
        this.newSource.gain.value = dynamics[dynamic];
    } else if (soundscape[this.type + "gain"].gain.value == 0) {
        this.newSource.gain.value = dynamics["mf"];
    }
    //make an error handler so that we know when a dynamic is incorrect.
    if (typeof length != "object") {
        this.stopCall = setTimeout(function () {
            smoothStop(self.newSource, self.newSource.gain);
            self.playing = false;
        }, length * 1000 + 10);
    } else {
        soundingNodes[length.keyCode] = self.newSource;
    }
    this.newSource.start();
    this.playing = true;
    if (typeof decayRate == "number")
        decay(this.newSource, this.newSource.gain, decayRate);
};

window.addEventListener("keyup", function (event) {
    if (soundingNodes[event.keyCode])
        smoothStop(
            soundingNodes[event.keyCode],
            soundingNodes[event.keyCode].gain
        );
});

function smoothStop(sourceNode, gainNode) {
    var stopping = setInterval(function () {
        gainNode.gain.value -= 0.05;
        if (gainNode.gain.value <= 0) {
            clearInterval(stopping);
            //sourceNode.delete;
        }
    }, 1);
}

function decay(sourceNode, gainNode, rate) {
    var decayStopping = setInterval(function () {
        gainNode.gain.value -= 0.01;
        if (gainNode.gain.value <= 0) {
            clearInterval(decayStopping);
            sourceNode.stop();
        }
    }, rate);
}

NativeInstrument.prototype.changeDynamic = function (dynamic, length) {
    var self = this;
    var difference = dynamics[dynamic] - this.vca.gain.value;
    var changing = setInterval(function () {
        self.vca.gain.value += difference / (length * 100);
    }, 10);
    setTimeout(function () {
        clearInterval(changing);
    }, length * 1000);
};

NativeInstrument.prototype.articulate = function (sourceNode, strength) {
    var oldGain = sourceNode.gain.value;
    sourceNode.gain.value = 0;
    if (strength) {
        setTimeout(function () {
            self.vca.gain.value = strength;
        }, 50);
        setTimeout(function () {
            self.vca.gain.value = oldGain;
        }, 100);
    } else
        setTimeout(function () {
            self.vca.gain.value = oldGain;
        }, 50);
};
