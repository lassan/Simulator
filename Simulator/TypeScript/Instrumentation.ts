class Instrumentation {
    private _array: number[];

    constructor() {
        this._array = [];
        this._array["Instructions Fetched"] = 0;
        this._array["Instructions Executed"] = 0;
        this._array["Instructions Decoded"] = 0;
        this._array["Instructions Issued"] = 0;
        this._array["Instructions Commited"] = 0;
        this._array["Branches Taken"] = 0;
        this._array["Branches Not Taken"] = 0;
        this._array["Correct Predictions"] = 0;
        this._array["Incorrect Predictions"] = 0;
        this._array["Pipeline Iterations"] = 1;
    }

    fetched(num: number) {
        this._array["Instructions Fetched"] += num;
    }

    executed(num: number) {
        this._array["Instructions Executed"] += num;
    }

    decoded(num: number) {
        this._array["Instructions Decoded"] += num;
    }

    dispatched(num: number) {
        this._array["Instructions Issued"] += num;
    }

    committed(num: number) {
        this._array["Instructions Commited"] += num;
    }

    pipline() {
        this._array["Pipeline Iterations"]++;
    }

    branch() {
        this._array["Branches Taken"]++;
    }

    notBranch() {
        this._array["Branches Not Taken"]++;
    }

    predictionSuccess() {
        this._array["Correct Predictions"]++;
    }

    predictionFail() {
        this._array["Incorrect Predictions"]++;
    }

    toArray() {
        return this._array;
    }
}