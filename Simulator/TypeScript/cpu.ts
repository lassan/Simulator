class CPU {

    public RegisterFile: number[];
    public ReOrderBuffer: ReOrderBuffer;
    public Memory: number[];
    public ExecutionUnits: ExecutionUnit[];
    public DecodeUnits: DecodeUnit[];
    public FetchUnit: FetchUnit;
    public ReservationStation: ReservationStation;
    public Config: Configuration;

    constructor() {}

    public configure(configuration: Configuration) {
        this.Config = configuration;
        this.reset();
    }

    public reset(): void {
        this.initialiseRegisterFile();
        this.initialiseReOrderBuffer();
        this.initialiseMemory();
        this.initialiseReservationStation();
        this.initialiseDecodeUnits();
        this.initialiseFetchUnit();
        this.initialiseExecutionUnits();
    }

    private initialiseMemory(): void {
        this.Memory = [];
        for (var i = 0; i < 16; i++)
            this.Memory[i] = null;
    }

    public incrementProgramCounter(): void {
        this.RegisterFile["pc"]++;
    }

    public getProgramCounter(): number {
        return this.RegisterFile["pc"];
    }

    public setProgramCounter(pc: number): void {
        this.RegisterFile["pc"] = pc;
    }

    initialiseReOrderBuffer(): void {
        this.ReOrderBuffer = new ReOrderBuffer();
    }

    initialiseRegisterFile(): void {
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
        this.RegisterFile["r11"] = null;
        this.RegisterFile["r13"] = null;
        this.RegisterFile["pc"] = 0;
        this.RegisterFile["st"] = null;
    }

    initialiseDecodeUnits() {
        this.DecodeUnits = [];
        for (var i = 0; i < this.Config.getNumDecode(); i++) {
            var dUnit = new DecodeUnit();
            this.DecodeUnits.push(dUnit);
        }
    }

    initialiseFetchUnit() { this.FetchUnit = new FetchUnit(); }

    initialiseExecutionUnits() {
        this.ExecutionUnits = [];
        for (var i = 0; i < this.Config.getNumAlu(); i++) {
            this.ExecutionUnits.push(new ArithmeticUnit());
        }
        for (var j = 0; j < this.Config.getNumLoad(); j++) {
            var lUnit = new LoadUnit();
            this.ExecutionUnits.push(lUnit);
        }
        for (var j = 0; j < this.Config.getNumStore(); j++) {
            var sUnit = new StoreUnit();
            this.ExecutionUnits.push(sUnit);
        }
        for (var k = 0; k < this.Config.getNumBranch(); k++) {
            var bUnit = new BranchUnit();
            this.ExecutionUnits.push(bUnit);
        }
    }

    initialiseReservationStation() {
        this.ReservationStation = new ReservationStation(this.Config.getSizeRS());
    }

}