/// <reference path="Instructions.ts" />
/// <reference path="helpers.ts" />

class Assembler {
 
    private _labels : string[];
    private _assembly : string;

    constructor(assembly: string) {
        this._assembly = assembly;
        this._labels = [];
    }

    public getInstructions(): Instructions.Instruction[]{
        /// <summary>
        ///     Creates instruction objects from assembly text
        /// </summary>
        /// <param name="assembly">The assembly text from which to create instruction objects</param>
        /// <returns type="Array">Array of instructions</returns>
        var lines = this.parse();
        var instructions : Instructions.Instruction[] = [];

        for (var i = 0; i < lines.length; i++) {

            var parts = this.getInstructionParts(lines[i]);
            var instruction = this.createInstruction(parts);
            instructions.push(instruction);
        }
        return instructions;
    }

    private getInstructionParts(line: string): string[]{
        /// <summary>
        ///     Gets the parts of the instruction (i.e. opcode and operands) - anything seperated by a ' '
        /// </summary>
        /// <param name="line">The line of assembly</param>
        /// <returns type="Array">Array of strings - each element contains a part of the instruction</returns>
        return line.split(' ');
    }

    private parse(): string[] {
        /// <summary>
        ///     Goes through the assembly and finds labels. if any labels are found,
        ///     adds them to an array and removes them from the source assembly
        /// </summary>
        /// <param name="assembly"></param>
        /// <returns type="string">Updated assembly without the lines that had labels on</returns>
        var lines = this._assembly.split('\n');

        var programCounter = 0;

        var assembly : string[] = [];

        for (var i = 0; i < lines.length; i++) {
            if (!StringHelpers.isBlank(lines[i]) && !StringHelpers.isEmpty(lines[i])) {
                var parts = this.getInstructionParts(lines[i]);
                if (!this.tryCreateLabel(parts, programCounter)) {
                    programCounter++;
                    assembly.push(lines[i]);
                }
            }
        }
        return assembly;
    }

    private tryCreateLabel(parts: string[], programCounter: number): boolean {
        /// <summary>
        ///     Checks to see if a given array of instruction parts is a label  (if first
        ///     element in array ends with ':', then it is assumed to be a label.
        ///     if a label is found, adds it to the labels array with the program counter
        ///     of the instruction that label points to
        /// </summary>
        /// <param name="parts">Instruction to test</param>
        /// <param name="programCounter">The program counter (i.e. the current instruction number)</param>
        /// <returns type="bool">True if instruction is a label, false otherwise</returns>
        if (parts.length == 1 && StringHelpers.endsWith(parts, ':')) {
            var label = parts[0].substring(0, parts[0].length - 1);
            this._labels[label] = programCounter;
            return true;
        } else return false;
    }

    private createInstruction(parts: string[]): Instructions.Instruction {
        /// <summary>
        ///     Creates and instruction object from an array of parts of the instruction
        /// </summary>
        /// <param name="parts">array of strings containing the opcode and operands</param>
        /// <returns type="Instruction">An instruction</returns>
        var instructionType = parts[0];
        var operands = parts.splice(1);

        var instruction = new Instructions[instructionType]();
        if (instruction.type == Instructions.Type.BranchUnit)
        {
            var label = this._labels[operands[0]];
            operands = [];
            operands.push(label);
        }

        instruction.setOperands(operands);

        return instruction;
    }
    }