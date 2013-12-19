/// <reference path="cpu.ts" />
/// <reference path="Display.ts" />
/// <reference path="Enums.ts" />
class Pipeline {
    private _instructions: Instructions.Instruction[];

    constructor(instructions: Instructions.Instruction[]) {
        this._instructions = instructions;
    }

    public start(): void {
        var pipelineCounter = 1;
        var instructionCounter = 0;

        var instructions: Instructions.Instruction[] = [];

        //var instructions : Instructions.Instruction[] = [null, null, null, null];

        while (true) {
            Display.writeLine("Cycle # " + pipelineCounter, Enums.Style.Instrumentation);

            this.sendClockTick(_cpu.ExecutionUnits);

            //Writeback stage
            this.writeback();

            //Execute stage
            this.execute();

            _cpu.ReservationStation.dispatch();

            //Decode and issue stage
            this.decode(instructions);

            //Fetch stage
            if (!_cpu.ReservationStation.isFull()) {
                instructions = this.fetch();
            }

            Display.writeLine('');

            if (this.canPipelineStop(instructions)) break;

            pipelineCounter++;
        }

        Display.writeLine("Execution terminated.");
        Display.writeLine("No. of pipeline cycles: " + pipelineCounter, Enums.Style.Instrumentation);
        Display.writeLine("Instructions fetched:  " + instructionCounter, Enums.Style.Instrumentation);
    }
    
    private canPipelineStop(instructions: Instructions.Instruction[]): boolean {

        var instructionsPresent = instructions.some((elem)=> elem != null);

        var executionsPresent = _cpu.ExecutionUnits.some((elem)=> elem.state != Enums.State.Free);

        return !(instructionsPresent || executionsPresent || !_cpu.ReservationStation.isEmpty());
    }

    private sendClockTick(executionUnits: ExecutionUnit[]) {
        executionUnits.forEach((elem)=> {
            if (elem != null) elem.clockTick();
        });
    }

    private fetch(): Instructions.Instruction[] {
        var numInstructions = _cpu.Config.getNumFetch();
        var instructions: Instructions.Instruction[] = [];

        for (var i = 0; i < numInstructions; i++) {
            if (_cpu.getProgramCounter() >= this._instructions.length) {
                break;
            } else {
                {
                    instructions.push(this._instructions[_cpu.getProgramCounter()]);
                    _cpu.incrementProgramCounter();
                }
            }
        }
        Display.printArray(instructions, "Instructions Fetched");
        return instructions;
    }

    private decode(instructions: Instructions.Instruction[]): void {
        instructions.forEach((elem, index)=> {
            if (elem != null)
                _cpu.DecodeUnits[index].decode(elem);
        });
        Display.printArray(instructions, "Instructions Decoded");
    }

    private execute(): void {
        var units: ExecutionUnit[] = [];

        _cpu.ExecutionUnits.forEach((unit)=> {
            if (unit.state == Enums.State.Assigned)
            //unit.execute();
                units.push(unit);
        });

        for (var i in units) {
            units[i].execute();
        }

        Display.printArray(units, "Units Executed");
    }

    private writeback(): void {
        var units: ExecutionUnit[] = [];

        _cpu.ExecutionUnits.forEach((unit)=> {
            if (unit == null) return;

            if (unit.state == Enums.State.Completed)
                units.push(unit);
        });

        Display.printArray(units, "Units Writtenback");

        for (var i in units) {
            var destination = units[i].destination;

            var result = units[i].getResult();
            /// in the case of store instruction, there is no result
            /// but we still want to call getResult to reset its state
            if (result == null)
                return;

            _cpu.RegisterFile[destination].value = result;
            _cpu.RegisterFile[destination].set = true;

            //Display.writeLine(this._cpu.RegisterFile[destination]);
        }
    }

}