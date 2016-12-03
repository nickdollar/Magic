deckNameAndArchetype = function(str) {

    str = str.toLowerCase();
    str = str.replace("^uw ", "UW ");
    str = str.replace("tron", "Tron");
    str = str.replace("^uwx ", "UWx ");
    str = str.replace("^rb ", "RB ");
    str = str.replace("^ub ", "UB ");
    str = str.replace("^brgw ", "BRGW ");
    str = str.replace("^ur ", "UR ");
    str = str.replace("^4c ", "4C ");
    str = str.replace("^rug ", "rug ");
    str = str.replace("^urg ", "RUG ");
    str = str.replace("^rg ", "RG ");
    str = str.replace("^rw ", "RW ");
    str = str.replace("^ug ", "UG ");
    str = str.replace("^gw ", "GW ");
    str = str.replace("^w/u ", "W/U ");
    str = str.replace("^ugr ", "RUG ");

    return upperFirstLetters(str);
}

