/// <reference path="cpu.ts" />
/// <reference path="Display.ts" />
/// <reference path="Enums.ts" />
class Pipeline {
    private _instructions: Instructions.Instruction[];
    private _shouldFetch: boolean;
    private _instructionsQueue: Instructions.Instruction[];

    constructor(instructions: Instructions.Instruction[]) {
        /// <summary>
        ///     <param name="instructions">
        ///         All the instructions program should execute. The output of the assembler
        ///     </param>
        /// </summary>
        this._instructions = instructions;
        this._instructionsQueue = [];
        this._shouldFetch = true;
    }


    public start(): void {
        var pipelineCounter = 1;
        var instructionCounter = 0;

        var instructions: Instructions.Instruction[] = [];

        while (true) {
            if (_cpu.Config.shouldOutputState())
                Display.writeLine("Cycle # " + pipelineCounter, Enums.Style.Instrumentation);

            
            this.clockTick();
            this.commit();

            this.clockTick();
            this.writeback();

            this.clockTick();
            this.execute();

            this.clockTick();
            this.dispatch();

            this.clockTick();
            this.decode();
            this.fetch();


            if (_cpu.Config.shouldOutputState())
                Display.writeLine('');

            if (this.canPipelineStop()) break;
            _cpu.Stats.pipline();

            pipelineCounter++;
        }
    }

    private canPipelineStop(): boolean {

        var instructionsPresent = this._instructionsQueue.length > 0;

        var executionsPresent = _cpu.ExecutionUnits.some((elem)=> elem.state != Enums.State.Free);

        return !(instructionsPresent
            || executionsPresent
            || !_cpu.ReservationStation.isEmpty()
            || !_cpu.ReOrderBuffer.isEmpty());
    }

    private clockTick() {
        _cpu.ExecutionUnits.forEach((elem)=> {
            if (elem != null) elem.clockTick();
        });
    }

    private fetch() {
        var instructions: Instructions.Instruction[] = [];
        if (this._shouldFetch) {
            instructions = _cpu.FetchUnit.fetch(this._instructions);
            for (var i in instructions) {
                this._instructionsQueue.push(instructions[i]);
            }
        }
        if (_cpu.Config.shouldOutputState())
            Display.printArray(instructions, "Instructions Fetched");

        _cpu.Stats.fetched(instructions.length);

    }


    private decode(): void {
        var decoded: Instructions.Instruction[] = [];

        this._instructionsQueue.forEach((elem, index)=> {
            if (elem != null) {
                if (!_cpu.ReservationStation.isFull()) {
                    _cpu.DecodeUnits[index].decode(elem);
                    decoded.push(elem);
                    this._shouldFetch = true;
                } else {
                    this._shouldFetch = false;
                }
            }
        });

        if (_cpu.Config.shouldOutputState()) {
            Display.printArray(decoded, "Instructions Decoded");
        }

        //remove decoded items from instruction queue
        for (var j in decoded) {
            this._instructionsQueue.splice($.inArray(decoded[j], this._instructionsQueue), 1);
        }

        _cpu.Stats.decoded(decoded.length);
    }

    private dispatch() {
        var dispatched = _cpu.ReservationStation.dispatch();

        if (!_cpu.ReservationStation.isFull())
            this._shouldFetch = true;

        if (_cpu.Config.shouldOutputState())
            Display.printArray(dispatched, "RS Entries Dispatched");

        _cpu.Stats.dispatched(dispatched.length);
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

        _cpu.Stats.executed(units.length);
    }

    private writeback(): void {
        var units: ExecutionUnit[] = [];


        _cpu.ExecutionUnits.forEach((unit)=> {
            if (unit.state == Enums.State.Completed)
                units.push(unit);
        });

        for (var i in units) {

            var destination = units[i].destination;

            var result = units[i].getResult();
            if (result == null)
                throw Error("Result should never be null.");


            destination.value = result;

            if (units[i].type == Enums.ExecutionUnit.BranchUnit) {
                var willBranch = destination.instruction.willBranch;
                if (result == -1 && willBranch) {
                    // branch not taken but was prediced to be taken
                    _cpu.FetchUnit.BranchPredictor.branchNotTaken(willBranch);
                    this.flush(destination);

                    _cpu.Stats.notBranch();
                    _cpu.Stats.predictionFail();

                } else if (result >= 0 && (willBranch == false)) {
                    //branch taken but was predicted to not be taken
                    _cpu.FetchUnit.BranchPredictor.branchTaken(willBranch);
                    this.flush(destination);

                    _cpu.Stats.branch();
                    _cpu.Stats.predictionFail();

                } else if (result >= 0) {
                    _cpu.FetchUnit.BranchPredictor.branchTaken(willBranch);

                    _cpu.Stats.branch();
                    _cpu.Stats.predictionSuccess();

                } else if (result == -1) {
                    _cpu.FetchUnit.BranchPredictor.branchNotTaken(willBranch);

                    _cpu.Stats.notBranch();
                    _cpu.Stats.predictionSuccess();
                }
            }
        }

        if (_cpu.Config.shouldOutputState())
            Display.printArray(units, "Units Writtenback");

    }

    private commit(): void {
        var committed: ReOrderBufferEntry[] = [];

        var buffer = _cpu.ReOrderBuffer.toArray();


        for (var i in buffer) {
            if ($.isNumeric(buffer[i].value)) {
                //If the reorder buffer contains a numeric value, that means that instruction is compelte and has been written back, so commit the result to the registerFIle
                if (buffer[i].destination == "pc") {
                    //prevent any branch instructions from overwriting the pc as this is handled by the fetch unit and branch prediction, etc
                    committed.push(buffer[i]); //include it in the commited list anyway so that it gets removed from the ReOrderBuffer by the end of this cycle
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

        _cpu.Stats.committed(committed.length);

        for (var j = 0; j < committed.length; j++) {
            _cpu.ReOrderBuffer.removeFirst();
        }
    }

    private flush(entry: ReOrderBufferEntry): void {
        this._instructionsQueue = [];
        _cpu.ReservationStation.flush(entry); //always do this before flushing the Reorder buffer
        _cpu.ReOrderBuffer.flush(entry);
    }

}