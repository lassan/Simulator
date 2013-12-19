///<reference path="DecodeUnit.ts"/>

class ReservationStation {
    private _entries: ReservationStationEntry[];
    private _size: number;

    constructor(size: number) {
        this._entries = [];
        this._size = size;
    }

    add(rsEntry: ReservationStationEntry) {
        if (this.isFull())
            throw "Reservation station is full, should not be calling add()";

        this._entries.push(rsEntry);
    }

    dispatch() : void{
        var dispatched: ReservationStationEntry[] = [];
        
        this._entries.forEach((entry, index)=> {
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
                    break;
                }
            }

            if (dispatchable) {
                var unit = this.getAvailableUnit(entry);
                if (unit == null)
                    return;
                else {
                    unit.setInstruction(entry);
                    dispatched.push(entry);
                }
            }
        });


        Display.printArray(dispatched, "RS Entries Dispatched");

        for (var i in dispatched) {
            this._entries.splice($.inArray(dispatched[i], this._entries), 1);
        }
    }

    updateOperands() {
        
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
}