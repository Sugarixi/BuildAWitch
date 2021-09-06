// Return true jos luku 1 voidaan jakaa luvulla 2
function onJaettavissa(number1, number2) {
    if (number1 == undefined || number2 == undefined)
        throw "argumentit puuttuvat";
    if (isNaN(number1) || isNaN(number2))
        throw "argumenttien tulee olla numeroita";
    if (number2 == 0)
        throw "lukua ei voi jakaa nollalla";
    else if (number1 % number2 == 0) //ei desimaalia
        return true;
    else
        return false;
}

exports.onJaettavissa = onJaettavissa;