var Instructions = {};
//the namespace to which all the instructions belong

function extend(base, sub) {
    // Avoid instantiating the base class just to setup inheritance
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    // for a polyfill
    sub.prototype = Object.create(base.prototype);
    // Remember the constructor property was set wrong, let's fix it
    sub.prototype.constructor = sub;

}

// Instruction base class

function Instruction(operands) {
    this.Operands = operands;
    var cpu = Cpu.getInstance();
    this.RegisterFile = cpu.RegisterFile;
    this.MemoryFile = cpu.MemoryFile;
}

Instruction.prototype = {
    Execute: function() {
        alert("Execute not implemented.");
    }
};

/******************************************************************************
********************* Instruction Plumbing ************************************
******************************************************************************/

Instructions.ADD = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.ADD, Instruction);

Instructions.ADDI = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.ADDI, Instruction);

Instructions.SUBI = function (operands) {
    Instruction.call(this, operands);
};
extend(Instructions.SUBI, Instruction);


Instructions.MOV = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.MOV, Instruction);

Instructions.CPY = function (operands) {
    Instruction.call(this, operands);
};
extend(Instructions.CPY, Instruction);


Instructions.SUB = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.SUB, Instruction);

Instructions.CMP = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.CMP, Instruction);

Instructions.B = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.B, Instruction);

Instructions.BEQ = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.BEQ, Instruction);

Instructions.BNE = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.BNE, Instruction);

Instructions.BGT = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.BGT, Instruction);

Instructions.BLT = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.BLT, Instruction);

Instructions.LDR = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.LDR, Instruction);

Instructions.STR = function(operands) {
    Instruction.call(this, operands);
};
extend(Instructions.STR, Instruction);

Instructions.ST = function (operands) {
    Instruction.call(this, operands);
};
extend(Instructions.ST, Instruction);


/******************************************************************************
***************Instruction Execute Method Implementations *********************
******************************************************************************/
Instructions.MOV.prototype.Execute = function() {
    /// <summary>
    ///     MOV num dst
    /// </summary>
    this.RegisterFile[this.Operands[1]] = this.Operands[0];
};

Instructions.CPY.prototype.Execute = function () {
    /// <summary>
    ///     CPY src dst
    /// </summary>
    var srcContents = this.RegisterFile[this.Operands[0]];
    this.RegisterFile[this.Operands[1]] = srcContents;
};

Instructions.ADD.prototype.Execute = function() {
    /// <summary>
    ///     ADD src src dst
    /// </summary>
    var op1 = this.RegisterFile[this.Operands[0]];
    var op2 = this.RegisterFile[this.Operands[1]];

    var op3 = this.Operands[2];
    var result = parseInt(op1) + parseInt(op2);
    this.RegisterFile[op3] = result;
};

Instructions.ADDI.prototype.Execute = function() {
    /// <summary>
    ///     ADDI num src dst
    /// </summary>
    var op1 = this.Operands[0];
    var op2 = this.RegisterFile[this.Operands[1]];
    var op3 = this.Operands[2];

    var result = parseInt(op1) + parseInt(op2);
    this.RegisterFile[op3] = result;
};

Instructions.SUBI.prototype.Execute = function () {
    /// <summary>
    ///     SUBI num src dst - subtract num from src and place in dst
    /// </summary>
    var op1 = this.Operands[0];
    var op2 = this.RegisterFile[this.Operands[1]];
    var op3 = this.Operands[2];

    var result = parseInt(op2) - parseInt(op1);
    this.RegisterFile[op3] = result;
};

Instructions.SUB.prototype.Execute = function() {
    /// <summary>
    ///     SUB src1 src2 dst - subtract src1 from src2 and put in dst
    /// </summary>
    var op1 = this.RegisterFile[this.Operands[0]];
    var op2 = this.RegisterFile[this.Operands[1]];
    var op3 = this.Operands[2];

    var result = parseInt(op2) - parseInt(op1);
    this.RegisterFile[op3] = result;
};

