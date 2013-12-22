class BranchUnit extends ExecutionUnit {

    /// <summary>
    ///     For all instructions, operands[0] is the address to which the program should branch to if the branch is to be taken
    ///     operands[1] is the contents of the "st" register
    ///     If the branch is not to be taken, this.result is set to -1
    /// </summary>
    setUnitType(): void {
        this.type = Enums.ExecutionUnit.BranchUnit;
    }

    b(): void {
        this.delay = 3;
        this.result = this.operands[0];
    }

    beq(): void {
        this.delay = 3;
        if (this.operands[1] == 0)
            this.result = this.operands[0];
        else
            this.result = -1;
    }

    bne(): void {
        this.delay = 3;
        if (this.operands[1] != 0)
            this.result = this.operands[0];
        else
            this.result = -1;
    }

    bgt(): void {
        this.delay = 3;
        if (this.operands[1] > 0)
            this.result = this.operands[0];
        else
            this.result = -1;
    }

    blt(): void {
        this.delay = 3;
        if (this.operands[1] < 0)
            this.result = this.operands[0];
        else
            this.result = -1;
    }

    bge(): void {
        this.delay = 3;
        if (this.operands[1] >= 0)
            this.result = this.operands[0];
        else this.result = -1;

    }

    ble(): void {
        this.delay = 3;
        if (this.operands[1] <= 0)
            this.result = this.operands[0];
        else this.result = -1;
    }

}