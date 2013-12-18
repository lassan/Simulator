class DecodeUnit {

    constructor() {}

    decode(instructions: Instructions.Instruction[]): void {
        if (instructions == null)
            return;

        for (var i in instructions) {
            _cpu.ReservationStation.add(instructions[i]);
        }
    }
}