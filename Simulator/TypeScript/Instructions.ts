class Instruction {
    public type: InstructionType;
    constructor(public operands: string[]) { }
}

enum InstructionType {
    Branch, Memory, Arithmetic
}

class MOV extends Instruction {
    type = InstructionType.Memory;
}

class ADD extends Instruction {
    type = InstructionType.Arithmetic;
}

class ADDI extends Instruction {
    type = InstructionType.Arithmetic;
}

