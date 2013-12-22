class LoadUnit extends ExecutionUnit {

    private _address;

    setUnitType(): void {
        this.type = Enums.ExecutionUnit.LoadUnit;
    }

    ldr(): void {
        /// <summary>
        ///     LDR dst src - memory address in src, contents of memory will be stored in dst
        /// </summary>
        this.delay = 18;
        this._address = this.operands[0];
    }

    getResult(): number {
        if (this.delay == 0) {
            this.resetExecutionUnit();
            return _cpu.Memory[this._address]; // return the data
        } else throw this._notCompletedError;
    }

}
