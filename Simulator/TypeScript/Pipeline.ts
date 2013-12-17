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
            // delay for when there isn't a free unit
            instructions[3] = instructions[2];
            instructions[2] = instructions[1];
            instructions[1] = instructions[0];
            instructions[0] = null;
        }

        this.writeback(executionUnits[2]);

        if (!this._writeBackWait) {
            // delay for instructions that take more than one cycle
            executionUnits[2] = executionUnits[1];
            executionUnits[1] = executionUnits[0];
            executionUnits[0] = null;
        }
        this.execute(executionUnits[1]); //instructions[2]

        executionUnits[0] = this._decodeUnits[0].decode(instructions[1]);

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

    private execute(unit: ExecutionUnit): void {
        if (unit == null)
            return;
        if (unit.state != Enums.State.Executing)
            unit.execute();        
    }

    private _writeBackWait : boolean = false;

    private writeback(unit: ExecutionUnit): void {
        if (unit == null || unit.writeBackRegister == null)
            return;

        var destination = unit.writeBackRegister;

        if (unit.state == Enums.State.Completed) {
            this._cpu.RegisterFile[destination] = unit.getResult();
            Display.writeLine(this._cpu.RegisterFile[destination]);
            this._writeBackWait = false;
        } else if (unit.state == Enums.State.Executing) {
            this._writeBackWait = true;
            Display.writeLine("Result not ready yet. Still executing.", Enums.Style.Error);
        } else
            throw "The Execution is somehow in the writeback stage when it shouldn't be.";
    }
    }