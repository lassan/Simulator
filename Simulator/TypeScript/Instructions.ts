module Instructions {
    // The base class for all instructions
    export class InstructionBase {
        public type: Instructions.Type;
        public name: string;
        public operands: string[];
        public numOperands: number; // number of operands the instruction executes on

        constructor() {
        }

        public setOperands(operands: string[]) {
            this.operands = operands;
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

    export class MOV extends InstructionBase {
        name = "mov";
        numOperands = 2;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class ADD extends InstructionBase {
        name = "add";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class ADDI extends InstructionBase {
        name = "addi";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class SUB extends InstructionBase {
        name = "sub";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class SUBI extends InstructionBase {
        name = "subi";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class MUL extends InstructionBase {
        name = "mul";
        numOperands = 3;
        type = Instructions.Type.ArithmeticUnit;
        }

    export class CMP extends InstructionBase {
        name = "cmp";
        numOperands = 2;
        type = Instructions.Type.ArithmeticUnit;
        }

    /***************************************/
    /******* MemoryUnit instructions *******/
    /***************************************/

    export class LDR extends InstructionBase {
        name = "ldr";
        numOperands = 2;
        type = Instructions.Type.MemoryUnit;
        }

    export class STR extends InstructionBase {
        name = "str";
        numOperands = 2;
        type = Instructions.Type.MemoryUnit;
        }

    /***************************************/
    /***** BranchUnitUnit instructions *****/
    /***************************************/

    export class B extends InstructionBase {
        name = "b";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }

    export class BEQ extends InstructionBase {
        name = "beq";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }

    export class BGT extends InstructionBase {
        name = "bgt";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }

    export class BLT extends InstructionBase {
        name = "blt";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }

    export class BNE extends InstructionBase {
        name = "blt";
        numOperands = 1;
        type = Instructions.Type.BranchUnit;
        }
}