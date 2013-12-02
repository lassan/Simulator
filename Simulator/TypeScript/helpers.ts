module StringHelpers {

    export function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    export function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    export function endsWith(str, match) {
        var lastChar = str[0].slice(-1);
        if (lastChar === match)
            return true;
        else
            return false;
    }
}