let G = new GlobalManager();

let qno = 0;
let qarray = null;

let trackPtr = 0;

let param = location.search;

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
    G.messageArea.innerHTML = "";
    G.body.style = "background-color: pink";
    for(let e of soundArray) {  // 学習再生中にスタートボタン押された際の追加対処
        document.getElementById(e[0]).style = "background-color: none";
    }
    G.mode.disabled = true;
    G.replay.disabled = false;
    phimon.playPhonemes([["", chimeSound]], restartGame);
    qno = (param != "") ? Number(param.substring(1)) : 1;
    G.level.innerHTML = qno;
//    restartGame();
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
    G.messageArea.innerHTML = "";
    // 学習モード
    if (G.mode.value == "S") {
        panelStatus(false);
        qarray = [studyDic[code][0]];
        qno = qarray.length;
        panelStatus(false);
        phimon.playPhonemes(qarray, callBack);
        return;
    } else if (G.mode.value == "F") {
        panelStatus(false);
        qarray = studyDic[code];
        qno = qarray.length;
        panelStatus(false);
        phimon.playPhonemes(qarray, callBack);
        return;
    } else if ((G.mode.value == "X") && (!G.inTest)) {
        G.inTest = true;
        startGame();
        return;
    }
    // テストモード
    if (qarray[trackPtr][0] != code) {
        displayAnswer();
        let intonationIdx = salvageIntonation(qarray[trackPtr][1]);
        let missed = [["", interactiveDic[code][intonationIdx]], ["", buzzerSound]];
        qarray = [qarray[trackPtr], ["", interactiveDic[code][intonationIdx]]];
        panelStatus(false);
        phimon.playPhonemes(missed, nullCallBack);
        G.body.style = "background-color: #CCCDFF";
        G.mode.value = "S";
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

function displayAnswer() {
    result = [];
    for(a of qarray) {
        result.push(a[0]);
    }
    G.messageArea.innerHTML = "答えは " + result.join("-") + " です。";
    G.inTest = false;
}

function salvageIntonation(path) {
    let m = path.match(/([1-4])\.mp3/);
    return Number(m[1]) - 1;
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
