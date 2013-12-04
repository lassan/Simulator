class Pipeline {
    private _cpu : CPU;
    private _instructions : Instructions.InstructionBase[];
    private _executionUnits : ExecutionUnit[];
    
    constructor(instructions: Instructions.InstructionBase[], executionUnits: ExecutionUnit[]) {
        this._cpu = new CPU();
        this._instructions = instructions;
        this._executionUnits = executionUnits;
    }

    public start() : void{
        var nextInstruction : Instructions.InstructionBase;

        while ((nextInstruction = this.fetch()) != null) {
            this.execute(nextInstruction);
            this._cpu.incrementProgramCounter();
        }
    }

    private fetch(): Instructions.InstructionBase {
        var pc = this._cpu.getProgramCounter();
        return pc >= this._instructions.length
            ? null
            : this._instructions[pc];
    }

    private decode(): void {
    }

    private execute(instruction: Instructions.InstructionBase): void {
        SimulatorConsole.writeLine(Instructions.Type[instruction.type], SimulatorConsole.PrintType.Instrumentation);
    }

    private writeback(): void {
    }
    }