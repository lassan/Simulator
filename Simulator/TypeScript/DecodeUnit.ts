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
            rsEntry = this.decodeBranch(instruction);
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
        if (instruction instanceof Instructions.CMP)
            return this.getRSEntry(instruction, 0, "st");
        else
            return this.getRSEntry(instruction, 1, instruction.operands[0]);
    }

    decodeLoad(instruction): ReservationStationEntry {
        /// <summary>
        ///     Decodes instructions that belong to the load store unit
        /// </summary>
        return this.getRSEntry(instruction, 1, instruction.operands[0]);
    }

    decodeStore(instruction): ReservationStationEntry {
        /// <summary>
        ///     Decodes instructions that belong to the load store unit
        /// </summary>
        return this.getRSEntry(instruction, 0, instruction.operands[0]);
    }

    decodeBranch(instruction): ReservationStationEntry {
        ///<summary>
        ///Decodes instructions that belong to the Branch unit
        ///</summary>
        var operands;
        if (instruction instanceof Instructions.B)
            operands = instruction.operands;
        else
            operands = [instruction.operands[0], "st"]; //branch instructions need "st" as their second operand

        return this.getRSEntry(instruction, 0, "pc", operands);
    }

    getRSEntry(instruction: any, loopStart: number, destination: string, operands? : any[]): ReservationStationEntry {
        /// <summary>
        ///     Creates a reservation station entry for the supplied instruction.
        ///     <param name="loopStart">
        ///         Determines where in the instruction.operands array the operands that are needed for
        ///         execution start
        ///     </param>
        ///     <param name="destination">The destination for this instruction. For use in the writeback stage</param>
        /// </summary>
        var rsEntry = new ReservationStationEntry();

        var ops;
        if (operands != null)
            ops = operands;
        else {
            ops = instruction.operands;
        }

        //var ops = instruction.operands;
        var robEntry = new ReOrderBufferEntry();
        rsEntry.robEntry = robEntry;
        rsEntry.robEntry.instruction = instruction;
        rsEntry.robEntry.destination = destination;

        for (var j = loopStart; j < ops.length; j++) {
            rsEntry.update(ops[j]);
        }

        _cpu.ReOrderBuffer.add((robEntry));

        return rsEntry;
    }
}