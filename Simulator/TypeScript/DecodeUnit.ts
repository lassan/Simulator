class DecodeUnit {
    private _executionUnits : ExecutionUnit[];
    private _registerFile : Register[];
    public wait : boolean = false;   // whether the pipeline should wait for execution unit to become free

    constructor(executionUnits: ExecutionUnit[], registerFile : Register[]){
        this._executionUnits = executionUnits;
        this._registerFile = registerFile;
    }

    decode(instruction: Instructions.Instruction): ExecutionUnit {
        if (instruction == null)
            return null;

        this.wait = ! this.registersReady(instruction);

        if (this.wait)
            return null;

        var executionUnit : ExecutionUnit;

        switch (instruction.type) {
        case Enums.ExecutionUnit.ArithmeticUnit:
            executionUnit = this.decodeArithmeticUnitInstruction(instruction);
            break;
        case Enums.ExecutionUnit.BranchUnit:
            executionUnit = this.decodeBranchUnitInstruction(instruction);
            break;
        case Enums.ExecutionUnit.MemoryUnit:
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
                operands.push(this._registerFile[op].value);
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

        var op1 = this._registerFile[instruction.operands[0]].value;
        var op2 = this._registerFile[instruction.operands[1]].value;

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
            if (this._executionUnits[j].type == instruction.type
                && this._executionUnits[j].state == Enums.State.Free) {
                this._executionUnits[j].setInstruction(operands, instruction.name, writeBackRegister);
                this.wait = false;

                this._registerFile[writeBackRegister].set = false;

                return this._executionUnits[j];
            }
        }
        this.wait = true;
        return null;
    }

    private registersReady(instruction: Instructions.Instruction) : boolean{
        for (var key in instruction.operands) {
            var elem = instruction.operands[key];
            if (!$.isNumeric(elem)) {
                if (!this._registerFile[elem].set) {
                    Display.writeLine("Register not set: " + elem, Enums.Style.Error);
                    return false;
                }
            }
        }
        return true;
    }

}