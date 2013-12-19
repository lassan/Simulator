class Register {
    constructor(public value: number, public set: boolean) { }

    public toString() {
        return this.value + " -  " + this.set;
    }
}

class RegisterFile {
    public r0: Register;
    public r1: Register;
    public r2: Register;
    public r3: Register;
    public r4: Register;
    public r5: Register;
    public r6: Register;
    public r7: Register;
    public r8: Register;
    public r9: Register;
    public r10: Register;
    public r11: Register;
    public r12: Register;
    public r13: Register;
    public pc: Register;
    public st: Register;

    constructor() {
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
}