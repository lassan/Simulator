
class ExecutionUnit {
    setInstruction(operands: number[], operation: string): void {
        this.operands = operands;
        this.operation = operation;
    }

    execute(): void { this[this.operation.toLowerCase()](); }

    getResult(): number { return this.result; }

    decrementDelayUntilFree(): void { }

    public isFree: boolean = true;
    public delay: number;
    public operands: number[];
    public operation: string;
    public result: number;
}

class ArithmeticLogicUnit extends ExecutionUnit {
    add(): void {
        this.delay = 1;
        this.result = this.operands[0] + this.operands[1];    
    }

    sub(): void {
        this.delay = 1;
        this.result = this.operands[0] - this.operands[1];
    }

    mul(): void {
        this.delay = 2;
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

class LoadStoreUnit extends ExecutionUnit {
    load(): void {
        this.delay = 4;
    }

    store(): void {
        this.delay = 4;
    }
}