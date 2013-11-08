/*************** The main control of the processor happens here **************/
/// <reference path="~/Scripts/instructions.js" />
/// <reference path="~/Scripts/cpu.js" />

/// <summary>
///     global variables
/// </summary>
var _instructions;
var _cpu = Cpu.getInstance();

function InitialiseProgram(instructions) {
    _cpu.RegisterFile["pc"] = 0; //reset program counter
    _instructions = instructions;
}

function ExecuteProgram() {
    /// <summary>
    ///     Executes all the instructions until the end
    /// </summary>
    
    var nextInstruction;

    while ((nextInstruction = FetchNextInstruction()) != null) {
        ExecuteInstruction(nextInstruction);
    }
}

function ExecuteInstruction(instruction) {
    /// <summary>
    ///     Executes the instruction passed in the parameter
    /// </summary>
    instruction.Execute();

    var isBranch = (instruction instanceof Instructions.B) ||
        (instruction instanceof Instructions.BEQ) ||
        (instruction instanceof Instructions.BNE) ||
        (instruction instanceof Instructions.BGT) ||
        (instruction instanceof Instructions.BLT);

    if (!isBranch) {
        //only increment the program counter if instruction is not a branch.
        //TODO tidy up - should not have to individually test each instruction for a branch 
        //perhaps when each branch belongs to a unit, or each instruction inherits from sub-instruction
        _cpu.IncrementProgramCounter();
    }
}

function FetchNextInstruction() {
    /// <summary>
    ///     Reads the program counter and returns the associated instruction. If the pc is > the number of instructions (i.e.
    ///     program is at end), returns null
    /// </summary>
    var pc = _cpu.RegisterFile["pc"];
    return pc >= _instructions.length
        ? null
        : _instructions[pc];
}

