///<reference path="BranchPredictors.ts"/>
class FetchUnit {
    public BranchPredictor: BranchPredictors.BranchPredictor;

    constructor() {
        this.BranchPredictor = new BranchPredictors[_cpu.Config.branchPredictor()];
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

                var instruction = allInstructions[pc];
                instructions.push(instruction);

                if (instruction.type != Enums.ExecutionUnit.BranchUnit)
                    _cpu.incrementProgramCounter();
                else {
                    var newPc = this.BranchPredictor.predict(instruction, pc);
                    _cpu.setProgramCounter(newPc);
                }
            }
        }

        return instructions;
    }
}