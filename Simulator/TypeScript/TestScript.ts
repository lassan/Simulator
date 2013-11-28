///<reference path="ArithmeticLogicUnit.ts"/>
///<reference path="SimulatorConsole.ts"/>
///<reference path="cpu.ts"/>

$(document).ready(function () {



    var alu = new ArithmeticLogicUnit();
    alu.setInstruction([1, 2], "add");
    alu.execute();
    var result = alu.getResult();

    SimulatorConsole.write(result.toString(), SimulatorConsole.PrintType.Instrumentation);
});