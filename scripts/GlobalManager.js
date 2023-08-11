class GlobalManager {
    constructor() {
        this.body = document.getElementById("body");
        this.novice = document.getElementById("novice");
        this.testStart = document.getElementById("testStart");
        this.replay = document.getElementById("replay");
        this.mode = document.getElementById("mode");
        this.table = document.getElementById("table");
        this.panelEnabled = true;
        this.auxAudio = new Audio();
        this.level = document.getElementById("level");
    }
}
