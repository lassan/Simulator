class Configuration {
    private _config: any[];

    constructor() {
        this._config = [];

        this._config["alu"] = $("input[name=numAlu]").val();
        this._config["load"] = $("input[name=numLoad]").val();
        this._config["store"] = $("input[name=numStore]").val();
        this._config["decode"] = $("input[name=numDecode]").val();
        this._config["sizeRS"] = $("input[name=sizeRS]").val();
        this._config["outOfOrder"] = $("input[name=outOfOrder").is(":checked");
        this._config["outputState"] = $("input[name=outputState]").is(":checked");
        this._config["branchPredictor"] = $("#branchPrediction").children("option").filter(":selected").text();
    }

    public validateNumeric(array) : boolean {
        for (var key in array) {
            if (array[key] == null || array[key] < 1) {
                alert(key + "invalid");
                return false;
            }
        }
        return true;
    }

    public validateBoolean(array): boolean {
        for (var key in array) {
            if (array[key] != true || array[key] != false) {
                alert(key + "invalid");
                return false;
            }
        }
        return true;
    }

    public validate(): boolean {
        var numbers = this._config.splice(0, 5);
        var options = this._config.splice(5, 2);

        var numeric = this.validateNumeric(numbers);
        var trueFalse = this.validateBoolean(options);

        return numeric && trueFalse;
    }

    public getNumAlu() {
        return this._config["alu"];
    }

    public getNumStore() {
        return this._config["store"];
    }

    public getNumLoad() {
        return this._config["load"];
    }

    public getNumDecode() {
        return this._config["decode"];
    }

    public getNumFetch() {
        return this._config["decode"];
    }

    public getSizeRS() {
        return this._config["sizeRS"];
    }

    public isOutOfOrder() {
        return this._config["outOfOrder"];
    }

    public shouldOutputState() {
        return this._config["outputState"];
    }

    public branchPredictor() {
        return this._config["branchPredictor"];
    }
}