/// <reference path="Enums.ts" />
/// <reference path="Configuration.ts" />
/// <reference path="DecodeUnit.ts" />
/// <reference path="Display.ts" />
/// <reference path="Assembler.ts" />
/// <reference path="cpu.ts" />
var _cpu;

$(document).ready(()=> {
    _cpu = new CPU();

    $('#executeButton').click(ExecuteButtonClick);
    $('#clearConsoleButton').click(()=> Display.clearConsole());
    $("#assemblyInputDiv select").change(exampleSelected);
});

function ExecuteButtonClick() {
    var config = new Configuration();
    if (!config.validate()) return;

    _cpu.configure(config);

    updateDisplay(_cpu);

    var input = $('#assemblyInputDiv textarea').text();

    var assembler = new Assembler(input);
    var instructions = assembler.getInstructions();

    var pipeline = new Pipeline(instructions);

    Display.writeLine("Execution Started.", Enums.Style.Heading);

    //try {
    pipeline.start();
    //} catch (e) {
    //Display.writeLine(e.message, Enums.Style.Error);
    //}

    Display.writeLine("Execution Terminated.", Enums.Style.Heading);

    updateDisplay(_cpu);
}

function updateDisplay(cpu: CPU) {
    Display.clearTables();
    Display.updateRegisterTable(cpu.RegisterFile);
    Display.updateMemoryTable(cpu);
    Display.updateStats();
}

function exampleSelected(event) {
    /// <summary>
    ///     Event that is fired when an example is selected from the list box.
    ///     This populates the assembly input area with an example from examples.js
    ///     which can then be executed by pressing one of the buttons
    /// </summary>
    var exampleName = event.target.value;

    if (exampleName.toLowerCase() == "convolution") {
        $("input[name=speculativeBranchDepth]").val(32);
        $("input[name=numDecode]").val(1);
        $("#branchPrediction").val(1);
    } else if (exampleName.toLowerCase() == "bubble sort") {
        $("input[name=speculativeBranchDepth]").val(1);
        $("#branchPrediction").val(1);
    } else if (exampleName.toLowerCase() == "superscalar") {
        $("input[name=numDecode]").val(16);
        $("input[name=numAlu]").val(16);
    } else {
        $("input[name=speculativeBranchDepth]").val(4);
        $("#branchPrediction").val(3);
    }

    var textToInsert;
    if (_examples[exampleName] == null)
        textToInsert = "There is no corresponding example. Sorry!";
    else
        textToInsert = _examples[exampleName].assembly;

    $('#assemblyInputDiv textarea').text(textToInsert);
}