/**************************** Assembler class ********************************/
"use strict";

function Assembler() {

    var labels = new Array();

    this.GetInstructions = function(assembly) {
        /// <summary>
        ///     Creates instruction objects from assembly text
        /// </summary>
        /// <param name="assembly">The assembly text from which to create instruction objects</param>
        /// <returns type="Array">Array of instructions</returns>
        var lines = this.ParseLabels(assembly);

        var instructions = new Array();

        for (var i = 0; i < lines.length; i++) {
            if (!isBlank(lines[i]) && (!isEmpty(lines[i]))) {
                var parts = this.GetInstructionParts(lines[i]);
                var instruction = this.CreateInstruction(parts);
                instructions.push(instruction);
            }
        }
        return instructions;
    };

    this.GetInstructionParts = function(line) {
        /// <summary>
        ///     Gets the parts of the instruction (i.e. opcode and operands) - anything seperated by a ' '
        /// </summary>
        /// <param name="line">The line of assembly</param>
        /// <returns type="Array">Array of strings - each element contains a part of the instruction</returns>
        return line.split(' ');
    };

    this.ParseLabels = function(assembly) {
        /// <summary>
        ///     Goes through the assembly and finds labels. if any labels are found,
        ///     adds them to an array and removes them from the source assembly
        /// </summary>
        /// <param name="assembly"></param>
        /// <returns type="string">Updated assembly without the lines that had labels on</returns>
        var lines = assembly.split('\n');

        var programCounter = 0;

        var updatedAssembly = new Array();

        for (var i = 0; i < lines.length; i++) {
            if (!isBlank(lines[i]) && (!isEmpty(lines[i]))) {
                var parts = this.GetInstructionParts(lines[i]);
                if (!this.TryCreateLabel(parts, programCounter)) {
                    programCounter++;
                    updatedAssembly.push(lines[i]);
                }
            }
        }

        return updatedAssembly;
    };

    this.TryCreateLabel = function(parts, programCounter) {
        /// <summary>
        ///     Checks to see if a given array of instruction parts is a label  (if first
        ///     element in array ends with ':', then it is assumed to be a label.
        ///     if a label is found, adds it to the labels array with the program counter
        ///     of the instruction that label points to
        /// </summary>
        /// <param name="parts">Instruction to test</param>
        /// <param name="programCounter">The program counter (i.e. the current instruction number)</param>
        /// <returns type="bool">True if instruction is a label, false otherwise</returns>
        if (parts.length == 1 && endsWith(parts, ':')) {
            var label = parts[0].substring(0, parts[0].length - 1);
            labels[label] = programCounter;
            return true;
        } else return false;
    };

    this.CreateInstruction = function(parts) {
        /// <summary>
        ///     Creates and instruction object from an array of parts of the instruction
        /// </summary>
        /// <param name="parts">array of strings containing the opcode and operands</param>
        /// <returns type="Instruction">An instruction</returns>
        var instructionType = parts[0];
        var operands = parts.splice(1);

        var instruction;

        //TODO - tidy up, should be centralised for all branches
        //for branch types, the program counter the label points to is subsituted for the operand
        switch (instructionType) {
        case "B":
            operands = labels[operands[0]];
            break;
        case "BEQ":
            operands = labels[operands[0]];
            break;
        case "BNE":
            operands = labels[operands[0]];
            break;
        case "BLT":
            operands = labels[operands[0]];
            break;
        case "BGT":
            operands = labels[operands[0]];
            break;
        default:
            break;
        }

        instruction = new Instructions[instructionType](operands);
        return instruction;
    };
}