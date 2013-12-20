class ReservationStationEntry {
    public robEntry: ReOrderBufferEntry;
    public operands: any[] = [];

    public toString() {
        return "[operands: " + this.operands.toString() + ", " + "robEntry: " + this.robEntry.toString() + "]";
    }

    update(operand: any) {
        if ($.isNumeric(operand)) {
            // If the operand is a number, send it to execution units directly
            // This situtation occurs in the case of immediate 
            this.operands.push(operand);
        } else {
            // otherwise check if this register exists in the ROB 
            var entry = _cpu.ReOrderBuffer.tryGetExistingEntry(operand);
            if (entry == null) {
                //The entry doesn't exist in the ROB - i.e. not waiting to be written to

                var regVal = _cpu.RegisterFile[operand].value;
                this.operands.push(regVal);
            } else {
                //The entry does exist in the ROB - i.e. it is waiting to be computed
                //rsEntry.robEntry = entry;
                this.operands.push(entry);
            }
        }
    }

}