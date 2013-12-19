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
        if (this.delay > 0)
            this.delay--;
        if (this.delay == 0)
            this.state = Enums.State.Completed;
    }

    setUnitType(): void { throw "setUnitType function not overridden"; }

    resetExecutionUnit() {
        this.state = Enums.State.Free;
        this.delay = null;
        this.result = null;
        this.operands = null;
        this.operation = null;
        this.destination = null;
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

class ArithmeticUnit extends ExecutionUnit {

    setUnitType(): void {
        this.type = Enums.ExecutionUnit.ArithmeticUnit;
    }

    mov(): void {
        this.delay = 1;
        this.result = this.operands[0];
    }

    add(): void {
        this.delay = 1;
        this.result = +this.operands[0] + +this.operands[1];
    }

    addi(): void {
        this.delay = 1;
        this.result = +this.operands[0] + +this.operands[1];
    }

    sub(): void {
        this.delay = 1;
        this.result = +this.operands[0] - +this.operands[1];
    }

    subi(): void {
        this.delay = 1;
        this.result = +this.operands[0] - +this.operands[1];
    }

    mul(): void {
        this.delay = 4;
        this.result = +this.operands[0] * +this.operands[1];
    }

    cmp(): void {
        this.delay = 2;
        var comparison = +this.operands[0] - +this.operands[1];

        if (comparison < 0)
            this.result = 0x00;
        if (comparison <= 0)
            this.result = 0x01;
        if (comparison > 0)
            this.result = 0x02;
        if (comparison >= 0)
            this.result = 0x03;
    }

}

class BranchUnit extends ExecutionUnit {
    private _registerFile: RegisterFile;

    setUnitType(): void {
        this.type = Enums.ExecutionUnit.BranchUnit;
    }

    setRegisterFile(registerFile: RegisterFile): void {
        this._registerFile = registerFile;
    }

    b(): void {
        this.delay = 1;
        this.result = this.operands[0];
    }

    beq(): void {
        this.delay = 1;
    }

    bne(): void {
        this.delay = 1;
    }

    bgt(): void {
        this.delay = 1;
    }

    blt(): void {
        this.delay = 1;
    }

}

class LoadUnit extends ExecutionUnit {

    private _address;

    setUnitType(): void {
        this.type = Enums.ExecutionUnit.LoadUnit;
    }

    ldr(): void {
        /// <summary>
        ///     LDR dst src - memory address in src, contents of memory will be stored in dst
        /// </summary>
        this.delay = 4;
        this._address = this.operands[0];
    }

    getResult(): number {
        if (this.delay == 0) {
            this.resetExecutionUnit();
            return _cpu.Memory[this._address]; // return the data
        } else throw this._notCompletedError;
    }

}

class StoreUnit extends ExecutionUnit {

    setUnitType(): void {
        this.type = Enums.ExecutionUnit.StoreUnit;
    }

    private address: number;
    private data: number;

    str(): void {
        /// <summary>
        ///     STR address data - data to store in src, memory address to store to in dst
        /// </summary>
        this.delay = 4;
        this.data = this.operands[1];

        if (this.data == null)
            throw Error("Store data is null");

        this.address = this.operands[0];
        if (this.address == null)
            throw Error("Store address is null");

        this.result = this.data;
    }

    getResult(): number {
        if (this.delay == 0) {
            _cpu.Memory[this.address] = this.data;
            this.resetExecutionUnit();
            return this.address; //this ensures that the value of the destination doesn't change
        } else throw this._notCompletedError;
    }

}