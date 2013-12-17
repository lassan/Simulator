/// <reference path="Enums.ts" />
/// <reference path="ExecutionUnits.ts" />
/// <reference path="DecodeUnit.ts" />
/// <reference path="Display.ts" />
/// <reference path="Assembler.ts" />
/// <reference path="cpu.ts" />

$(document).ready(function() {
    $('#executeButton').click(ExecuteButtonClick);
    $('#clearConsoleButton').click(() => Display.clearConsole());
    $("#assemblyInputDiv select").change(exampleSelected);
});

function ExecuteButtonClick() {

    var unitsNum = getUnitNumbers();
    if (unitsNum == null) return;

    var cpu = new CPU();

    var input = $('#assemblyInputDiv textarea').text();

    var assembler = new Assembler(input);
    var instructions = assembler.getInstructions();

    var executionUnits = getExecutionUnits(cpu, unitsNum["alu"], unitsNum["loadstore"], unitsNum["branch"]);
    var decodeUnits = getDecodeUnits(cpu, executionUnits, unitsNum["decode"]);

    var pipeline = new Pipeline(cpu, instructions, executionUnits, decodeUnits);
    pipeline.start();

    Display.updateRegisterTable(cpu);
    Display.updateMemoryTable(cpu);
}

function getUnitNumbers() {
    var unitsNum: number[] = [];

    unitsNum["alu"] = $("input[name=numAlu]").val();
    unitsNum["loadstore"] = $("input[name=numLoaddStore]").val();
    ;
    unitsNum["branch"] = $("input[name=numBranch]").val();
    ;
    unitsNum["decode"] = $("input[name=numDecode]").val();
    ;

    for (var key in unitsNum) {
        if (unitsNum[key] == null || unitsNum[key] < 1) {
            alert("Number of " + key + " invalid.");
            return null;
        }
    }
    return unitsNum;
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

function getDecodeUnits(cpu: CPU, executionUnits : ExecutionUnit[], num :number): DecodeUnit[] {
    var decodeUnits : DecodeUnit[] = [];
    for (var i = 0; i < num; i++) {
        var dUnit = new DecodeUnit(executionUnits, cpu.RegisterFile);
        decodeUnits.push(dUnit);
    }
    return decodeUnits;
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