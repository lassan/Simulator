class ExampleEntry {
    public assembly: string;
    public assertions: number[];
}

class Examples {
    private _array: ExampleEntry[];

    constructor() {
        this._array = [];
    }

}

var _examples = {};

_examples["MOV"] = {
    assembly:
        "MOV r0 42\n" +
            "MOV r1 42\n" +
            "MOV r2 84\n",
    assertions: {
        "r0": 42,
        "r1": 42,
        "r2": 84
    }
};

_examples["ADD"] =
{
    assembly:
        "MOV r0 42\n" +
            "MOV r1 42\n" +
            "ADD r2 r1 r0",
    assertions: {
        "r2": 84
    }
};

_examples["ADDI"] = {
    assembly:
        "MOV r0 42\n" +
            "ADDI r1 r0 42",
    assetions: {
        "r1": 84
    }
};

_examples["SUB"] = {
    assembly:
        "MOV r0 42\n" +
            "MOV r1 84\n" +
            "SUB r2 r0 r1\n" +
            "SUB r3 r0 r2\n" +
            "SUB r4 r0 r1",
    assertions: {
        "r2": -42,
        "r3": -84,
        "r4": 42
    }
};

_examples["SUBI"] = {
    assembly:
        "MOV r0 42\n" +
            "SUBI r1 r0 42",
    assetions: {
        "r1": 21
    }
};

_examples["MUL"] = {
    assembly:
        "MOV r0 2\n" +
            "MOV r1 2\n" +
            "MUL r2 r0 r1",
    assertions:
    {
        "r2": 4
    }
};

_examples["CMP"] = {
    assembly:
        "MOV r0 42\n" +
            "MOV r1 21\n" +
            "CMP r1 r0\n" +
            "CMP r0 r1\n" +
            "MOV r2 21\n" +
            "CMP r2 r1",
    assertions: {
        "eq": 1,
        "gt": 1
    }
};

_examples["B"] = {
    assembly:
        "B label\n" +
            "MOV r5 -1\n" +
            "label:\n" +
            "MOV r0 42",
    assertions: {
        "r0": 42,
        "r5": ""
    }
};

_examples["BEQ"] = {
    assembly:
        "MOV r0 42\n" +
            "MOV r1 42\n" +
            "CMP r0 r1\n" +
            "BEQ label\n" +
            "MOV r5 -1\n" +
            "label:\n" +
            "MOV r4 42\n",
    assertions: {
        "r4": 42,
        "r5": ""
    }
};

_examples["BNE"] = {
    assembly:
        "MOV r0 42\n" +
            "MOV r1 5\n" +
            "CMP r0 r1\n" +
            "BNE label\n" +
            "MOV r5 -1\n" +
            "label:\n" +
            "MOV r4 42\n",
    assertions: {
        "r4": 42,
        "r5": ""
    }
};

_examples["BGT"] = {
    assembly:
        "MOV r0 42\n" +
            "MOV r1 0\n" +
            "CMP r1 r0\n" +
            "BGT label\n" +
            "MOV r5 -1\n" +
            "label:\n" +
            "MOV r4 42\n",
    assertions: {
        "r4": 42,
        "r5": ""
    }
};

_examples["BLT"] = {
    assembly:
        "MOV r0 42\n" +
            "MOV r1 0\n" +
            "CMP r1 r0\n" +
            "BLT label\n" +
            "MOV r5 -1\n" +
            "label:\n" +
            "MOV r4 42\n",
    assertions: {
        "r4": 42,
        "r5": ""
    }
};

_examples["STR"] = {
    assembly:
        "MOV r0 42\n" +
            "MOV r1 0\n" +
            "STR r1 r0\n"
};

_examples["LDR"] = {
    assembly:
        "MOV r0 42\n" +
            "MOV r1 1\n" +
            "STR r1 r0\n" +
            "LDR r5 r1\n",
    assertions: {
        "r5": 42
    }
};

_examples["While Loop"] = {
    assembly:
        "MOV r0 5\n" +
            "MOV r1 100\n" +
            "\n" +
            "loop_begin:\n" +
            "CMP r0 r1\n" +
            "BGE loop_end\n" +
            "ADDI r0 r0 1\n" +
            "B loop_begin\n" +
            "\n" +
            "loop_end:\n" +
            "MOV r3 -1",
    assertions: {
        "r3": -1
    }
};

_examples["Unrolled While Loop"] = {
    assembly:
        "MOV r0 5\n" +
            "MOV r1 100\n" +
            "\n" +
            "loop_begin:\n" +
            "CMP r0 r1\n" +
            "BGE loop_end\n" +
            "ADDI r0 r0 1\n" +
            "ADDI r0 r0 1\n" +
            "ADDI r0 r0 1\n" +
            "ADDI r0 r0 1\n" +
            "ADDI r0 r0 1\n" +
            "B loop_begin\n" +
            "\n" +
            "loop_end:\n" +
            "MOV r3 -1",
    assertions: {
        "r3": -1
    }
};

