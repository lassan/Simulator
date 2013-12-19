class DecodeUnit {

    
    constructor() {}

    decode(instruction: Instructions.Instruction): void {
        if (instruction == null)
            return;

        _cpu.ReservationStation.add(instruction);
    }
}