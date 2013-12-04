module Instructions {
    // The base class for all instructions
    export class InstructionBase {
        public type : Instructions.Type;
        constructor(public operands: string[]) {
        }
        }

    // This enumeration defines the type of branches possible. 
    // These map on to the types of execution units
    export enum Type {
        Branch, Memory, Arithmetic
        }

    /***************************************/
    /******* Arithmetic instructions *******/
    /***************************************/

    export class MOV extends InstructionBase {
        type = Instructions.Type.Arithmetic;
        }

    export class ADD extends InstructionBase {
        type = Instructions.Type.Arithmetic;
        }

    export class ADDI extends InstructionBase {
        type = Instructions.Type.Arithmetic;
        }

    export class SUB extends InstructionBase {
        type = Instructions.Type.Arithmetic;
        }

    export class SUBI extends InstructionBase {
        type = Instructions.Type.Arithmetic;
        }

    export class MUL extends InstructionBase {
        type = Instructions.Type.Arithmetic;
        }

    export class CMP extends InstructionBase {
        type = Instructions.Type.Arithmetic;
        }

    /***************************************/
    /********* Memory instructions *********/
    /***************************************/

    export class LOAD extends InstructionBase {
        type = Instructions.Type.Memory;
        }

    export class STR extends InstructionBase {
        type = Instructions.Type.Memory;
        }

    /***************************************/
    /********* Branche instructions ********/
    /***************************************/

    export class B extends InstructionBase {
        type = Instructions.Type.Branch;
        }

    export class BEQ extends InstructionBase {
        type = Instructions.Type.Branch;
        }

    export class BGT extends InstructionBase {
        type = Instructions.Type.Branch;
        }

    export class BLT extends InstructionBase {
        type = Instructions.Type.Branch;
        }

    export class BNE extends InstructionBase {
        type = Instructions.Type.Branch;
        }
}