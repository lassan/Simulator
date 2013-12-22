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

            if (array[key] != null) {
                Display.writeLine(array[key].toString());
            }


            i++;
        }
        window.console.groupEnd();
    }

    export function clearTables() {
        ClearTable("#registerTable");
        ClearTable("#memoryTable");
    }

    export function updateRegisterTable(registerFile: number[]): void {
        /// <summary>
        ///     Updates the table with register value on the webpage with the latest values
        /// </summary>
        var $trs = $('#registerTable tbody tr');
        $trs.each((i, tr)=> {
            var td0 = $(tr).find('td')[0];
            var td1 = $(tr).find('td')[1];

            var val = registerFile[td0.innerText];
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


    export function updateStats() {
        var $div = $("#stats div");
        $div.text('');
        var space = ":&nbsp;&nbsp;&nbsp;";

        var array= _cpu.Stats.toArray();
        for (var key in array) {
            $div.append(key + space + array[key] + "<br/>");
        }

        $div.append("<hr/>");

        var successRate = (array["Correct Predictions"] / (array["Incorrect Predictions"] + array["Correct Predictions"])) * 100;
        $div.append("Prediction success rate" + space + + Math.round(successRate * 100) / 100 + " %<br/>");

        var perIteration = Math.round((array["Instructions Commited"] / array["Pipeline Iterations"]) * 100) / 100;

        $div.append("Instructions per iteration" + space + perIteration + "<br/>");
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