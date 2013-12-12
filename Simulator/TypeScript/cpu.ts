class CPU {
    public RegisterFile: number[];
    public Memory: number[];

    constructor() {
        this.reset();
    }

    private initialiseRegisterFile(): void {
        this.RegisterFile = [];
        this.RegisterFile["r0"] = null;
        this.RegisterFile["r1"] = null;
        this.RegisterFile["r2"] = null;
        this.RegisterFile["r3"] = null;
        this.RegisterFile["r4"] = null;
        this.RegisterFile["r5"] = null;
        this.RegisterFile["r6"] = null;
        this.RegisterFile["r7"] = null;
        this.RegisterFile["r8"] = null;
        this.RegisterFile["r9"] = null;
        this.RegisterFile["r10"] = null;
        this.RegisterFile["r11"] = null;
        this.RegisterFile["r12"] = null;
        this.RegisterFile["r13"] = null;
        this.RegisterFile["pc"] = 0;
        this.RegisterFile["st"] = null;
    }

    public reset(): void {
        this.initialiseRegisterFile();
        this.initialiseMemory();
    }

    private initialiseMemory(): void {
        this.Memory = [];
        for (var i = 0; i < 16; i++)
            this.Memory[i] = null;
    }

    public incrementProgramCounter(): void {
        this.RegisterFile["pc"]++;
    }

    public getProgramCounter() : number {
        return this.RegisterFile["pc"];
    }

    public setProgramCounter(pc: number) :void {
        this.RegisterFile["pc"] = pc;
    }
}