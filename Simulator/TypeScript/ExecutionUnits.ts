
class ExecutionUnit {
    constructor() {
        this.setUnitType();
    }

    setInstruction(operands: number[], operation: string, writeBackRegister: string): void {
        this.operands = operands;
        this.operation = operation;
        this.writeBackRegister = writeBackRegister;
        this.result = null;
        this.free = false;
    }

    execute(): void {
        this[this.operation.toLowerCase()]();
        this.executing = true;
    }

    getResult(): number {
        if (this.delay == 0) {
            this.free = true;
            var resultToReturn = this.result;
            this.result = null;
            this.operands = null;
            this.operation = null;
            this.writeBackRegister = null;
            return resultToReturn;
        } else return null;
    }

    clockTick(): void {
        if (this.delay > 0)
            this.delay--;
        if (this.delay == 0)
            this.executing = false;
    }

    setUnitType(): void { throw "setUnitType function not overridden"; }

    toString(): string {
        return Instructions.Type[this.type] + ' - ' +
             this.operation +
            ', free: ' + this.free +
            ', executing: ' + this.executing +
            ', delay: ' + this.delay +
            ', operands: ' + this.operands.toString() +
            ', result: ' + this.result +
            ', writebackRegister: ' + this.writeBackRegister;
    }

    public executing : boolean = false;
    public type : Instructions.Type;
    public free : boolean = true;
    public delay : number;
    public operands : number[];
    public operation : string;
    public result : number;
    public writeBackRegister : string;
    }

class ArithmeticUnit extends ExecutionUnit {
    setUnitType(): void {
        this.type = Instructions.Type.ArithmeticUnit;
    }

    mov(): void {
        this.delay = 2;
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
        this.delay = 1;
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
        this.type = Instructions.Type.MemoryUnit;
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
        this.delay = 1;
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
    private _registerFile : number[];

    setUnitType(): void {
        this.type = Instructions.Type.BranchUnit;
    }

    setRegisterFile(registerFile: number[]): void {
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