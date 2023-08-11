(function() {

    window.phimon = window.phimon || {};

    let audio = new Audio();
    audio.onended = nextPhoneme;

    let seqOfPhonemes;
    let currentPointer = 0;
    let callBackFn;

    function colorChanger(pointer) {
        if (G.mode.checked && !G.novice.checked) return;
        if (seqOfPhonemes[pointer][0] != "") {
            document.getElementById(seqOfPhonemes[pointer][0]).style = "background-color: #75FF7C";
        }
    }
    function colorReset() {
        if (G.mode.checked && !G.novice.checked) return;
        if (seqOfPhonemes[currentPointer-1][0] != "") {
            document.getElementById(seqOfPhonemes[currentPointer-1][0]).style = "background-color: none";
        }
    }

    function nextPhoneme() {
        colorReset();
        if (currentPointer >= seqOfPhonemes.length) {
            callBackFn();
            return;
        }
        audio.src = seqOfPhonemes[currentPointer][1];
        colorChanger(currentPointer);
        currentPointer++;
        audio.play();
    };

    window.phimon.playPhonemes = function (array, cbf) {
        seqOfPhonemes = array;
        audio.src = seqOfPhonemes[0][1];
        currentPointer = 1;
        callBackFn = cbf;
        audio.play();
        colorChanger(0);
    };
})();
