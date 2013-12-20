var Register = (function () {
    function Register(value, set) {
        this.value = value;
        this.set = set;
    }
    Register.prototype.toString = function () {
        return this.value + " -  " + this.set;
    };
    return Register;
})();

var RegisterFile = (function () {
    function RegisterFile() {
        this.r0 = new Register(null, true);
        this.r1 = new Register(null, true);
        this.r2 = new Register(null, true);
        this.r3 = new Register(null, true);
        this.r4 = new Register(null, true);
        this.r5 = new Register(null, true);
        this.r6 = new Register(null, true);
        this.r7 = new Register(null, true);
        this.r8 = new Register(null, true);
        this.r9 = new Register(null, true);
        this.r10 = new Register(null, true);
        this.r11 = new Register(null, true);
        this.r12 = new Register(null, true);
        this.r13 = new Register(null, true);
        this.pc = new Register(0, true);
        this.st = new Register(null, true);
    }
    return RegisterFile;
})();
//# sourceMappingURL=RegisterFile.js.map
