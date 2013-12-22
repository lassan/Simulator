module BranchPredictors {

    export interface BranchPredictor {
        predict(instruction: Instructions.Instruction, currentPc: number): number;
        branchTaken(prediction: boolean);
        branchNotTaken(prediction: boolean); //This method should set the program counter to where it would've been 
    }

    function isBranchInstruction(instruction: Instructions.Instruction) {
        if (instruction.type != Enums.ExecutionUnit.BranchUnit)
            throw Error("Can not predit a non branch instruction, you numpty");
    }

    export class Dynamic implements BranchPredictor {

        private BranchTable: number[][];
        private _linkStack: number[];

        public WillBranch: boolean;

        constructor() {
            this.BranchTable = [];
            this._linkStack = [];
        }

        predict(instruction: Instructions.Instruction, currentPc: number): number {
            isBranchInstruction(instruction);
            var nextPc: number;


            var key = currentPc;

            if (!this.BranchTable.hasOwnProperty(currentPc.toString())) {
                //add to the branch history, initialised as "strongly taken"
                this.BranchTable[key] = [3, +instruction.operands[0]];
            }

            this._linkStack.push(key);

            if (instruction instanceof Instructions.B) {
                nextPc = +instruction.operands[0];
                instruction.willBranch = true;
            } else {
                if (this.BranchTable[key][0] > 1) {
                    //branch should be taken
                    instruction.willBranch = true;
                    nextPc = this.BranchTable[key][1];
                } else {
                    instruction.willBranch = false;
                    nextPc = currentPc + 1;
                }
            }
            return nextPc;
        }

        branchTaken(prediction: boolean) {

            var key = this._linkStack.shift();

            if (!prediction)
                _cpu.setProgramCounter(this.BranchTable[key][1]);

            if (this.BranchTable[key][0] < 3)
                this.BranchTable[key][0]++;
        }

        branchNotTaken(prediction: boolean) {
            var key = this._linkStack.shift();

            if (prediction)
                _cpu.setProgramCounter(key + 1);

            if (this.BranchTable[key][0] > 0)
                this.BranchTable[key][0]--;
        }
    }

    export class AlwaysTaken implements BranchPredictor {
        /// <summary>
        ///     All branches are always taken
        /// </summary>
        private _linkStack: number[];

        constructor() {
            this._linkStack = [];
        }

        predict(instruction: Instructions.Instruction, currentPc: number): number {
            isBranchInstruction(instruction);

            this._linkStack.push(currentPc);
            var nextPc: number = +instruction.operands[0];
            instruction.willBranch = true;

            return nextPc;
        }

        branchTaken(prediction: boolean) {
            this._linkStack.shift();
        }

        branchNotTaken(prediction: boolean) {
            //prediction unsuccessful
            _cpu.setProgramCounter(this._linkStack.shift() + 1);
        }

    }

    export class Displacement implements BranchPredictor {
        /// <summary>
        ///     Backward branches are always taken. Forward branches are not
        /// </summary>
        private _linkStack: number[][];

        constructor() {
            this._linkStack = [];
        }

        predict(instruction: Instructions.Instruction, currentPc: number): number {
            isBranchInstruction(instruction);
            var posPc: number = +instruction.operands[0];
            this._linkStack.push([currentPc, posPc]);
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
            var l = this._linkStack.shift();

            if (!prediction) {
                _cpu.setProgramCounter(l[1]);
            }
        }

        branchNotTaken(prediction: boolean) {
            var l = this._linkStack.shift();

            if (prediction)
                _cpu.setProgramCounter(l[0] + 1);
        }

    }

    export class NeverTaken implements BranchPredictor {
        /// <summary>
        ///     No branches are to ever taken, except for an unconditional branch
        /// </summary>
        private _linkStack: number[];

        constructor() {
            this._linkStack = [];
        }

        predict(instruction: Instructions.Instruction, currentPc: number): number {
            isBranchInstruction(instruction);
            this._linkStack.push(+instruction.operands[0]);
            var nextPc: number;
            instruction.willBranch = false;

            if (instruction instanceof Instructions.B) {
                nextPc = +instruction.operands[0];
            } else {
                nextPc = currentPc + 1;
            }

            return nextPc;
        }

        branchTaken(prediction: boolean) {
            //Prediction was unsuccessful
            _cpu.setProgramCounter(this._linkStack.shift());

        }

        branchNotTaken(prediction: boolean) {
            //Prediction was successfull
            this._linkStack.shift();
        }

    }

}