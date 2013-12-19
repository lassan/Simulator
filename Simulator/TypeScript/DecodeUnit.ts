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
        case Enums.ExecutionUnit.LoadUnit:
            rsEntry = this.decodeLoad(instruction);
            break;
        case Enums.ExecutionUnit.StoreUnit:
            rsEntry = this.decodeStore(instruction);
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
        var loopStart = 1;
        return this.getRSEntry(instruction, loopStart);
    }

    decodeLoad(instruction): ReservationStationEntry {
        /// <summary>
        ///     Decodes instructions that belong to the load store unit
        /// </summary>
        return this.getRSEntry(instruction, 1);
    }


    decodeStore(instruction): ReservationStationEntry {
        /// <summary>
        ///     Decodes instructions that belong to the load store unit
        /// </summary>
        return this.getRSEntry(instruction, 0);
    }

    getRSEntry(instruction: any, loopStart: number): ReservationStationEntry {
        var rsEntry = new ReservationStationEntry();
        var ops = instruction.operands;
        var robEntry = new ReOrderBufferEntry();
        rsEntry.robEntry = robEntry;
        rsEntry.robEntry.instruction = instruction;
        rsEntry.robEntry.destination = ops[0];

        for (var j = loopStart; j < ops.length; j++) {
            rsEntry.update(ops[j]);
        }

        _cpu.ReOrderBuffer.add((robEntry));

        return rsEntry;
    }

}

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