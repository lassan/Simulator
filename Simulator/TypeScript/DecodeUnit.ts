class DecodeUnit {

    
    constructor() {}

    decode(instruction: Instructions.Instruction): void {
        if (instruction == null)
            return;

        var rsEntry: ReservationStationEntry;

        switch (instruction.type) {
            case Enums.ExecutionUnit.ArithmeticUnit:
                rsEntry = this.decodeArithmeticInstruction(instruction);
                break;
            case Enums.ExecutionUnit.BranchUnit:
                //rsEntry = this.dispatchBranch(instruction);
                break;
            case Enums.ExecutionUnit.MemoryUnit:
                //rsEntry = this.dispatchLoadStore(instruction);
                break;
            default:
                throw Error("What, are you crazy?");
        }

        _cpu.ReservationStation.add(rsEntry);
    }


    decodeArithmeticInstruction(instruction): ReservationStationEntry {
        /// <summary>
        ///     Decodes instructions that belong to the arithmetic unit
        /// </summary>
        var rsEntry = new ReservationStationEntry();
        var ops = instruction.operands;
        var robEntry = new ReOrderBufferEntry();
        rsEntry.robEntry = robEntry;
        rsEntry.robEntry.instruction = instruction;
        rsEntry.robEntry.destination = ops[0];

        for (var j = 1; j < ops.length; j++) {
            if ($.isNumeric(ops[j])) {
                // If the operand is a number, send it to execution units directly
                // This situtation occurs in the case of immediate 
                rsEntry.operands.push(ops[j]);
            } else {
                // otherwise check if this register exists in the ROB 
                var entry = _cpu.ReOrderBuffer.tryGetExistingEntry(ops[j]);
                if (entry == null) {
                    //The entry doesn't exist in the ROB - i.e. not waiting to be written to
                    
                    var regVal = _cpu.RegisterFile[ops[j]];
                    rsEntry.operands.push(regVal);
                } else {
                    //The entry does exist in the ROB - i.e. it is waiting to be computed
                    //rsEntry.robEntry = entry;
                    rsEntry.operands.push(entry);
                }
            }
        }
        _cpu.ReOrderBuffer.add((robEntry));

        return rsEntry;
    }  
}