/// <reference path="Enums.ts" />

module Instructions {

// The base class for all instructions
    export class Instruction {
        public type: Enums.ExecutionUnit;
        public name: string;
        public operands: string[];
        public willBranch: boolean; //only used by Branch instructions
        public numOperands: number; // number of operands the instruction executes on

        constructor() {
        }

        setOperands(operands: string[]) {
            this.operands = operands;
        }

        toString(): string {
            return "[" + this.name + "," + this.operands + "]";
        }

    }

    /***************************************/
    /***** ArithmeticUnit instructions *****/
    /***************************************/
    export class MOV extends Instruction {
        name = "mov";
        numOperands = 2;
        type = Enums.ExecutionUnit.ArithmeticUnit;
    }

    export class ADD extends Instruction {
        name = "add";
        numOperands = 3;
        type = Enums.ExecutionUnit.ArithmeticUnit;
    }

    export class ADDI extends Instruction {
        name = "addi";
        numOperands = 3;
        type = Enums.ExecutionUnit.ArithmeticUnit;
    }

    export class SUB extends Instruction {
        name = "sub";
        numOperands = 3;
        type = Enums.ExecutionUnit.ArithmeticUnit;
    }

    export class SUBI extends Instruction {
        name = "subi";
        numOperands = 3;
        type = Enums.ExecutionUnit.ArithmeticUnit;
    }

    export class MUL extends Instruction {
        name = "mul";
        numOperands = 3;
        type = Enums.ExecutionUnit.ArithmeticUnit;
    }

    export class CMP extends Instruction {
        name = "cmp";
        numOperands = 2;
        type = Enums.ExecutionUnit.ArithmeticUnit;
    }

    /***************************************/
    /******* LoadStore instructions *******/
    /***************************************/

    export class LDR extends Instruction {
        name = "ldr";
        numOperands = 2;
        type = Enums.ExecutionUnit.LoadUnit;
    }

    export class STR extends Instruction {
        name = "str";
        numOperands = 2;
        type = Enums.ExecutionUnit.StoreUnit;
    }

    /***************************************/
    /***** BranchUnitUnit instructions *****/
    /***************************************/

    export class B extends Instruction {
        name = "b";
        numOperands = 1;
        type = Enums.ExecutionUnit.BranchUnit;
    }

    export class BEQ extends Instruction {
        name = "beq";
        numOperands = 1;
        type = Enums.ExecutionUnit.BranchUnit;
    }

    export class BGT extends Instruction {
        name = "bgt";
        numOperands = 1;
        type = Enums.ExecutionUnit.BranchUnit;
    }

    export class BLT extends Instruction {
        name = "blt";
        numOperands = 1;
        type = Enums.ExecutionUnit.BranchUnit;
    }

    export class BNE extends Instruction {
        name = "bne";
        numOperands = 1;
        type = Enums.ExecutionUnit.BranchUnit;
    }

    export class BGE extends Instruction {
        name = "bge";
        numOperands = 1;
        type = Enums.ExecutionUnit.BranchUnit;
    }

    export class BLE extends Instruction {
        name = "ble";
        numOperands = 1;
        type = Enums.ExecutionUnit.BranchUnit;
    }

}