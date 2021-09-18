var noteConvert = {
    C: [261.626, 0],
    "C#": [277.18, 1],
    D: [293.66, 2],
    Eb: [311.13, 3],
    E: [329.63, 4],
    F: [349.23, 5],
    "F#": [369.99, 6],
    G: [392.0, 7],
    Ab: [415.3, 8],
    A: [440, 9],
    Bb: [466.16, 10],
    B: [493.88, 11],
    convert: function (note, hzReturn) {
        var originialNote = note.split("");
        note = note.split("");
        var octave = Number(note.pop());
        var idx = 1;
        var sharpsVsFlats = 0;
        while (/#|b/.test(note[idx])) {
            if (note[idx] == "#") {
                note[0] = Object.keys(this)[(this[note[0]][1] + 1) % 12];
                sharpsVsFlats += 1;
            }
            if (note[idx] == "b") {
                note[0] = Object.keys(this)[(this[note[0]][1] + 143) % 12];
                sharpsVsFlats -= 1;
            }
            idx += 1;
        }
        if (this[originialNote[0]][1] + sharpsVsFlats < 0) octave -= 1;
        if (this[originialNote[0]][1] + sharpsVsFlats > 11) octave += 1;
        if (!hzReturn) return note[0] + octave;
        else {
            hz = this[note[0]][0];
            for (var idx2 = 0; idx2 < Math.abs(4 - octave); idx2 += 1) {
                if (octave > 4) hz = hz * 2;
                else hz = hz / 2;
            }
            return hz;
        }
    },
};

var dynamics = {
    fff: 1,
    ff: 0.875,
    f: 0.75,
    mf: 0.625,
    mp: 0.5,
    p: 0.375,
    pp: 0.25,
    ppp: 0.125,
    n: 0,
};
