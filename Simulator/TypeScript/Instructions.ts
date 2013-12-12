module Instructions {
    // The base class for all instructions
    export class Instruction {
        public type: Instructions.Type;
        public name: string;
        public operands: string[];
        public numOperands: number; // number of operands the instruction executes on

        constructor() {
        }

        public setOperands(operands: string[]) {
            this.operands = operands;
        }

        public toString(): string {
            return "[" + this.name + "," + this.operands + "]";
        }
    }

    // This enumeration defines the type of instructions possible. 
    // These map on to the types of execution units
    export enum Type {
        BranchUnit, MemoryUnit, ArithmeticUnit
        }

    /***************************************/
    /***** ArithmeticUnit instructions *****/
    /***************************************/

    export class MOV extends Instruction {
        name = "mov";
        numOperands = 2;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class ADD extends Instruction {
        name = "add";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class ADDI extends Instruction {
        name = "addi";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class SUB extends Instruction {
        name = "sub";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class SUBI extends Instruction {
        name = "subi";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class MUL extends Instruction {
        name = "mul";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class CMP extends Instruction {
        name = "cmp";
        numOperands = 2;
        type = Instructions.Type.ArithmeticUnit;
        }

    /***************************************/
    /******* MemoryUnit instructions *******/
    /***************************************/

    export class LDR extends Instruction {
        name = "ldr";
        numOperands = 2;
        type = Instructions.Type.MemoryUnit;
        }

    export class STR extends Instruction {
        name = "str";
        numOperands = 2;
        type = Instructions.Type.MemoryUnit;
        }

    /***************************************/
    /***** BranchUnitUnit instructions *****/
    /***************************************/

    export class B extends Instruction {
        name = "b";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }

    export class BEQ extends Instruction {
        name = "beq";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }

    export class BGT extends Instruction {
        name = "bgt";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }

    export class BLT extends Instruction {
        name = "blt";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }

    export class BNE extends Instruction {
        name = "blt";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }
}