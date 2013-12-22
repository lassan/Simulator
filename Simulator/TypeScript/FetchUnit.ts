///<reference path="BranchPredictors.ts"/>
class FetchUnit {
    public BranchPredictor: BranchPredictors.BranchPredictor;
    
    constructor() {
        this.BranchPredictor = new BranchPredictors[_cpu.Config.branchPredictor()];
    }

    fetch(allInstructions: Instructions.Instruction[]) : Instructions.Instruction[] {
        var numInstructions = _cpu.Config.getNumFetch();
        var instructions : Instructions.Instruction[] = [];

        for (var i = 0; i < numInstructions; i++) {
            var pc = _cpu.getProgramCounter();
            if (pc >= allInstructions.length) {
                //If no instructions are left, stop
                break;
            } else {

                var instruction = allInstructions[pc];

                if (instruction.type == Enums.ExecutionUnit.BranchUnit) {
                    if (this.BranchPredictor.LinkRegister == null) {
                        //Only ask for a prediction if the processor is not executing speculatively already
                        var newPc = this.BranchPredictor.predict(instruction, pc);
                        _cpu.setProgramCounter(newPc);
                        instructions.push(instruction);

                    }
                } else {
                    _cpu.incrementProgramCounter();
                    instructions.push(instruction);

                }
            }
        }

        return instructions;
    }
}