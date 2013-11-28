module SimulatorConsole {

    export enum PrintType {
        Normal, Error, Instrumentation
    }

    export function write(text: string, type: PrintType): void {
        var typeClass = getTypeClass(type);
        var line = "<span class=\"" + typeClass +
            "\">" + text + "</span>";

        $('#console div').append(line); 
    }

    export function writeLine(text: string, type: PrintType): void {

        var typeClass = getTypeClass(type);
        var line = "<span class=\"" + typeClass +
            "\">" + text + "</span><br/>";

        $('#console div').append(line); 
    }

    export function clear() {
        $('#console div').text("");
    }

    function getTypeClass(type: PrintType): string {
        var typeClass: string = "c_";

        switch (type) {
            case PrintType.Error:
                typeClass = typeClass.concat("error");
                break;
            case PrintType.Instrumentation:
                typeClass = typeClass.concat("instrumentation");
                break;
            case PrintType.Normal:
                typeClass = typeClass.concat("normal");
                break;
            default:
                break;
        }
        return typeClass;
    }
}