Instructions.CMP.prototype.Execute = function() {
    /// <summary>
    ///     CMP src src
    /// </summary>
    var op1 = this.RegisterFile[this.Operands[0]];
    var op2 = this.RegisterFile[this.Operands[1]];

    var sub = parseInt(op1) - parseInt(op2);

    this.RegisterFile["eq"] = sub == 0 ? 1 : 0;
    this.RegisterFile["gt"] = sub >= 0 ? 1 : 0;
};

Instructions.B.prototype.Execute = function() {
    /// <summary>
    ///     B label
    /// </summary>
    this.RegisterFile["pc"] = this.Operands;
};

Instructions.BEQ.prototype.Execute = function() {
    /// <summary>
    ///     BEQ label
    /// </summary>
    if (this.RegisterFile["eq"] == 1)
        this.RegisterFile["pc"] = this.Operands;
    else {
        //TODO - if the branch is not taken, neeed to incrememnt pc
        //this should happen in a centralised location somewhere (branch unit)
        _cpu.IncrementProgramCounter(); 
    }
};

Instructions.BNE.prototype.Execute = function() {
	/// <summary>
	///  BNE label
    /// </summary>
    if (this.RegisterFile["eq"] == 0)
        this.RegisterFile["pc"] = this.Operands;
    else {
        //TODO - if the branch is not taken, neeed to incrememnt pc
        //this should happen in a centralised location somewhere (branch unit)
        _cpu.IncrementProgramCounter();
    }
}

Instructions.BGT.prototype.Execute = function() {
    /// <summary>
    ///     BGT label
    /// </summary>
    if (this.RegisterFile["eq"] === 0 && this.RegisterFile["gt"] === 1)
        this.RegisterFile["pc"] = this.Operands;
    else {
        //TODO - if the branch is not taken, neeed to incrememnt pc
        //this should happen in a centralised location somewhere (branch unit)
        _cpu.IncrementProgramCounter();
    }
};

Instructions.BLT.prototype.Execute = function() {
    /// <summary>
    ///     BLT label
    /// </summary>
    if (this.RegisterFile["eq"] === 0 && this.RegisterFile["gt"] === 0)
        this.RegisterFile["pc"] = this.Operands;
    else {
        //TODO - if the branch is not taken, neeed to incrememnt pc
        //this should happen in a centralised location somewhere (branch unit)
        _cpu.IncrementProgramCounter(); 
    }
};

Instructions.LDR.prototype.Execute = function() {
    /// <summary>
    ///     LDR src dst
    /// </summary>
    var address = parseInt(this.RegisterFile[this.Operands[0]]);
    var contents = this.MemoryFile[address];

    if (address > 15 || isNaN(address))
        alert("LDR exception - source must be less than 16 and numeric." +
            "Simulation after this will be unpredictable.");

    this.RegisterFile[this.Operands[1]] = contents;
};

Instructions.STR.prototype.Execute = function() {
    /// <summary>
    ///     STR src dst - store contents of register in memory location
    /// </summary>
    var contents = this.RegisterFile[this.Operands[0]];
    var address = parseInt(this.RegisterFile[this.Operands[1]]);

    if (address > 15 || isNaN(address))
        alert("STR exception - destination must be less than 16 and numeric." +
            "Simulation after this will be unpredictable.");

    this.MemoryFile[address] = contents;
};

Instructions.ST.prototype.Execute = function () {
    /// <summary>
    ///     ST num dst - store constant in memorylocation
    /// </summary>
    var contents = parseInt(this.Operands[0]);
    var address = parseInt(this.RegisterFile[this.Operands[1]]);

    if (address > 15 || isNaN(address))
        alert("ST exception - destination must be less than 16 and numeric." +
            "Simulation after this will be unpredictable.");

    this.MemoryFile[address] = contents;
};