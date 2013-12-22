module BranchPredictors {

    export interface BranchPredictor {
        predict(instruction: Instructions.Instruction, currentPc: number): number;
        branchTaken(prediction: boolean);
        branchNotTaken(prediction: boolean);
        LinkStack: number[];
    }

    function isBranchInstruction(instruction: Instructions.Instruction) {
        if (instruction.type != Enums.ExecutionUnit.BranchUnit)
            throw Error("Can not predit a non branch instruction, you numpty");
    }


    class BranchTableEntry {
        constructor(public weight: number, public address: number) {}
    }


    export class Dynamic implements BranchPredictor {

        private BranchTable: BranchTableEntry[];
        LinkStack: number[];

        public WillBranch: boolean;

        constructor() {
            this.BranchTable = [];
            this.LinkStack = [];
        }

        predict(instruction: Instructions.Instruction, currentPc: number): number {
            isBranchInstruction(instruction);
            var nextPc: number;


            var key = currentPc;

            if (!this.BranchTable.hasOwnProperty(currentPc.toString())) {
                //add to the branch history, initialised as "strongly taken"
                this.BranchTable[key] = new BranchTableEntry(3, +instruction.operands[0]);
            }

            this.LinkStack.push(key);

            if (instruction instanceof Instructions.B) {
                nextPc = +instruction.operands[0];
                instruction.willBranch = true;
            } else {
                if (this.BranchTable[key].weight > 1) {
                    //branch should be taken
                    instruction.willBranch = true;
                    nextPc = this.BranchTable[key].address;
                } else {
                    instruction.willBranch = false;
                    nextPc = currentPc + 1;
                }
            }
            return nextPc;
        }

        branchTaken(prediction: boolean) {

            var key = this.LinkStack.shift();

            if (!prediction)
                _cpu.setProgramCounter(this.BranchTable[key].address);

            if (this.BranchTable[key].weight < 3)
                this.BranchTable[key].weight++;
        }

        branchNotTaken(prediction: boolean) {
            var key = this.LinkStack.shift();

            if (prediction)
                _cpu.setProgramCounter(key + 1);

            if (this.BranchTable[key].weight > 0)
                this.BranchTable[key].weight--;
        }

    }

    export class AlwaysTaken implements BranchPredictor {
        /// <summary>
        ///     All branches are always taken
        /// </summary>
        LinkStack: number[];

        constructor() {
            this.LinkStack = [];
        }

        predict(instruction: Instructions.Instruction, currentPc: number): number {
            isBranchInstruction(instruction);

            this.LinkStack.push(currentPc);
            var nextPc: number = +instruction.operands[0];
            instruction.willBranch = true;

            return nextPc;
        }

        branchTaken(prediction: boolean) {
            this.LinkStack.shift();
        }

        branchNotTaken(prediction: boolean) {
            //prediction unsuccessful
            _cpu.setProgramCounter(this.LinkStack.shift() + 1);
        }

    }

    export class Displacement implements BranchPredictor {
        /// <summary>
        ///     Backward branches are always taken. Forward branches are not
        /// </summary>
        LinkStack: number[];
        private _branchTable: number[];

        constructor() {
            this._branchTable = [];

            this.LinkStack = [];
        }

        predict(instruction: Instructions.Instruction, currentPc: number): number {
            isBranchInstruction(instruction);
            var posPc: number = +instruction.operands[0];

            this.LinkStack.push(currentPc);
            this._branchTable[currentPc] = posPc;

            var nextPc: number;

            if (instruction instanceof Instructions.B) {
                nextPc = +instruction.operands[0];
                instruction.willBranch = true;
            } else {

                if (posPc > currentPc) {
                    //forward branch
                    instruction.willBranch = false;
                    nextPc = currentPc + 1;
                } else {
                    instruction.willBranch = true;
                    nextPc = posPc;
                }
            }

            return nextPc;
        }

        branchTaken(prediction: boolean) {
            var pc = this.LinkStack.shift();

            if (!prediction) {
                _cpu.setProgramCounter(this._branchTable[pc]);
            }
        }

        branchNotTaken(prediction: boolean) {
            var pc = this.LinkStack.shift();

            if (prediction)
                _cpu.setProgramCounter(pc + 1);
        }

    }

    export class NeverTaken implements BranchPredictor {
        /// <summary>
        ///     No branches are to ever taken, except for an unconditional branch
        /// </summary>
        LinkStack: number[];

        constructor() {
            this.LinkStack = [];
        }

        predict(instruction: Instructions.Instruction, currentPc: number): number {
            isBranchInstruction(instruction);


            this.LinkStack.push(+instruction.operands[0]);

            var nextPc: number;

            nextPc = currentPc + 1;
            instruction.willBranch = false;

            return nextPc;
        }

        branchTaken(prediction: boolean) {
            //Prediction was unsuccessful
            _cpu.setProgramCounter(this.LinkStack.shift());
        }


        branchNotTaken(prediction: boolean) {
            //Prediction was successfull
            this.LinkStack.shift();
        }

    }

}