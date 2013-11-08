var _examples = {};

_examples["ADD"] =
{
    assembly:
        "MOV 42 r0\n" +
            "MOV 42 r1\n" +
            "ADD r0 r1 r2\n",
    assertions: {
        "r2": 84
    }
};

_examples["ADDI"] = {
    assembly:
        "MOV 42 r0\n" +
            "ADDI 42 r0 r1",
    assetions: {
        "r1": 84
    }
};

_examples["SUB"] = {
    assembly:
        "MOV 42 r0\n" +
            "MOV 84 r1\n" +
            "SUB r1 r0 r2\n" +
            "SUB r0 r2 r3\n" +
            "SUB r0 r1 r4\n",
    assertions: {
        "r2": -42,
        "r3": -84,
        "r4": 42
    }
};

_examples["SUBI"] = {
    assembly:
        "MOV 42 r0\n" +
            "SUBI 21 r0 r1",
    assetions: {
        "r1": 21
    }
};

_examples["CMP"] = {
    assembly:
        "MOV 42 r0\n" +
            "MOV 21 r1\n" +
            "CMP r0 r1\n" +
            "CMP r1 r0\n" +
            "MOV 21 r2\n" +
            "CMP r1 r2\n",
    assertions: {
        "eq": 1,
        "gt": 1
    }
};

_examples["B"] = {
    assembly:
        "B label\n" +
            "MOV -1 r5\n" +
            "label:\n" +
            "MOV 42 r0",
    assertions: {
        "r0": 42,
        "r5": ""
    }
};

_examples["BEQ"] = {
    assembly:
        "MOV 42 r0\n" +
            "MOV 42 r1\n" +
            "CMP r0 r1\n" +
            "BEQ label\n" +
            "MOV -1 r5\n" +
            "label:\n" +
            "MOV 42 r4\n",
    assertions: {
        "r4": 42,
        "r5": ""
    }
};

_examples["BNE"] = {
    assembly:
        "MOV 42 r0\n" +
            "MOV 5 r1\n" +
            "CMP r0 r1\n" +
            "BNE label\n" +
            "MOV -1 r5\n" +
            "label:\n" +
            "MOV 42 r4\n",
    assertions: {
        "r4": 42,
        "r5": ""
    }
};

_examples["BGT"] = {
    assembly:
        "MOV 42 r0\n" +
            "MOV 0 r1\n" +
            "CMP r0 r1\n" +
            "BGT label\n" +
            "MOV -1 r5\n" +
            "label:\n" +
            "MOV 42 r4\n",
    assertions: {
        "r4": 42,
        "r5": ""
    }
};

_examples["BLT"] = {
    assembly:
        "MOV 42 r0\n" +
            "MOV 0 r1\n" +
            "CMP r1 r0\n" +
            "BLT label\n" +
            "MOV -1 r5\n" +
            "label:\n" +
            "MOV 42 r4\n",
    assertions: {
        "r4": 42,
        "r5": ""
    }
};

_examples["MOV"] = {
    assembly:
        "MOV 42 r0\n" +
            "MOV 84 r1\n",
    assertions: {
        "r0": 42,
        "r1": 84
    }
};

_examples["CPY"] = {
    assembly:
        "MOV 42 r0\n" +
            "CPY r0 r1\n",
    assertions: {
        "r1": 42
    }
};

_examples["STR"] = {
    assembly:
        "MOV 42 r0\n" +
            "MOV 0 r1\n" +
            "STR r0 r1\n"
};

_examples["LDR"] = {
    assembly:
        "MOV 42 r0\n" +
            "MOV 1 r1\n" +
            "STR r0 r1\n" +
            "LDR r1 r5\n",
    assertions: {
        "r5": 42
    }
};

_examples["Simple while loop"] = {
    assembly:
        "MOV 5 r0\n" +
            "MOV 10 r1\n" +
            "\n" +
            "loop_begin:\n" +
            "CMP r1 r0\n" +
            "BEQ loop_end\n" +
            "ADDI 1 r0 r0\n" +
            "B loop_begin\n" +
            "\n" +
            "loop_end:\n" +
            "MOV -1 r3",
    assertions: {
        "r3": -1
    }
};

_examples["For loop with arrays"] = {    
    assembly:
        "MOV 0 r0\n" +  //counter
            "MOV 0 r1\n" +  //address for a
            "MOV 0 r7\n" + //starting memory location
            "ST 0 r7\n" +
            "ADDI 1 r7 r7\n" +
            "ST 1 r7\n" +
            "ADDI 1 r7 r7\n" +
            "ST 2 r7\n" +
            "ADDI 1 r7 r7\n" +
            "\n" +
            "CPY r7 r2\n" + //address for b
            "ST 5 r7\n" +
            "ADDI 1 r7 r7\n" +
            "ST 5 r7\n" +
            "ADDI 1 r7 r7\n" +
            "ST 6 r7\n" +
            "ADDI 1 r7 r7\n" +
            "ST 8 r7\n" +
            "\n" +
            "MOV 3 r3\n" +  //counter limit
            "loop_begin:\n" +
            "CMP r0 r3\n" +
            "BEQ loop_end\n" +
            "ADD r0 r1 r4\n" +
            "ADD r0 r2 r5\n" +
            "LDR r4 r6\n" +
            "STR r6 r5\n" +
            "ADDI 1 r0 r0\n" + //increment counter
            "B loop_begin\n" +
            "\n" +
            "loop_end:\n"
};

_examples["Euclidean Algorithm"] = {
    assembly:
        "MOV 81 r0\n" +
            "MOV 45 r1\n" +
            "\n" +
            "loop_begin:\n" +
            "CMP r0 r1\n" +
            "BEQ loop_end\n" +
            "BGT greater_than\n" +
            "SUB r0 r1 r1\n" +
            "B loop_begin\n" +
            "\n" +
            "greater_than:\n" +
            "SUB r1 r0 r0\n" +
            "B loop_begin\n" +
            "\n" +
            "loop_end:\n" +
            "CPY r1 r3\n",
    assertions: {
        "r0": 5,
        "r3": 5
    }
};