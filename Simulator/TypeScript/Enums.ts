module Enums {
    export enum State {
        Free, Assigned, Executing, Completed
    }

    export enum ExecutionUnit {
        BranchUnit, MemoryUnit, ArithmeticUnit
    }

    export enum Style {
        Normal, Error, Instrumentation, Heading
    }
}