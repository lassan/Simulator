/// <reference path="Display.ts" />

class Pipeline {
    private _cpu : CPU;
    private _instructions : Instructions.InstructionBase[];
    private _executionUnits : ExecutionUnit[];
    
    constructor(cpu: CPU, instructions: Instructions.InstructionBase[], executionUnits: ExecutionUnit[]) {
        this._cpu = cpu;
        this._instructions = instructions;
        this._executionUnits = executionUnits;
    }

    public start() : void{
        var instructions = new Queue<Instructions.InstructionBase>();
        var executionUnits = new Queue<ExecutionUnit>();

        while (true) {
            this.writeback(instructions[0], executionUnits[1]);
            this.execute(executionUnits[0]);
            executionUnits[0] = this.decode(instructions[0]);

            instructions[0] = this.fetch();

            if (instructions[0] == null)
                break;
        }

        Display.writeLine("Execution terminated.");

        //while ((nextInstruction = this.fetch()) != null) {
        //    var unit = this.decode(nextInstruction);
        //    this.execute(unit);
        //    this.writeback(nextInstruction, unit);
        //}
    }

    private fetch(): Instructions.InstructionBase {
        var pc = this._cpu.getProgramCounter();
        return pc >= this._instructions.length
            ? null
            : this._instructions[pc];
    }

    private decode(instruction: Instructions.InstructionBase): ExecutionUnit {
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

    private decodeArithmeticUnitInstruction(instruction: Instructions.InstructionBase): ExecutionUnit {
        var operands : number[] = [];
        var executableOperands : number[] = [];

        for (var i in instruction.operands) {
            var op = instruction.operands[i];

            if (this.isNumber(op)) {
                // If the operand is a number, send it to execution units directly
                // This situtation occurs in the case of immediate instructions
                operands.push(+op);
            } else {
                // otherwise fetch the numeric value from the register file
                operands.push(this._cpu.RegisterFile[op]);
            }
        }

        if (instruction.numOperands == 2) {
            executableOperands.push(operands[1]);
        } else if (instruction.numOperands == 3) {
            executableOperands.push(operands[1]);
            executableOperands.push(operands[2]);
        }

        return this.assignExecutionUnit(instruction, executableOperands);
    }

    private decodeMemoryUnitInstruction(instruction: Instructions.InstructionBase): ExecutionUnit {
        var operands : number[] = [];

        var op1 = this._cpu.RegisterFile[instruction.operands[0]];
        var op2 = this._cpu.RegisterFile[instruction.operands[1]];

        operands.push(op1);
        operands.push(op2);

        return this.assignExecutionUnit(instruction, operands);
    }

    private decodeBranchUnitInstruction(instruction: Instructions.InstructionBase): ExecutionUnit {
        var operands : number[] = [];

        operands.push(+instruction.operands[0]);

        return this.assignExecutionUnit(instruction, operands);
    }

    private assignExecutionUnit(instruction: Instructions.InstructionBase, operands: any[]): ExecutionUnit {
        //figure out the correct execution unit
        for (var j in this._executionUnits) {
            if (this._executionUnits[j].type == instruction.type &&
                this._executionUnits[j].isFree) {
                this._executionUnits[j].setInstruction(operands, instruction.name);
                return this._executionUnits[j];
            }
        }
        return null;
    }

    private execute(executionUnit: ExecutionUnit): void {
        if (executionUnit == null)
            return;

        executionUnit.execute();
    }

    private writeback(instruction: Instructions.InstructionBase, executionUnit: ExecutionUnit): void {
        if (instruction == null || executionUnit == null)
            return;

        if (instruction.type == Instructions.Type.BranchUnit) {
            /// execution.result will contain the new program counter

            Display.write("branch instruction: ");
            this._cpu.setProgramCounter(executionUnit.result);
            Display.writeLine(this._cpu.getProgramCounter().toString());
            return;
        }

        // incremenent counter if the instruction wasn't a branch
        this._cpu.incrementProgramCounter();

        if (executionUnit.result == null)
            /// happens for str instruction
            return;

        var destination = instruction.operands[0];
        this._cpu.RegisterFile[destination] = +executionUnit.result;
        Display.write("result: ");
        Display.writeLine(this._cpu.RegisterFile[destination]);
    }

    private isNumber(n:any) :boolean{
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    }