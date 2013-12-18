class ReservationStation {
    private _instructions : Instructions.Instruction[];
    private _size : number;
    private _execUnits : ExecutionUnit[];
    private _registerFile : Register[];

    constructor(size: number, execUnits : ExecutionUnit[], registerFile : Register[]) {
        this._instructions = [];
        this._size = size;
        this._execUnits = execUnits;
        this._registerFile = registerFile;
    }

    add(instruction: Instructions.Instruction) {
        if (this.isFull())
            throw "Reservation station is full, should not be calling  add()";

        this._instructions.push(instruction);
    }

    dispatch() {
        var instructionsToRemove: number[] = [];

        this._instructions.forEach((instruction, index) => {

            if (!this.registersReady(instruction))
                return;

            var assigned : boolean = false;

            switch (instruction.type) {
            case Enums.ExecutionUnit.ArithmeticUnit:
                assigned = this.dispatchArithmetic(instruction);
                break;
            case Enums.ExecutionUnit.BranchUnit:
                assigned = this.dispatchBranch(instruction);
                break;
            case Enums.ExecutionUnit.MemoryUnit:
                assigned = this.dispatchLoadStore(instruction);
                break;
            default:
                throw "What, are you crazy?";
            }

            if (assigned)
                instructionsToRemove.push(index);
        });

        for (var i in instructionsToRemove) {
            this._instructions.splice(instructionsToRemove[i], 1);
        }
    }

    dispatchArithmetic(instruction) : boolean{
        var unit = this.getAvailableUnit(instruction);

        if (unit == null)
            return false;

        else {
            var operands : number[] = [];
            var executableOperands : number[] = [];
            var destination = instruction.operands[0];
            this._registerFile[destination].set = false;


            for (var i in instruction.operands) {
                var op = instruction.operands[i];

                if ($.isNumeric(op)) {
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

            unit.setInstruction(executableOperands, instruction.name, destination);
            return true;
        }
    }

    dispatchBranch(instruction) : boolean {
        var unit = this.getAvailableUnit(instruction);

        if (unit == null)
            return false;

        else {
            var operands : number[] = [];
            operands.push(+instruction.operands[0]);
            unit.setInstruction(operands, instruction.name, "pc");
            return true;
        }
    }

    dispatchLoadStore(instruction): boolean  {
        var unit = this.getAvailableUnit(instruction);

        if (unit == null)
            return false;
        else {
            var operands: number[] = [];

            var destination: string;

            if (instruction instanceof Instructions.STR)
                destination = null;
            else {
                destination = instruction.operands[0];
                this._registerFile[destination].set = false;
            }

            var op1 = this._registerFile[instruction.operands[0]].value;
            var op2 = this._registerFile[instruction.operands[1]].value;

            operands.push(op1);
            operands.push(op2);
            unit.setInstruction(operands, instruction.name, destination);

            return true;
        }

    }

    getAvailableUnit(instruction: Instructions.Instruction): ExecutionUnit {
        /// <summary>
        ///     Checks if a unit for the corresponding branch is available.
        ///     Returns a reference to the unit if availalbe
        ///     Returns null otherwise
        /// </summary>
        var units = this._execUnits;


        for (var j in units) {
            if (units[j].type == instruction.type && units[j].state == Enums.State.Free)
                return units[j];
        }
        return null;
    }

    isFull() {
        return this._instructions.length >= this._size;
    }

    private registersReady(instruction: Instructions.Instruction): boolean {
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