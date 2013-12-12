class Queue<T> {
    public length: number;
    private bug: any;

    private _array : Array<T>;

    constructor() {
        this._array = [];
    }

    enqueue(val: T) {
        /// <summary>
        ///     As an object to the end of the Queue
        /// </summary>
        this._array.push(val);
        this.length = this._array.length;
    }

    dequeue() : T {
        /// <summary>
        ///     Removes and returns the object at the beginning of the Queue
        /// </summary>
        if (this._array.length > 0) {
            var result = this._array[0];
            this._array.splice(0, 1);
            this.length = this._array.length;
            return result;
        } else
            throw "The queue is empty";

    }

    peek(): T {
        /// <summary>
        ///     Returns the object at the beginning of the Queue without removing it
        /// </summary>
        if (this._array.length > 0)
            return this._array[0];
        else
            throw "The queue is empty";
    }

    toArray(): Array<T> {
        return this._array;
    }

    toString(): string {
        var result : string = '';

        for (var i in this._array) {
            result += this._array[i].toString();
            result += "<br/>";
        }
        return result;
    }
    }