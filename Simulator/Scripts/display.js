/// <reference path="~/Scripts/cpu.js" />
/// <reference path="~/Libraries/jquery-2.0.3.min.js" />
/// <reference path="~/Scripts/helpers.js" />
/// <reference path="~/Scripts/control.js" />
/// <summary>
///     global variables
/// </summary>
var _instructions;
var _cpu = Cpu.getInstance();

$(document).ready(function () {
    $('#executeButton').click(ExecuteButtonClick);
    $('#executeNextButton').click(ExecuteNextInstructionButtonClick);
    $("#exampleSelectionDiv select").change(OnExampleSelectionChange);

    window.watch(_cpu.RegisterFile,
        ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'pc', 'eq', 'gt'],
        function () {
            UpdateRegisterTable();
        });

    window.watch(_cpu.MemoryFile,
        function () {
            UpdateMemoryTable();
        });
});

function GetInstructions(assembly) {
    /// <summary>
    ///     Calls the assembler and creates instructions
    ///     to be execute when any of the buttons is pressed
    /// </summary>

    var assembler = new Assembler();

    _instructions = new Array();

    if (!isBlank(assembly)
        && !isEmpty(assembly)) {
        _instructions = assembler.GetInstructions(assembly);
    }

    return _instructions;
}

function InitialiseState() {
    var input = $('#assemblyInputDiv textarea').text();
    _instructions = GetInstructions(input);
    InitialiseProgram(_instructions);
}

function ExecuteButtonClick() {
    InitialiseState();
    ExecuteProgram();
}

function OnExampleSelectionChange(event) {
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

function ExecuteNextInstructionButtonClick() {
    /// <summary>
    ///     Executes only the next instruction
    /// </summary>
    if (_instructions == undefined)
        InitialiseState();

    var instruction = FetchNextInstruction();
    if (instruction == null)
        alert("Reached end of execution.");
    else
        ExecuteInstruction(instruction);
}

function UpdateRegisterTable() {
    /// <summary>
    ///     Updates the table with register value on the webpage with the latest values
    /// </summary>
    var $trs = $('#registerTable tbody tr');
    $trs.each(function (i, tr) {
        var th = $(tr).find('th')[0];
        var td = $(tr).find('td')[0];
        var val = Cpu.getInstance().RegisterFile[th.innerText];
        if (val != null)
            $(td).text(val);
    });
}

function UpdateMemoryTable() {
    ///<summary>
    /// Updates the table with the contents of the memory location
    ///</summary>
    var $tbody = $('#memoryTable tbody');
    $tbody.html("");

    var memoryFile = Cpu.getInstance().MemoryFile;
    for (var key in memoryFile) {
        var openTr = "<tr>";
        var closeTr = "</tr>";
        var th = "<th>" + key + "</th>";
        var td = "<td>" + memoryFile[key] + "</td>";

        var tr = openTr + th + td + closeTr;
        $tbody.append(tr);
    }

}