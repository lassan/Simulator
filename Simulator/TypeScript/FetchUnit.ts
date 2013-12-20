class FetchUnit {
    public LinkStack: number[];
    public BranchHistory: number[]; // 0 = "strongly not taken", 1 = "weakly not taken", 2 = "weakly taken", 3 = "strongly taken"


    constructor() {
        this.LinkStack = [];
        this.BranchHistory = [];
    }

    fetch(allInstructions: Instructions.Instruction[]): Instructions.Instruction[] {
        var numInstructions = _cpu.Config.getNumFetch();
        var instructions: Instructions.Instruction[] = [];

        for (var i = 0; i < numInstructions; i++) {
            var pc = _cpu.getProgramCounter();
            if (pc >= allInstructions.length) {
                //If no instructions are left, stop
                break;
            } else {

                var instruction = allInstructions[_cpu.getProgramCounter()];
                instructions.push(instruction);

                if (instruction.type != Enums.ExecutionUnit.BranchUnit)
                    _cpu.incrementProgramCounter();
                else {

                    this.LinkStack.push(pc);
                    _cpu.setProgramCounter(this.predictBranch(instruction, pc));
                }
            }
        }
        Display.printArray(this.BranchHistory, "BranchHistory");
        return instructions;
    }

    predictBranch(instruction: Instructions.Instruction, pc : number): number {
        /// <summary>
        ///     Takes a branch instruction and returns the address of the next instruction that should be fetched
        /// </summary>
        var nextPc: number;

        if (instruction.type != Enums.ExecutionUnit.BranchUnit)
            throw Error("The instruction is not a branch");

        if (instruction instanceof Instructions.B) {
            //Branch will definitely be taken
            nextPc = +instruction.operands[0];
        } else {
            var key = pc;
            if (this.BranchHistory.hasOwnProperty(key.toString())) {
                
            } else {
                //add to the branch history, initialised as "strongly taken"
                this.BranchHistory[key] = 3;
            }

            if (this.BranchHistory[key] > 1)
            // branch taken
                nextPc = +instruction.operands[0];
            else {
                nextPc = pc + 1;
            }
        }

        return nextPc;
    }

    branchNotTaken() {
        /// <summary>
        ///     if a branch was not taken, the execution must continue from the line after where the branch was
        /// </summary>
        var key = this.LinkStack.pop();
        _cpu.setProgramCounter(key + 1);

        if (this.BranchHistory[key] != 0)
            this.BranchHistory[key]--;
    }

    branchTaken() {
        var key = this.LinkStack.shift();

        if (this.BranchHistory[key] < 3)
            this.BranchHistory[key]++;
    }



}