class FetchUnit {

    contructor() {}

    fetch(allInstructions: Instructions.Instruction[]): Instructions.Instruction[] {
        var numInstructions = _cpu.Config.getNumFetch();
        var instructions: Instructions.Instruction[] = [];

        for (var i = 0; i < numInstructions; i++) {
            if (_cpu.getProgramCounter() >= allInstructions.length) {
                break;
            } else {
                {
                    var instruction = allInstructions[_cpu.getProgramCounter()];

                    instructions.push(instruction);

                    if(instruction.type != Enums.ExecutionUnit.BranchUnit)
                        _cpu.incrementProgramCounter();
                    else {
                        _cpu.setProgramCounter(this.predictBranch(instruction));
                    }
                }
            }
        }
        return instructions;
    }

    predictBranch(instruction: Instructions.Instruction): number {
        /// <summary>
        ///     Takes a branch instruction and returns the address of the next instruction that should be fetched
        /// </summary>
        var nextPc: number;


        if (instruction.type != Enums.ExecutionUnit.BranchUnit)
            throw Error("The instruction is not a branch");

        if (instruction instanceof Instructions.B) {
            //Branch will definitely be taken
            nextPc = +instruction.operands[0];
        }

        return nextPc;
    }
}