module Display {

    export function write(text: string, type?: Enums.Style): void {
        var typeClass: string;

        if (type == null)
            typeClass = GetTypeClass(Enums.Style.Normal);

        else
            typeClass = GetTypeClass(type);

        var line = "<span class=\"" + typeClass +
            "\">" + text + "</span>";

        $('#console div').append(line);

        ScrollToBottom();
    }

    export function writeLine(text: string, type?: Enums.Style): void {
        var typeClass: string;

        if (type == null)
            typeClass = GetTypeClass(Enums.Style.Normal);

        else
            typeClass = GetTypeClass(type);

        var line = "<span class=\"" + typeClass +
            "\">" + text + "</span><br/>";

        $('#console div').append(line);

        ScrollToBottom();
    }

    export function clearConsole() {
        $('#console div').text("");
    }

    export function printArray(array: any, heading: string): void {
        Display.writeLine(heading, Enums.Style.Heading);

        var i = 0;
        for (var key in array) {
            Display.write(i +
                ":&nbsp;&nbsp;&nbsp;&nbsp;", Enums.Style.Instrumentation);

            if (array[key] != null)
                Display.writeLine(array[key].toString());

            i++;
        }
    }

    export function clearTables() {
        ClearTable("#registerTable");
        ClearTable("#memoryTable");
    }

    export function updateRegisterTable(registerFile: Register[]): void {
        /// <summary>
        ///     Updates the table with register value on the webpage with the latest values
        /// </summary>
        var $trs = $('#registerTable tbody tr');
        $trs.each((i, tr)=> {
            var td0 = $(tr).find('td')[0];
            var td1 = $(tr).find('td')[1];

            var val = registerFile[td0.innerText].value;
            if (val != null)
                $(td1).text(val);
        });
    }

    export function updateMemoryTable(cpu: CPU): void {
        var $trs = $('#memoryTable tbody tr');
        $trs.each((i, tr)=> {
            var td0 = $(tr).find('td')[0];
            var td1 = $(tr).find('td')[1];

            var val = cpu.Memory[+td0.innerText];
            if (val != null)
                $(td1).text(val);
        });
    }

    /* Private functions */

    function ClearTable(tableName: string) {
        var selector = tableName + " tbody tr";
        var $trs = $(selector);
        $trs.each((i, tr)=> {
            var td1 = $(tr).find('td')[1];
            $(td1).text('');
        });
    }

    function ScrollToBottom(): void {
        $('#console div').scrollTop($('#console div')[0].scrollHeight);

        //$('#console div').animate({ scrollTop: $('#console div')[0].scrollHeight }, 'fast');
    }

    function GetTypeClass(type: Enums.Style): string {
        var typeClass: string = "c_";

        return typeClass.concat(Enums.Style[type].toLowerCase());
    }

}