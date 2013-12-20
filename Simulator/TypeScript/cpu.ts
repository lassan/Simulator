class CPU {

    public RegisterFile: RegisterFile;
    public ReOrderBuffer: ReOrderBuffer;
    public Memory: number[];
    public ExecutionUnits: ExecutionUnit[];
    public DecodeUnits: DecodeUnit[];
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

    initialiseReOrderBuffer(): void {
        this.ReOrderBuffer = new ReOrderBuffer();
    }

    initialiseRegisterFile(): void {
        this.RegisterFile = new RegisterFile();
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
            bUnit.setRegisterFile(this.RegisterFile);
            this.ExecutionUnits.push(bUnit);
        }
    }

    initialiseReservationStations() {
        this.ReservationStation = new ReservationStation(this.Config.getSizeRS());
    }

}