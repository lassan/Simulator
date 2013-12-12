/// <reference path="Display.ts" />

class Pipeline {
    private _cpu: CPU;
    private _instructions: Instructions.Instruction[];
    private _executionUnits: ExecutionUnit[];
    private _decodeUnits: DecodeUnit[];

    constructor(cpu: CPU, instructions: Instructions.Instruction[],
        executionUnits: ExecutionUnit[],
        decodeUnits: DecodeUnit[]) {
        this._cpu = cpu;
        this._instructions = instructions;
        this._executionUnits = executionUnits;
        this._decodeUnits = decodeUnits;
    }

    public start(): void {
        //var instructions = new Queue<Instructions.Instruction>();
        //var executionUnits = new Queue<ExecutionUnit>();

        var instructions: Instructions.Instruction[] = [null, null, null, null];
        var executionUnits: ExecutionUnit[] = [null, null, null];

        var instruction;
        while ((instruction = this.fetch()) != null) {
            var exUnit = this._decodeUnits[0].decode(instruction);
            this.execute(exUnit);
            this.writeback(exUnit);
        }

        //while (true) {
        //    this.writeback(instructions[3], executionUnits[2]);
        //    this.execute(executionUnits[1]);    //instructions[2]
        //    executionUnits[0] = this.decode(instructions[1]);

        //    instructions[0] = this.fetch();

        //    if (instructions[0] == null)
        //        break;

        //    Display.writeLine(instructions[0].toString());

        //    instructions[3] = instructions[2];
        //    instructions[2] = instructions[1];
        //    instructions[1] = instructions[0];
        //    instructions[0] = null;

        //    executionUnits[2] = executionUnits[1];
        //    executionUnits[1] = executionUnits[0];
        //    executionUnits[0] = null;

        //}

        Display.writeLine("Execution terminated.");
    }

    private fetch(): Instructions.Instruction {
        var pc = this._cpu.getProgramCounter();
        var instruction = pc >= this._instructions.length
            ? null
            : this._instructions[pc];

        if (instruction != null && instruction.type != Instructions.Type.BranchUnit) {
            // if it's not a branch, incremement the program counter
            // program counter for branches is set in the writeback stage
            this._cpu.incrementProgramCounter();
        }

        return instruction;
    }

    private execute(executionUnit: ExecutionUnit): void {
        if (executionUnit == null)
            return;

        executionUnit.execute();
    }

    private writeback(executionUnit: ExecutionUnit): void {
        if (executionUnit == null || executionUnit.writeBackRegister == null)
            return;

        var destination = executionUnit.writeBackRegister;
        this._cpu.RegisterFile[destination] = +executionUnit.result;
        Display.write("result: ");
        Display.writeLine(this._cpu.RegisterFile[destination]);
    }
}

  