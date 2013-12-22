/// <reference path="DecodeUnit.ts" />

class ReservationStation {
    private _entries: ReservationStationEntry[];
    private _size: number;

    constructor(size: number) {
        this._entries = [];
        this._size = size;
    }

    add(rsEntry: ReservationStationEntry) {
        if (this.isFull())
            throw Error("Reservation station is full, should not be calling add()");

        this._entries.push(rsEntry);
    }

    dispatch(): ReservationStationEntry[] {
        var dispatched: ReservationStationEntry[] = [];

        for (var j in this._entries) {
            var entry = this._entries[j];
            var unit: ExecutionUnit;

            var dispatchable: boolean = true;
            for (var i in entry.operands) {

                if (entry.operands[i] instanceof ReOrderBufferEntry) {
                    //if the operand is a reference to a re order buffer entry, check if buffer contains value now
                    var robEntry = entry.operands[i];

                    if ($.isNumeric(robEntry.value))
                        entry.operands[i] = robEntry.value;
                }

                if (!$.isNumeric(entry.operands[i])) {
                    dispatchable = false;
                    break; //stop checking the rest of the operands
                }
            }

            if (dispatchable && (unit = this.getAvailableUnit(entry)) != null) {
                unit.setInstruction(entry);
                dispatched.push(entry);
            } else if (!_cpu.Config.isOutOfOrder()) {
                //if it's not possible to dispatch the an instruction, and the configuration says not out of order, then stall
                break;
            }
        }

        for (j in dispatched) {
            this._entries.splice($.inArray(dispatched[j], this._entries), 1);
        }
        return dispatched;
    }

    getAvailableUnit(rsEntry: ReservationStationEntry): ExecutionUnit {
        /// <summary>
        ///     Checks if a unit for the corresponding reservation station entry is available.
        ///     Returns a reference to the unit if availalbe
        ///     Returns null otherwise
        /// </summary>
        var instruction = rsEntry.robEntry.instruction;
        var units = _cpu.ExecutionUnits;

        for (var j in units) {
            if (units[j].type == instruction.type && units[j].state == Enums.State.Free)
                return units[j];
        }
        return null;
    }

    isFull() {
        return this._entries.length >= this._size;
    }

    isEmpty() {
        return this._entries.length == 0;
    }

    flush(entry: ReOrderBufferEntry) {
        this._entries = [];
        //var robEntriesToRemove = _cpu.ReOrderBuffer.getEntriesAfter(entry);
        //var elementsToRemove: ReservationStationEntry[] = [];

        //var indexes = $.map(this._entries, (obj, index)=> {
        //    for (var i in robEntriesToRemove) {
        //        if (obj.robEntry == robEntriesToRemove[i])
        //            return index;
        //    }
        //});

        //for (var i = 0; i < indexes.length; i++)
        //    delete this._entries[indexes[i]];

        ////Remove undefined and nulls from the array
        //var newArr = [];
        //for (var index in this._entries) {

        //    if (this._entries[index]) {
        //        newArr.push(this._entries[index]);
        //    }
        //}

        //this._entries = newArr;
    }

}