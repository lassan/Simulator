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
            if (_cpu.Config.shouldOutputState())
                Display.writeLine("Cycle # " + pipelineCounter, Enums.Style.Instrumentation);

            this.sendClockTick(_cpu.ExecutionUnits);

            this.commit();
            this.writeback();
            this.execute();
            this.dispatch();
            this.decode(instructions);

            //Fetch stage
            if (!_cpu.ReservationStation.isFull()) {
                instructions = this.fetch();
            }

            if (_cpu.Config.shouldOutputState())
                Display.writeLine('');

            if (this.canPipelineStop(instructions)) break;

            pipelineCounter++;
        }
        Display.writeLine("Stats", Enums.Style.Heading);
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
        var instructions = _cpu.FetchUnit.fetch(this._instructions);

        if (_cpu.Config.shouldOutputState())
            Display.printArray(instructions, "Instructions Fetched");

        window.console.log(instructions);

        return instructions;
    }

    private decode(instructions: Instructions.Instruction[]): void {
        instructions.forEach((elem, index)=> {
            if (elem != null)
                _cpu.DecodeUnits[index].decode(elem);
        });
        if (_cpu.Config.shouldOutputState())
            Display.printArray(instructions, "Instructions Decoded");
    }

    private dispatch() {
        var dispatched = _cpu.ReservationStation.dispatch();

        if (_cpu.Config.shouldOutputState())
            Display.printArray(dispatched, "RS Entries Dispatched");
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

        if (_cpu.Config.shouldOutputState())
            Display.printArray(units, "Units Starting Execute");
    }

    private writeback(): void {
        var units: ExecutionUnit[] = [];

        _cpu.ExecutionUnits.forEach((unit)=> {
            if (unit.state == Enums.State.Completed)
                units.push(unit);
        });

        if (_cpu.Config.shouldOutputState())
            Display.printArray(units, "Units Writtenback");

        for (var i in units) {

            var destination = units[i].destination;

            var result = units[i].getResult();
            if (result == null)
                throw Error("Result should never be null.");

            var writebackRequired = true;
            if (units[i].type == Enums.ExecutionUnit.BranchUnit) {
                if (result == -1) {
                    // branch not taken
                    writebackRequired = false;
                    _cpu.FetchUnit.branchNotTaken();
                    _cpu.ReOrderBuffer.flush(destination);
                } else {
                    writebackRequired = true;
                    _cpu.FetchUnit.branchTaken();

                }
            }
            if (writebackRequired)
                destination.value = result;
        }
    }

    private commit(): void {
        var committed: ReOrderBufferEntry[] = [];

        var buffer = _cpu.ReOrderBuffer.toArray();


        for (var i in buffer) {
            if ($.isNumeric(buffer[i].value)) {
                //If the reorder buffer contains a numeric value, that means that instruction is compelte and has been written back, so commit the result to the registerFIle
                if (buffer[i].destination == "pc") {
                    //prevent any branch instructions from overwriting the pc as this is handled by the fetch unit and branch prediction, etc
                    committed.push(buffer[i]);  //include it in the commited list anyway so that it gets removed from the ReOrderBuffer by the end of this cycle
                } else {
                    committed.push(buffer[i]);
                    _cpu.RegisterFile[buffer[i].destination] = buffer[i].value;
                }
            } else {
                break;
            }
        }

        if (_cpu.Config.shouldOutputState())
            Display.printArray(committed, "ROB Entries Commited");

        for (var j = 0; j < committed.length; j++) {
            _cpu.ReOrderBuffer.removeFirst();
        }

        //for (var j in committed) {
        //    buffer.splice($.inArray(committed[j], buffer), 1);
        //}
    }

}