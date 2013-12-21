class ArithmeticUnit extends ExecutionUnit {

    setUnitType(): void {
        this.type = Enums.ExecutionUnit.ArithmeticUnit;
    }

    mov(): void {
        this.delay = 1;
        this.result = +this.operands[0];
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
        this.delay = 8;
        this.result = +this.operands[0] * +this.operands[1];
    }

    cmp(): void {
        /// <summary>
        ///     Sets the result to 1 if op1 is less than op2, 2 if op1 is greater than op2, or 0 if op1 is equal to op2
        /// </summary>
        this.delay = 4;
        var comparison= +this.operands[0] - +this.operands[1];
        if (comparison == 0)
            this.result = 0;
        else if (comparison > 0)
            this.result = 1;
        else if (comparison < 0)
            this.result = -1;
    }

}