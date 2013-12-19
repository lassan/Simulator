class ReOrderBufferEntry {
    public instruction: Instructions.Instruction;
    public destination: string;
    public value: number;

    constructor() {}

    public toString() {
        return "[" + this.instruction.name + ", " + this.destination + ", " + this.value + "]";
    }
}

class ReOrderBuffer {
    private array: ReOrderBufferEntry[];

    constructor() {
        this.array = [];

    }

    add(entry: ReOrderBufferEntry): void{
        this.array.push(entry);
    }

    removeFirstEntry() {
        this.array.shift(); //removes first element of array
    }

    toArray() {
        return this.array;
    }

    tryGetExistingEntry(register: string): ReOrderBufferEntry {
        /// <summary>
        ///     Returns the last ReOrderBufferEntry that contains the specified register as it's destination.
        ///     if none exists, returns null;
        /// </summary>
        var entry: ReOrderBufferEntry = null;

        for (var key in this.array) {
            if (this.array[key].destination == register)
                entry =  this.array[key];
        }
        return entry;
    }

    isEmpty() {
        return this.array.length == 0;
    }

}