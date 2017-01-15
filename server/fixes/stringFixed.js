deckNameAndArchetypeFix = function(str) {

    str = str.toTitleCase();
    str = str.replace(/^uw /i, "UW ");
    str = str.replace(/^wu /i, "UW ");

    str = str.replace(/^rb /i, "RB ");
    str = str.replace(/^br /i, "RB ");

    str = str.replace(/^ub /i, "UB ");
    str = str.replace(/^bu /i, "UB ");

    str = str.replace(/^uwx /i, "UWx ");

    str = str.replace(/^rug /i, "RUG ");
    str = str.replace(/^urg /i, "RUG ");
    str = str.replace(/^ugr /i, "RUG ");

    str = str.replace(/^gb /i, "GB ");
    str = str.replace(/^bg /i, "GB ");

    str = str.replace(/^brgw /i, "BRGW ");


    str = str.replace(/^bgru /i, "BGRU ");


    str = str.replace(/^ur /i, "UR ");
    str = str.replace(/^ru /i, "UR ");

    str = str.replace(/^bw /i, "WB ");
    str = str.replace(/^wb /i, "WB ");

    str = str.replace(/^4c /i, "4C ");

    str = str.replace(/^rg /i, "RG ");
    str = str.replace(/^gr /i, "RG ");

    str = str.replace(/^rw /i, "RW ");
    str = str.replace(/^wr /i, "RW ");


    str = str.replace(/^ug /i, "UG ");
    str = str.replace(/^gu /i, "UG ");


    str = str.replace(/^gw /i, "GW ");
    str = str.replace(/^wg /i, "GW ");

    str = str.replace(/tron/i, "Tron");
    return str;

}

