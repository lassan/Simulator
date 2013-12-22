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
    private _array: ReOrderBufferEntry[];

    constructor() {
        this._array = [];

    }

    add(entry: ReOrderBufferEntry): void {
        this._array.push(entry);
    }

    removeFirst() {
        this._array.shift(); //removes first element of _array
    }

    removeLast() {
        this._array.pop();
    }

    flush(entry: ReOrderBufferEntry) {
        //Removes all the entries in the re-order buffer after the specified instruction
        var index = this._array.indexOf(entry);
        if (index == -1) throw Error("Entry to start flushing from not in the reorder buffer.");

        index = index + 1;  //to not delete the instruction that caused the flush
        if (index >= this._array.length)
            return;

        while (this._array.length != index ) {
            this.removeLast();
        }
    }

    getEntriesAfter(entry: ReOrderBufferEntry) {
        var array: ReOrderBufferEntry[] = [];
        var index = this._array.indexOf(entry);
        for (index = index + 1; index < this._array.length; index++) {
            array.push(this._array[index]);
        }
        return array;
    }

    toArray() {
        return this._array;
    }

    tryGetExistingEntry(register: string): ReOrderBufferEntry {
        /// <summary>
        ///     Returns the last ReOrderBufferEntry that contains the specified register as it's destination.
        ///     if none exists, returns null;
        /// </summary>
        var entry: ReOrderBufferEntry = null;

        for (var key in this._array) {
            if (this._array[key].destination == register)
                entry = this._array[key];
        }
        return entry;
    }

    isEmpty() {
        return this._array.length == 0;
    }

}