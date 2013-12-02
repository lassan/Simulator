class Pipeline {

    private _cpu: CPU;
    private _instructions: Instructions.InstructionBase[];

    constructor(instructions: Instructions.InstructionBase[]) {
        this._cpu = new CPU();
        this._instructions = instructions;
    }

    public start() : void{
        var nextInstruction: Instructions.InstructionBase;

        while ((nextInstruction = this.fetch()) != null)
            this.execute(nextInstruction);
    }

    private fetch() : Instructions.InstructionBase{
        var pc = this._cpu.RegisterFile["pc"];
        return pc >= this._instructions.length
            ? null
            : this._instructions[pc];
    }

    private decode(): void { }

    private execute(instruction: Instructions.InstructionBase): void {
        SimulatorConsole.writeLine(Instructions.Type[instruction.type], SimulatorConsole.PrintType.Normal);
    }

    private writeback(): void { }
}