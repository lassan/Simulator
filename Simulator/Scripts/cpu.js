//Singleton Cpu class
var Cpu = function() {
    "use strict";
    if (Cpu._instance) {
        return Cpu._instance;
    }

    this.RegisterFile = InitialiseRegisterFile();
    this.MemoryFile = InitialiseMemoryFile();
    
    this.IncrementProgramCounter = function() {
        this.RegisterFile["pc"]++;
    };

    Cpu._instance = this;
};

Cpu.getInstance = function() {
    "use strict";
    return Cpu._instance || new Cpu();
};

function InitialiseRegisterFile() {
    var registerFile = new Object();
    registerFile["r0"] = null;
    registerFile["r1"] = null;
    registerFile["r2"] = null;
    registerFile["r3"] = null;
    registerFile["r4"] = null;
    registerFile["r5"] = null;
    registerFile["r6"] = null;
    registerFile["r7"] = null;
    registerFile["pc"] = 0;
    registerFile["eq"] = null;
    registerFile["gt"] = null;
    return registerFile;
}

function InitialiseMemoryFile() {
    var memoryFile = new Array(16);
    for (var i = 0 ; i < memoryFile.length; i++)
        memoryFile[i] = "";
    return memoryFile;
}