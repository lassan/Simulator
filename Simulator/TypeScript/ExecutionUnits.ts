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
            this.state = Enums.State.Free;
            var resultToReturn = this.result;
            this.delay = null;
            this.result = null;
            this.operands = null;
            this.operation = null;
            this.destination = null;
            return resultToReturn;
        } else throw "Execution Unit has not yet completed execution";
    }

    clockTick(): void {
        if (this.delay > 0)
            this.delay--;
        if (this.delay == 0)
            this.state = Enums.State.Completed;
    }

    setUnitType(): void { throw "setUnitType function not overridden"; }

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
    public type : Enums.ExecutionUnit;
    public delay : number;
    public operands : number[];
    public operation : string;
    public result : number;
    public destination : ReOrderBufferEntry;
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
        this.result = this.operands[0] + this.operands[1];
    }

    addi(): void {
        this.delay = 1;
        this.result = this.operands[0] + this.operands[1];
    }

    sub(): void {
        this.delay = 1;
        this.result = this.operands[0] - this.operands[1];
    }

    subi(): void {
        this.delay = 1;
        this.result = this.operands[0] - this.operands[1];
    }

    mul(): void {
        this.delay = 4;
        this.result = this.operands[0] * this.operands[1];
    }

    cmp(): void {
        this.delay = 2;
        var comparison = this.operands[0] - this.operands[1];

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

class MemoryUnit extends ExecutionUnit {
    private _memory : number[] = null;

    setUnitType(): void {
        this.type = Enums.ExecutionUnit.MemoryUnit;
    }

    setMemory(memory : number[]): void {
        this._memory = memory;
    }

    ldr(): void {
        /// <summary>
        ///     LDR dst src - memory address in src, contents of memory will be stored in dst
        /// </summary>
        this.delay = 4;
        var address = this.operands[1];
        this.result = this._memory[address];
    }

    str(): void {
        /// <summary>
        ///     STR address data - data to store in src, memory address to store to in dst
        /// </summary>
        this.delay = 4;
        var data = this.operands[1];

        if (data == null)
            throw "Store data is null";

        var address = this.operands[0];
        if (address == null)
            throw "Store address is null";


        this._memory[address] = data;
    }
    }

class BranchUnit extends ExecutionUnit {
    private _registerFile : RegisterFile;

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