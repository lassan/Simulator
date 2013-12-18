/// <reference path="cpu.ts" />
/// <reference path="Display.ts" />
/// <reference path="Enums.ts" />

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
        
        while (true) {
            this.cycle(instructions);

            if (this.isPipelineEmpty(instructions)) break;

            pipelineCounter++;

            Display.writeLine("Cycle # " + pipelineCounter, Enums.Style.Instrumentation);

            Display.printArray(instructions, "Instructions");
        }

        Display.writeLine("Execution terminated.");
        Display.writeLine("No. of pipeline cycles: " + pipelineCounter, Enums.Style.Instrumentation);
        Display.writeLine("Instructions fetched:  " + instructionCounter, Enums.Style.Instrumentation);
    }

    private cycle(instructions: Instructions.Instruction[]): void {
        /// <summary>
        ///     This method models one pipeline cycle
        /// </summary>
        this.sendClockTick(this._executionUnits);

        if (!this._decodeUnits[0].isFree()) {
            // delay for when there isn't a free unit
            instructions[3] = instructions[2];
            instructions[2] = instructions[1];
            instructions[1] = instructions[0];
            instructions[0] = null;
        }

        this.writeback();

        this.sendClockTick(this._executionUnits);
        this.execute();

        this.sendClockTick(this._executionUnits);
        this._decodeUnits[0].issue();
        this._decodeUnits[0].decode(instructions[1]);

        this.sendClockTick(this._executionUnits);
        if (!this._decodeUnits[0].isFree()) {
            instructions[0] = this.fetch();
        }
    }

    private isPipelineEmpty(instructions: Instructions.Instruction[]): boolean{
        var instructionsPresent = instructions.some((elem) => elem != null);
        var executionsPresent = this._executionUnits.some((elem) => elem.state != Enums.State.Free);

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

    private execute(): void {
        this._executionUnits.forEach((unit) => {
            if (unit.state == Enums.State.Assigned)
                unit.execute();
        });
    }

    private writeback(): void {

        this._executionUnits.forEach((unit) => {
            if (unit == null) return;

            var destination = unit.destination;

            if (unit.state == Enums.State.Completed) {
                var result = unit.getResult();

                /// in the case of store instruction, there is no result
                /// but we still want to call getResult to reset its state
                if (result == null)
                    return;

                this._cpu.RegisterFile[destination].value = result;
                this._cpu.RegisterFile[destination].set = true;

                //Display.writeLine(this._cpu.RegisterFile[destination]);

            } else if (unit.state == Enums.State.Executing) {

                Display.writeLine("Result not ready yet. Still executing.", Enums.Style.Error);
            }
        });
    }
    }