class Configuration
{
    private _config: any[];

    constructor() {
        this._config = [];

        this._config["alu"] = $("input[name=numAlu]").val();
        this._config["loadstore"] = $("input[name=numLoaddStore]").val();
        this._config["branch"] = $("input[name=numBranch]").val();
        this._config["decode"] = $("input[name=numDecode]").val();
        this._config["sizeRS"] = $("input[name=sizeRS]").val();
    }

    public valid() : boolean {
        for (var key in this._config) {
            if (this._config[key] == null || this._config[key] < 1) {
                alert(key + " invalid.");
                return false;
            }
        }
        return true;
    }

    public getNumAlu() {
        return this._config["alu"];
    }

    public getNumLoadStore() {
        return this._config["loadstore"];
    }

    public getNumBranch() {
        return this._config["branch"];
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
}