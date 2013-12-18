class DecodeUnit {
    private _executionUnits : ExecutionUnit[];
    private _registerFile : Register[];
    private _reservationStation : ReservationStation;

    constructor(executionUnits: ExecutionUnit[], registerFile : Register[], reservationStation: ReservationStation){
        this._executionUnits = executionUnits;
        this._registerFile = registerFile;
        this._reservationStation = reservationStation;

    }

    decode(instruction: Instructions.Instruction) : void {
        if (instruction == null)
            return;

        this._reservationStation.add(instruction);
    }

    issue(): void {
        this._reservationStation.dispatch();
    }

    isFree(): boolean {
        return this._reservationStation.isFull();
    }
    }