_examples["Superscalar"] =
{
    assembly: "MOV r0 42\n" +
        "MOV r0 42\n" +
        "MOV r1 42\n" +
        "MOV r2 42\n" +
        "MOV r3 42\n" +
        "MOV r4 42\n" +
        "MOV r5 42\n" +
        "MOV r0 42\n" +
        "MOV r0 42\n" +
        "MOV r1 42\n" +
        "MOV r2 42\n" +
        "MOV r3 42\n" +
        "MOV r4 42\n" +
        "MOV r5 42\n" +
        "MOV r0 42\n" +
        "MOV r0 42\n" +
        "MOV r1 42\n" +
        "MOV r2 42\n" +
        "MOV r3 42\n" +
        "MOV r4 42\n" +
        "MOV r5 42\n" +
        "MOV r0 42\n" +
        "MOV r0 42\n" +
        "MOV r1 42\n" +
        "MOV r2 42\n" +
        "MOV r3 42\n" +
        "MOV r4 42\n" +
        "MOV r5 42\n" +
        "MOV r0 42\n" +
        "MOV r0 42\n" +
        "MOV r1 42\n" +
        "MOV r2 42\n" +
        "MOV r3 42\n" +
        "MOV r4 42\n" +
        "MOV r5 42\n" +
        "MOV r0 42\n" +
        "MOV r0 42\n" +
        "MOV r1 42\n" +
        "MOV r2 42\n" +
        "MOV r3 42\n" +
        "MOV r4 42\n" +
        "MOV r5 42\n"
};

_examples["Fibonacci Sequence Generator"] = {
    assembly: "MOV r0 16\n" +
        "MOV r1 0\n" +
        "MOV r2 1\n" +
        "MOV r3 0\n" +
        "\n" +
        "Loop:\n" +
        "CMP r3 r0\n" +
        "BGE End\n" +
        "STR r3 r1\n" +
        "ADD r4 r1 r2\n" +
        "ADDI r1 r2 0\n" +
        "ADDI r2 r4 0\n" +
        "ADDI r3 r3 1\n" +
        "B Loop\n" +
        "\n" +
        "End:"
};

_examples["Bubble Sort"] = {
    assembly: "MOV r13 4\n" +
        "MOV r0 0\n" +
        "MOV r1 5\n" +
        "STR r0 r1\n" +
        "ADDI r0 r0 1\n" +
        "MOV r1 7\n" +
        "STR r0 r1\n" +
        "ADDI r0 r0 1\n" +
        "MOV r1 -4\n" +
        "STR r0 r1\n" +
        "ADD r0 r0 1\n" +
        "MOV r1 6\n" +
        "STR r0 r1\n" +
        "\n" +
        "MOV r11 -1\n" +
        "SUBI r12 r13 1\n" +
        "\n" +
        "OuterLoop:\n" +
        "ADDI r11 r11 1\n" +
        "CMP r11 r12\n" +
        "BGE End\n" +
        "MOV r10 -1\n" +
        "SUB r9 r12 r11\n" +
        "InnerLoop:\n" +
        "ADDI r10 r10 1\n" +
        "CMP r10 r9\n" +
        "BGE OuterLoop\n" +
        "\n" +
        "LDR r8 r10\n" +
        "ADDI r7 r10 1\n" +
        "LDR r6 r7\n" +
        "\n" +
        "CMP r8 r6\n" +
        "BLE InnerLoop\n" +
        "\n" +
        "STR r10 r6\n" +
        "STR r7 r8\n" +
        "\n" +
        "B InnerLoop\n" +
        "B OuterLoop\n" +
        "End:"
};

_examples["Convolution"] =
{
    assembly: "MOV r0 0\n" + //counter
        "MOV r1 1\n" +
        "STR r0 r1\n" +
        "ADDI r0 r0 1\n" +
        "\n" +
        "MOV r1 2\n" +
        "STR r0 r1\n" +
        "ADDI r0 r0 1\n" +
        "\n" +
        "MOV r1 3\n" +
        "STR r0 r1\n" +
        "ADDI r0 r0 1\n" +
        "\n" +
        "MOV r1 4\n" +
        "STR r0 r1\n" +
        "ADDI r0 r0 1\n" +
        "\n" +
        "MOV r1 5\n" +
        "STR r0 r1\n" +
        "ADDI r0 r0 1\n" +
        "\n" +
        "MOV r1 6\n" +
        "STR r0 r1\n" +
        "ADDI r0 r0 1\n" +
        "\n" +
        "MOV r1 7\n" +
        "STR r0 r1\n" +
        "ADDI r0 r0 1\n" +
        "\n" +
        "MOV r0 3\n" + //lenA
        "MOV r1 7\n" + //lenB - actually where second array ends
        "MOV r2 8\n" + //nconv
        "MOV r3 0\n" + //i
        "MOV r4 3\n" + //j	- where second array starts
        "MOV r12 0\n" + //for comparison
        "MOV r13 8\n" + //location of output
        "OuterLoop:\n" +
        "CMP r3 r2\n" +
        "BGE OuterLoopEnd\n" +
        "ADD r5 r3 0\n" + //i1\n" + 
        "MOV r6 0\n" + //temp + 
        "\n" +
        "InnerLoop:\n" +
        "CMP r4 r1\n" +
        "BGE InnerLoopEnd\n" +
        "\n" +
        "CMP r5 r12\n" +
        "BLT ConditionEnd\n" +
        "CMP r5 r0\n" +
        "BGE ConditionEnd\n" +
        "LDR r8 r5\n" + //A[i1]
        "LDR r7 r4\n" + //B[j-lenA]
        "MUL r8 r7 r8\n" +
        "ADD r6 r6 r8\n" +
        "\n" +
        "ConditionEnd:\n" +
        "SUB r5 r5 1\n" +
        "STR r13 r6\n" +
        "ADDI r13 r13 1\n" +
        "ADDI r4 r4 1\n" + //increment j
        "B InnerLoop\n" +
        "InnerLoopEnd:\n" +
        "ADDI r3 r3 1\n" + //increment i
        "B OuterLoop\n" +
        "OuterLoopEnd:\n"
};