///<reference path="ExecutionUnits.ts"/>
///<reference path="SimulatorConsole.ts"/>
///<reference path="Assembler.ts"/>
///<reference path="cpu.ts"/>

var _numALU = 1;
var _numLoadStore = 1;
var _numBranch = 1;

var _executionUnits: ExecutionUnit[];

$(document).ready(function () {
    CreateExecutionUnits();

    $('#executeButton').click(ExecuteButtonClick);
});

function ExecuteButtonClick() {
    var input = $('#assemblyInputDiv textarea').text();

    var assembler = new Assembler(input);
    var instructions = assembler.getInstructions();

    var pipeline = new Pipeline(instructions, _executionUnits);
    pipeline.start();

    //var alu = new ArithmeticLogicUnit();
    //alu.setInstruction([1, 2], "add");
    //alu.execute();
    //var result = alu.getResult();
}

function CreateExecutionUnits() {
    _executionUnits = [];
    _executionUnits.push(new ArithmeticLogicUnit());
}

