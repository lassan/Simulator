module Instructions {
    export class InstructionBase {
        public type: Type;
        constructor(public operands: string[]) { }
    }

    export enum Type {
        Branch, Memory, Arithmetic
    }

    export class MOV extends InstructionBase {
        type = Instructions.Type.Memory;
    }

    export class ADD extends InstructionBase {
        type = Instructions.Type.Arithmetic;
    }

    export class ADDI extends InstructionBase {
        type = Instructions.Type.Arithmetic;
    }
}