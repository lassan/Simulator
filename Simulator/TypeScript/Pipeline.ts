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

        while (true) {
            Display.writeLine("Cycle # " + pipelineCounter, Enums.Style.Instrumentation);

            this.sendClockTick(_cpu.ExecutionUnits);

            this.commit();

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

        return !(instructionsPresent
            || executionsPresent
            || !_cpu.ReservationStation.isEmpty()
            || !_cpu.ReOrderBuffer.isEmpty());
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

        Display.printArray(units, "Units Starting Execute");
    }

    private writeback(): void {
        var units: ExecutionUnit[] = [];

        _cpu.ExecutionUnits.forEach((unit)=> {
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

            destination.value = result;

            //_cpu.RegisterFile[destination].value = result;
            //_cpu.RegisterFile[destination].set = true;

            //Display.writeLine(this._cpu.RegisterFile[destination]);
        }

        //If there are any instructions of the ADD r1 r1 r0 variety where dst and src are the same, 
        //set the value in the re-order buffer to null;


    }

    private commit(): void {
        var committed: ReOrderBufferEntry[] = [];

        var buffer = _cpu.ReOrderBuffer.toArray();


        for (var i in buffer) {
            if ($.isNumeric(buffer[i].value)) {
                //If the reorder buffer contains a numeric value, that means that instruction is compelte
                //and has been written back, so commit the result to the registerFIle
                committed.push(buffer[i]);


                    _cpu.RegisterFile[buffer[i].destination].value = buffer[i].value;
            } else {
                break;
            }
        }

        Display.printArray(committed, "ROB Entries Commited");

        for (var j in committed) {
            buffer.splice($.inArray(committed[j], buffer), 1);
        }
    }

}