/// <reference path="Enums.ts" />
///<reference path="Configuration.ts"/>
/// <reference path="ExecutionUnits.ts" />
/// <reference path="DecodeUnit.ts" />
/// <reference path="Display.ts" />
/// <reference path="Assembler.ts" />
///<reference path="RegisterFile.ts"/>
/// <reference path="cpu.ts" />

var _cpu;

$(document).ready(() => {
    _cpu = new CPU();

    $('#executeButton').click(ExecuteButtonClick);
    $('#clearConsoleButton').click(() => Display.clearConsole());
    $("#assemblyInputDiv select").change(exampleSelected);
});

function ExecuteButtonClick() {
    var config = new Configuration();
    if (!config.valid()) return;
   
    _cpu.configure(config);

    updateDisplay(_cpu);


    var input = $('#assemblyInputDiv textarea').text();

    var assembler = new Assembler(input);
    var instructions = assembler.getInstructions();

    var pipeline = new Pipeline(instructions);

    //try {
        pipeline.start();
    //} catch (e) {
        //Display.writeLine(e.message, Enums.Style.Error);
    //}

    updateDisplay(_cpu);
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