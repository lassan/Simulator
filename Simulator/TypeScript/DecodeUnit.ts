class DecodeUnit {
    private _executionUnits : ExecutionUnit[];
    private _registerFile : number[];

    constructor(executionUnits: ExecutionUnit[], registerFile : number[]){
        this._executionUnits = executionUnits;
        this._registerFile = registerFile;
    }

    decode(instruction: Instructions.Instruction): ExecutionUnit {
        if (instruction == null)
            return null;

        var executionUnit : ExecutionUnit;

        switch (instruction.type) {
        case Instructions.Type.ArithmeticUnit:
            executionUnit = this.decodeArithmeticUnitInstruction(instruction);
            break;
        case Instructions.Type.BranchUnit:
            executionUnit = this.decodeBranchUnitInstruction(instruction);
            break;
        case Instructions.Type.MemoryUnit:
            executionUnit = this.decodeMemoryUnitInstruction(instruction);
            break;
        default:
            throw "What, are you crazy?";
        }

        return executionUnit;
    }

    private decodeArithmeticUnitInstruction(instruction: Instructions.Instruction): ExecutionUnit {
        var operands : number[] = [];
        var executableOperands : number[] = [];
        var writeBackRegister = instruction.operands[0];

        for (var i in instruction.operands) {
            var op = instruction.operands[i];

            if (StringHelpers.isNumber(op)) {
                // If the operand is a number, send it to execution units directly
                // This situtation occurs in the case of immediate instructions
                operands.push(+op);
            } else {
                // otherwise fetch the numeric value from the register file
                operands.push(this._registerFile[op]);
            }
        }

        if (instruction.numOperands == 2) {
            executableOperands.push(operands[1]);
        } else if (instruction.numOperands == 3) {
            executableOperands.push(operands[1]);
            executableOperands.push(operands[2]);
        }

        return this.assignExecutionUnit(instruction, executableOperands, writeBackRegister);
    }

    private decodeMemoryUnitInstruction(instruction: Instructions.Instruction): ExecutionUnit {
        var operands : number[] = [];

        var writeBackRegister : string;

        if (instruction instanceof Instructions.STR)
            writeBackRegister = null;
        else
            writeBackRegister = instruction.operands[0];

        var op1 = this._registerFile[instruction.operands[0]];
        var op2 = this._registerFile[instruction.operands[1]];

        operands.push(op1);
        operands.push(op2);

        return this.assignExecutionUnit(instruction, operands, writeBackRegister);
    }

    private decodeBranchUnitInstruction(instruction: Instructions.Instruction): ExecutionUnit {
        var operands : number[] = [];
        operands.push(+instruction.operands[0]);
        return this.assignExecutionUnit(instruction, operands, "pc");
    }

    private assignExecutionUnit(instruction: Instructions.Instruction, operands: any[], writeBackRegister: string): ExecutionUnit {
        //figure out the correct execution unit
        for (var j in this._executionUnits) {
            if (this._executionUnits[j].type == instruction.type ) {
                this._executionUnits[j].setInstruction(operands, instruction.name, writeBackRegister);
                return this._executionUnits[j];
            }
        }
        return null;
    }

    }