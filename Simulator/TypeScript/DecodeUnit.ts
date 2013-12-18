class DecodeUnit {
    private _executionUnits : ExecutionUnit[];
    private _registerFile : Register[];
    public wait : boolean = false;   // whether the pipeline should wait for execution unit to become free
    private _reservationStation: ReservationStation;


    constructor(executionUnits: ExecutionUnit[], registerFile : Register[]){
        this._executionUnits = executionUnits;
        this._registerFile = registerFile;
        this._reservationStation = new ReservationStation(32, executionUnits, registerFile);

    }

    decode(instruction: Instructions.Instruction) : void {
        if (instruction == null)
            return;

        this._reservationStation.add(instruction);       
    }

    issue(): void {
        this._reservationStation.dispatch();
    }
}