class Register {

    constructor(public value: number, public set: boolean) {}

    public toString() {
        return this.value + " -  " + this.set;
    }

}

class CPU {

    public RegisterFile: Register[];
    public Memory: number[];
    public ExecutionUnits: ExecutionUnit[];
    public DecodeUnits: DecodeUnit[];
    public ReservationStation: ReservationStation;
    public Config: Configuration;

    constructor() {}

    private initialiseRegisterFile(): void {
        this.RegisterFile = [];
        this.RegisterFile["r0"] = new Register(null, true);
        this.RegisterFile["r1"] = new Register(null, true);
        this.RegisterFile["r2"] = new Register(null, true);
        this.RegisterFile["r3"] = new Register(null, true);
        this.RegisterFile["r4"] = new Register(null, true);
        this.RegisterFile["r5"] = new Register(null, true);
        this.RegisterFile["r6"] = new Register(null, true);
        this.RegisterFile["r7"] = new Register(null, true);
        this.RegisterFile["r8"] = new Register(null, true);
        this.RegisterFile["r9"] = new Register(null, true);
        this.RegisterFile["r10"] = new Register(null, true);
        this.RegisterFile["r11"] = new Register(null, true);
        this.RegisterFile["r12"] = new Register(null, true);
        this.RegisterFile["r13"] = new Register(null, true);
        this.RegisterFile["pc"] = new Register(0, true);
        this.RegisterFile["st"] = new Register(null, true);
    }


    public configure(configuration: Configuration) {
        this.Config = configuration;
        this.reset();
    }


    public reset(): void {
        this.initialiseRegisterFile();
        this.initialiseMemory();
        this.initialiseReservationStations();
        this.initialiseDecodeUnits();
        this.initialiseExecutionUnits();
    }

    private initialiseMemory(): void {
        this.Memory = [];
        for (var i = 0; i < 16; i++)
            this.Memory[i] = null;
    }

    public incrementProgramCounter(): void {
        this.RegisterFile["pc"].value++;
    }

    public getProgramCounter(): number {
        return this.RegisterFile["pc"].value;
    }

    public setProgramCounter(pc: number): void {
        this.RegisterFile["pc"].value = pc;
    }

    initialiseDecodeUnits() {
        this.DecodeUnits = [];
        for (var i = 0; i < this.Config.getNumDecode(); i++) {
            var dUnit = new DecodeUnit();
            this.DecodeUnits.push(dUnit);
        }
    }

    initialiseExecutionUnits() {
        this.ExecutionUnits = [];
        for (var i = 0; i < this.Config.getNumAlu(); i++) {
            this.ExecutionUnits.push(new ArithmeticUnit());
        }
        for (var j = 0; j < this.Config.getNumLoadStore(); j++) {
            var mUnit = new MemoryUnit();
            mUnit.setMemory(this.Memory);
            this.ExecutionUnits.push(mUnit);
        }
        for (var k = 0; k < this.Config.getNumBranch(); k++) {
            var bUnit = new BranchUnit();
            bUnit.setRegisterFile(this.RegisterFile);
            this.ExecutionUnits.push(bUnit);
        }
    }

    initialiseReservationStations() {
        this.ReservationStation = new ReservationStation(this.Config.getSizeRS());
    }

}