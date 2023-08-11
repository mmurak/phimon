let G = new GlobalManager();

let qno = 0;
let qarray = null;

let trackPtr = 0;


let studyDic = {};
let interactiveDic = {};
for (let ent of soundArray) {
    let e0 = ent[0];
    if (!(e0 in studyDic)) {
        studyDic[e0] = [];
        interactiveDic[e0] = []
    }
    studyDic[e0].push([e0, ent[1]]);
    interactiveDic[e0].push(ent[1]);
}


// Entry point is here
function startGame() {
    G.body.style = "background-color: pink";
    G.mode.checked = true;
    G.testStart.disabled = true;
    G.replay.disabled = false;
    G.mode.disabled = true;
    qno = 1;
    G.level.innerHTML = qno;
    restartGame();
}

function restartGame() {
    panelStatus(false);
    qarray = pickN(qno, soundArray);
    panelStatus(false);
    phimon.playPhonemes(qarray, callBack);
}

function pickN(n, array) {
    let noa = array.length;
    let newArray = [];
    for (let i = 0; i < n; i++) {
        newArray.push(array[Math.trunc(Math.random() * noa)]);
    }
    return newArray;
}

function callBack() {
    panelStatus(true);
    trackPtr = 0;
    // enable all panel control
}

function nullCallBack() {
    panelStatus(true);
}

function nextStageCallBack() {
    panelStatus(true);
    qno++;
    G.level.innerHTML = qno;
    restartGame();
}

function pushed(code) {
    if (!G.panelEnabled)  return;
    // 学習モード
    if (!G.mode.checked) {
        panelStatus(false);
        qarray = studyDic[code];
        qno = qarray.length;
        panelStatus(false);
        phimon.playPhonemes(qarray, callBack);
        return;
    }
    // テストモード
    if (qarray[trackPtr][0] != code) {
        let missed = [["", interactiveDic[code][0]], ["", buzzerSound]];
        panelStatus(false);
        phimon.playPhonemes(missed, nullCallBack);
        G.body.style = "background-color: #CCCDFF";
        G.mode.checked = false;
        G.testStart.disabled = false;
        G.replay.disabled = true;
        G.mode.disabled = false;
    } else {
        let good = [qarray[trackPtr]];
        trackPtr++;
        if (trackPtr >= qno) {
            good.push(["", chimeSound]);
            panelStatus(false);
            phimon.playPhonemes(good, nextStageCallBack);
        } else {
            panelStatus(false);
            phimon.playPhonemes(good, nullCallBack);
        }
    }
}

function panelStatus(val) {
    G.panelEnabled = val;
    if (val) {
        G.table.style = "background-color: white";
    } else {
        G.table.style = "background-color: lightgrey";
    }
}

function replaySound() {
    panelStatus(false);
    phimon.playPhonemes(qarray, callBack);
}

function buzzer() {
    G.auxAudio.src = buzzerSound;
    G.auxAudio.play();
}

function chime() {
    G.auxAudio.src = chimeSound;
    G.auxAudio.play();
}
