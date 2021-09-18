var soundscape,
    soundUnlocked = false;

soundscape = createAudioContext(44100);

function createAudioContext(desiredSampleRate) {
    var AudioCtor = window.AudioContext || window.webkitAudioContext;

    desiredSampleRate =
        typeof desiredSampleRate === "number" ? desiredSampleRate : 44100;
    var context = new AudioCtor();

    // Check if hack is necessary. Only occurs in iOS6+ devices
    // and only when you first boot the iPhone, or play a audio/video
    // with a different sample rate
    var buffer = context.createBuffer(1, 1, desiredSampleRate);
    var dummy = context.createBufferSource();
    dummy.buffer = buffer;
    dummy.connect(context.destination);
    dummy.start(0);
    dummy.disconnect();

    context.close(); // dispose old context
    context = new AudioCtor();

    return context;
}

function verifySoundUnlocked() {
    if (soundUnlocked || !soundscape) {
        return;
    }

    var buffer = soundscape.createBuffer(1, 1, 22050);
    var source = soundscape.createBufferSource();
    source.buffer = buffer;
    source.connect(soundscape.destination);
    source.start(0);

    // by checking the play state after some time, we know if we're really unlocked
    setTimeout(function () {
        if (
            source.playbackState === source.PLAYING_STATE ||
            source.playbackState === source.FINISHED_STATE
        ) {
            soundUnlocked = true;
        }
    }, 0);
}
