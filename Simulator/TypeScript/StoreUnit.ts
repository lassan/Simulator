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
        this.delay = 24;
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