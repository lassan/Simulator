module Enums {
    export enum State {
        Free, Assigned, Executing, Completed
    }

    export enum ExecutionUnit {
        BranchUnit, LoadUnit, StoreUnit, ArithmeticUnit
    }

    export enum Style {
        Normal, Error, Instrumentation, Heading
    }
}