///<reference path="Queue.ts"/>
/// <reference path="ExecutionUnits.ts"/>
/// <reference path="Display.ts"/>
/// <reference path="Assembler.ts"/>
/// <reference path="cpu.ts"/>

var _executionUnits: ExecutionUnit[];
var _cpu: CPU;

$(document).ready(function () {

    $('#executeButton').click(ExecuteButtonClick);
    $('#clearConsoleButton').click(() => Display.clearConsole());
    $("#assemblyInputDiv select").change(exampleSelected);
});

function ExecuteButtonClick() {
     _cpu = new CPU();

    var input = $('#assemblyInputDiv textarea').text();

    var assembler = new Assembler(input);
    var instructions = assembler.getInstructions();

    var pipeline = new Pipeline(_cpu, instructions, getExecutionUnits());
    pipeline.start();
}

function getExecutionUnits(): ExecutionUnit[]{

    var numAlu = 1;
    var numLoadStore = 1;
    var numBranch = 1;

    var executionUnits : ExecutionUnit[] = [];

    for (var i = 0; i < numAlu; i++) {
        executionUnits.push(new ArithmeticUnit());
    }
    for (var j = 0; j < numLoadStore; j++) {
        var mUnit = new MemoryUnit();
        mUnit.setMemory(_cpu.Memory);
        executionUnits.push(mUnit);
    }
    for (var k = 0; k < numBranch; k++) {
        var bUnit = new BranchUnit();
        bUnit.setRegisterFile(_cpu.RegisterFile);
        executionUnits.push(bUnit);
    }
    return executionUnits;
}

function exampleSelected(event) {
    /// <summary>
    ///     Event that is fired when an example is selected from the list box.
    ///     This populates the assembly input area with an example from examples.js
    ///     which can then be executed by pressing one of the buttons
    /// </summary>
    var exampleName = event.target.value;
    var textToInsert;
    if (_examples[exampleName] == undefined)
        textToInsert = "There is no corresponding example. Sorry!";
    else
        textToInsert = _examples[exampleName].assembly;

    $('#assemblyInputDiv textarea').text(textToInsert);
}