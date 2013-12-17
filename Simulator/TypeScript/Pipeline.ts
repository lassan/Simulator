/// <reference path="Display.ts" />
///<reference path="Enums.ts"/>

class Pipeline {
    private _cpu : CPU;
    private _instructions : Instructions.Instruction[];
    private _executionUnits : ExecutionUnit[];
    private _decodeUnits : DecodeUnit[];

    constructor(cpu: CPU, instructions: Instructions.Instruction[],
        executionUnits: ExecutionUnit[],
        decodeUnits: DecodeUnit[]) {
        this._cpu = cpu;
        this._instructions = instructions;
        this._executionUnits = executionUnits;
        this._decodeUnits = decodeUnits;
    }

    public start(): void {
        var pipelineCounter = 0;
        var instructionCounter = 0;

        var instructions : Instructions.Instruction[] = [null, null, null, null];
        var executionUnits : ExecutionUnit[] = [null, null, null];

        while (true) {

            this.cycle(instructions, executionUnits);

            if (this.isPipelineEmpty(instructions, executionUnits)) break;

            pipelineCounter++;

            Display.writeLine("Cycle # " + pipelineCounter, Enums.Style.Instrumentation);

            Display.printArray(instructions, "Instructions");
            Display.printArray(executionUnits, "ExecutionUnits");
        }

        Display.writeLine("Execution terminated.");
        Display.writeLine("No. of pipeline cycles: " + pipelineCounter, Enums.Style.Instrumentation);
        Display.writeLine("Instructions fetched:  " + instructionCounter, Enums.Style.Instrumentation);
    }



    private cycle(instructions: Instructions.Instruction[], executionUnits: ExecutionUnit[]): void {
        /// <summary>
        ///     This method models one pipeline cycle
        /// </summary>
        this.sendClockTick(executionUnits);

        if (!this._decodeUnits[0].wait) {
            instructions[3] = instructions[2];
            instructions[2] = instructions[1];
            instructions[1] = instructions[0];
            instructions[0] = null;
        }


        this.writeback(executionUnits[2]);

        if (!this._writeBackWait) {
            executionUnits[2] = executionUnits[1];
            executionUnits[1] = executionUnits[0];
            executionUnits[0] = null;
        }

        //this.sendClockTick(executionUnits);

        this.execute(executionUnits[1]); //instructions[2]

        //this.sendClockTick(executionUnits);

        executionUnits[0] = this._decodeUnits[0].decode(instructions[1]);

        //this.sendClockTick(executionUnits);

        if (!this._decodeUnits[0].wait) {
            instructions[0] = this.fetch();
        }
    }

    private isPipelineEmpty(instructions: Instructions.Instruction[], executionUnits: ExecutionUnit[]): boolean{
        var instructionsPresent = instructions.some((elem) => elem != null);
        var executionsPresent = executionUnits.some((elem) => elem != null);

        return !(instructionsPresent || executionsPresent);
    }


    private sendClockTick(executionUnits: ExecutionUnit[]) {
        executionUnits.forEach((elem) => {
            if (elem != null) elem.clockTick();
        });
    }

    private fetch(): Instructions.Instruction {
        var pc = this._cpu.getProgramCounter();
        var instruction = pc >= this._instructions.length
            ? null
            : this._instructions[pc];

        if (instruction != null && instruction.type != Enums.ExecutionUnit.BranchUnit) {
            // if it's not a branch, incremement the program counter
            // program counter for branches is set in the writeback stage
            this._cpu.incrementProgramCounter();
        }

        return instruction;
    }

    private execute(executionUnit: ExecutionUnit): void {
        if (executionUnit == null)
            return;
        if (executionUnit.state != Enums.State.Executing)
            executionUnit.execute();        
    }

    private _writeBackWait : boolean = false;

    private writeback(executionUnit: ExecutionUnit): void {
        if (executionUnit == null || executionUnit.writeBackRegister == null)
            return;


        var destination = executionUnit.writeBackRegister;
        var result = executionUnit.getResult();
        if (result == null) {
            this._writeBackWait = true;
            Display.writeLine("Result not yet ready", Enums.Style.Error);
        } else {
            this._cpu.RegisterFile[destination] = result;
            Display.write("result: ");
            Display.writeLine(this._cpu.RegisterFile[destination]);
            this._writeBackWait = false;
        }
    }
    }