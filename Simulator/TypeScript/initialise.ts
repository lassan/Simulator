///<reference path="Queue.ts"/>
/// <reference path="ExecutionUnits.ts"/>
///<reference path="DecodeUnit.ts"/>
/// <reference path="Display.ts"/>
/// <reference path="Assembler.ts"/>
/// <reference path="cpu.ts"/>

var _cpu: CPU;

var _numAlu = 1;
var _numLoadStore = 1;
var _numBranch = 1;
var _numDecode = 1;


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

    var executionUnits = getExecutionUnits();
    var decodeUnits = getDecodeUnits(executionUnits);

    var pipeline = new Pipeline(_cpu, instructions, getExecutionUnits(), decodeUnits);
    pipeline.start();
}

function getExecutionUnits(): ExecutionUnit[]{

    var executionUnits : ExecutionUnit[] = [];

    for (var i = 0; i < _numAlu; i++) {
        executionUnits.push(new ArithmeticUnit());
    }
    for (var j = 0; j < _numLoadStore; j++) {
        var mUnit = new MemoryUnit();
        mUnit.setMemory(_cpu.Memory);
        executionUnits.push(mUnit);
    }
    for (var k = 0; k < _numBranch; k++) {
        var bUnit = new BranchUnit();
        bUnit.setRegisterFile(_cpu.RegisterFile);
        executionUnits.push(bUnit);
    }
    return executionUnits;
}

function getDecodeUnits(executionUnits : ExecutionUnit[]): DecodeUnit[] {
    var decodeUnits: DecodeUnit[] = [];
    for (var i = 0; i < _numDecode; i++) {
        var dUnit = new DecodeUnit(executionUnits, _cpu.RegisterFile);
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