/// <reference path="DecodeUnit.ts" />
class ExecutionUnit {

    constructor() {
        this.state = Enums.State.Free;
        this.setUnitType();
    }

    setInstruction(rsEntry: ReservationStationEntry): void {
        this.operands = rsEntry.operands;
        this.operation = rsEntry.robEntry.instruction.name;
        this.destination = rsEntry.robEntry;
        this.result = null;
        this.state = Enums.State.Assigned;
    }

    execute(): void {
        this[this.operation.toLowerCase()]();
        this.state = Enums.State.Executing;
    }

    getResult(): number {
        if (this.delay == 0) {
            var resultToReturn = this.result;
            this.resetExecutionUnit();
            return resultToReturn;
        } else throw this._notCompletedError;
    }

    clockTick(): void {
        if (this.state == Enums.State.Executing) {
            if (this.delay > 0)
                this.delay--;
            if (this.delay == 0)
                this.state = Enums.State.Completed;
        }
    }

    setUnitType(): void { throw "setUnitType function not overridden"; }

    resetExecutionUnit() {
        this.state = Enums.State.Free;
    }


    toString(): string {
        return Enums.ExecutionUnit[this.type] + ' - ' +
            this.operation +
            ', state: ' + Enums.State[this.state] +
            ', delay: ' + this.delay +
            ', operands: ' + this.operands +
            ', result: ' + this.result +
            ', destination: ' + this.destination;
    }

    public state: Enums.State;
    public type: Enums.ExecutionUnit;
    public delay: number;
    public operands: number[];
    public operation: string;
    public result: number;
    public destination: ReOrderBufferEntry;

    public _notCompletedError = Error("Execution Unit has not yet completed execution");
}