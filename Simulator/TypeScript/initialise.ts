/// <reference path="Enums.ts" />
/// <reference path="ExecutionUnits.ts" />
/// <reference path="DecodeUnit.ts" />
/// <reference path="Display.ts" />
/// <reference path="Assembler.ts" />
/// <reference path="cpu.ts" />

var _config: any[]; 

$(document).ready(function() {
    $('#executeButton').click(ExecuteButtonClick);
    $('#clearConsoleButton').click(() => Display.clearConsole());
    $("#assemblyInputDiv select").change(exampleSelected);
});

function ExecuteButtonClick() {
    _config = getConfig();
    
    if (_config == null) return;

    var cpu = new CPU();
    updateDisplay(cpu);


    var input = $('#assemblyInputDiv textarea').text();

    var assembler = new Assembler(input);
    var instructions = assembler.getInstructions();

    var executionUnits = getExecutionUnits(cpu, _config["alu"], _config["loadstore"], _config["branch"]);
    var decodeUnits = getDecodeUnits(cpu.RegisterFile, executionUnits, _config["decode"]);

    var pipeline = new Pipeline(cpu, instructions, executionUnits, decodeUnits);
    pipeline.start();

    updateDisplay(cpu);
}

function getConfig() {
    var config: number[] = [];

    config["alu"] = $("input[name=numAlu]").val();
    config["loadstore"] = $("input[name=numLoaddStore]").val();
    config["branch"] = $("input[name=numBranch]").val();
    config["decode"] = $("input[name=numDecode]").val();
    config["sizeRS"] = $("input[name=sizeRS]").val();

    for (var key in config) {
        if (config[key] == null || config[key] < 1) {
            alert(key + " invalid.");
            return null;
        }
    }
    return config;
}

function getExecutionUnits(cpu: CPU, numAlu, numLoadStore, numBranch): ExecutionUnit[]{

    var executionUnits : ExecutionUnit[] = [];

    for (var i = 0; i < numAlu; i++) {
        executionUnits.push(new ArithmeticUnit());
    }
    for (var j = 0; j < numLoadStore; j++) {
        var mUnit = new MemoryUnit();
        mUnit.setMemory(cpu.Memory);
        executionUnits.push(mUnit);
    }
    for (var k = 0; k < numBranch; k++) {
        var bUnit = new BranchUnit();
        bUnit.setRegisterFile(cpu.RegisterFile);
        executionUnits.push(bUnit);
    }
    return executionUnits;
}

function getDecodeUnits(registerFile: Register[], executionUnits : ExecutionUnit[], num :number): DecodeUnit[] {
    var rs = new ReservationStation(_config["numRS"], executionUnits, registerFile);
    var decodeUnits: DecodeUnit[] = [];
    for (var i = 0; i < num; i++) {
        var dUnit = new DecodeUnit(executionUnits, registerFile, rs);
        decodeUnits.push(dUnit);
    }
    return decodeUnits;
}

function updateDisplay(cpu: CPU) {
    Display.clearTables();
    Display.updateRegisterTable(cpu.RegisterFile);
    Display.updateMemoryTable(cpu);
}

function exampleSelected(event) {
    /// <summary>
    ///     Event that is fired when an example is selected from the list box.
    ///     This populates the assembly input area with an example from examples.js
    ///     which can then be executed by pressing one of the buttons
    /// </summary>
    var exampleName = event.target.value;
    var textToInsert;
    if (_examples[exampleName] == null)
        textToInsert = "There is no corresponding example. Sorry!";
    else
        textToInsert = _examples[exampleName].assembly;

    $('#assemblyInputDiv textarea').text(textToInsert);
}