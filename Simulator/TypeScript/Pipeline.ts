/// <reference path="cpu.ts" />
/// <reference path="Display.ts" />
/// <reference path="Enums.ts" />
class Pipeline {
    private _instructions: Instructions.Instruction[];

    constructor(instructions: Instructions.Instruction[]) {
        this._instructions = instructions;
    }

    public start(): void {
        var pipelineCounter = 0;
        var instructionCounter = 0;

        var instructions: Instructions.Instruction[][] = [null, null, null, null];

        //var instructions : Instructions.Instruction[] = [null, null, null, null];

        while (true) {
            Display.writeLine("Cycle # " + pipelineCounter, Enums.Style.Instrumentation);

            this.cycle(instructions);

            if (this.isPipelineEmpty(instructions)) break;

            pipelineCounter++;
        }

        Display.writeLine("Execution terminated.");
        Display.writeLine("No. of pipeline cycles: " + pipelineCounter, Enums.Style.Instrumentation);
        Display.writeLine("Instructions fetched:  " + instructionCounter, Enums.Style.Instrumentation);
    }

    private cycle(instructions: Instructions.Instruction[][]): void {
        /// <summary>
        ///     This method models one pipeline cycle
        /// </summary>
        this.sendClockTick(_cpu.ExecutionUnits);

        Display.updateRegisterTable(_cpu.RegisterFile);
        
        if (!_cpu.ReservationStation.isFull()) {
            // delay for when there isn't a free unit
            instructions[3] = instructions[2];
            instructions[2] = instructions[1];
            instructions[1] = instructions[0];
            instructions[0] = null;
        } else {
            Display.writeLine("Reservation station full.", Enums.Style.Error);
        }

        this.writeback();

        this.execute();

        _cpu.ReservationStation.dispatch();

        this.decode(instructions[1]);

        if (!_cpu.ReservationStation.isFull()) {
            instructions[0] = this.fetch();
        }
    }

    private isPipelineEmpty(instructions: Instructions.Instruction[][]): boolean {
        var instructionsPresent = instructions.some((elem)=> elem != null);
        var executionsPresent = _cpu.ExecutionUnits.some((elem)=> elem.state != Enums.State.Free);

        return !(instructionsPresent || executionsPresent);
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
        if (instructions.length < 1)
            return null;
        else 
            return instructions;
    }

    private decode(instructions: Instructions.Instruction[]): void {
        if (instructions == null)
            return;

        instructions.forEach((elem, index) => {
            _cpu.DecodeUnits[index].decode(elem);
        });
    }

    private execute(): void {
        _cpu.ExecutionUnits.forEach((unit)=> {
            if (unit.state == Enums.State.Assigned)
                unit.execute();
        });
    }

    private writeback(): void {

        _cpu.ExecutionUnits.forEach((unit)=> {
            if (unit == null) return;

            var destination = unit.destination;

            if (unit.state == Enums.State.Completed) {
                var result = unit.getResult();

                /// in the case of store instruction, there is no result
                /// but we still want to call getResult to reset its state
                if (result == null)
                    return;

                _cpu.RegisterFile[destination].value = result;
                _cpu.RegisterFile[destination].set = true;

                //Display.writeLine(this._cpu.RegisterFile[destination]);

            }
        });
    }

}