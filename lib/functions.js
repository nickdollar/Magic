

getQuantity = function(options, sideboard){
    var cursors = _CardDatabase.find(options);

    var cards = cursors.map(function(p) { return p.name });

    var countCards = _DeckCards.find({_deckID : Router.current().params.deckID, name : {$in : cards}, sideboard : sideboard});
    var quantities = countCards.map(function(p) { return parseInt(p.quantity) });

    var total = quantities.reduce(function(previousValue, currentValue){
        return Number(previousValue) + Number(currentValue);
    }, 0);

    return total;
};

typeOptions = { null : {},
                artifact : {creature : false, artifact : true},
                creature : {creature : true},
                enchantment : {enchantment : true, creature : false, artifact : false},
                instant : {instant : true},
                land : {land : true, creature : false, artifact : false},
                planeswalker : {planeswalker : true},
                sorcery : {sorcery : true}
            };

getQuantity2 = function(options, sideboard, eventType){
    options = typeOptions[options];
    var cursors = _CardDatabase.find(options);
    var cards = cursors.map(function(p) { return p.name });
    var deck = _Deck.findOne({eventType : eventType}, {limit : 1});
    var countCards = _DeckCards.find({ _deckID : deck._id, sideboard : sideboard, name : {$in : cards}});
    var quantities = countCards.map(function(p) { return parseInt(p.quantity) });
    var total = quantities.reduce(function(previousValue, currentValue){
        return Number(previousValue) + Number(currentValue);
    }, 0);
    return total;
};

makeLinkFromName = function(cardName){
    cardName = encodeURI(cardName);
    cardName = cardName.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "%22;").replace(/'/g, "%27");
    var linkBase = "http://69.195.122.106/nicholas/mtgpics/";
    var folderLetter = cardName.charAt(0).toLocaleLowerCase();
    var finalDirectory = linkBase+folderLetter+"/"+cardName+".full.jpg";
    return finalDirectory;
};

shadeColor = function(color, percent) {
    var num = parseInt(color.slice(1),16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return "#" +(0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

getWeekStartAndEnd = function(date){
    var curr = new Date;
    if(date != null){
        curr = date; // get current date
    }

    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var weekStart = new Date(curr.setDate(first));
    weekStart.setSeconds(0);
    weekStart.setHours(0);
    weekStart.setMinutes(0);
    weekStart.setMilliseconds(0);


    var weekEnd = new Date(curr.setDate(last));
    weekEnd.setHours(23);
    weekEnd.setMinutes(59);
    weekEnd.setSeconds(59);
    weekEnd.setMilliseconds(999);

    var week = {weekStart : weekStart, weekEnd : weekEnd};
    return week;
}



prettifyPercentage = function(number, decimals){
    var temp = number * Math.pow(10, decimals);
    temp = (temp.toFixed(decimals));
    return temp;

}

ColorLuminance = function(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}


createAFunctionForGradient = function(){

    var table = ['FFFFFF','E5F7F8','CCF0F1','B2E9EB','99E1E4','7FDADE','66D3D7','4CCBD0','33C4CA','19BDC3','00B6BD'];
    var change = 1/(table.length-1);
    var string = ""
    var temp = 0;
    for(var i = 0; i < table.length; i++){
        string += "{ pct: " + temp + ", color: { r: 0x" + table[i].substr(0,2) +", g: 0x" + table[i].substr(2,2) +", b: 0x" + table[i].substr(4,2) +" } },\n"
        temp += change;
    }
}

percentColorsNegative = [
    { pct: 0, color: { r: 0xFF, g: 0xFF, b: 0xFF } },
    { pct: 0.1, color: { r: 0xFD, g: 0xEF, b: 0xEE } },
    { pct: 0.2, color: { r: 0xFB, g: 0xE0, b: 0xDE } },
    { pct: 0.3, color: { r: 0xF9, g: 0xD0, b: 0xCE } },
    { pct: 0.4, color: { r: 0xF8, g: 0xC1, b: 0xBD } },
    { pct: 0.5, color: { r: 0xF6, g: 0xB1, b: 0xAD } },
    { pct: 0.6, color: { r: 0xF4, g: 0xA2, b: 0x9D } },
    { pct: 0.7, color: { r: 0xF3, g: 0x92, b: 0x8C } },
    { pct: 0.8, color: { r: 0xF1, g: 0x83, b: 0x7C } },
    { pct: 0.9, color: { r: 0xEF, g: 0x73, b: 0x6C } },
    { pct: 1, color: { r: 0xEE, g: 0x64, b: 0x5C } }
];

percentColorsPositive = [
    { pct: 0, color: { r: 0xFF, g: 0xFF, b: 0xFF } },
    { pct: 0.1, color: { r: 0xE5, g: 0xF7, b: 0xF8 } },
    { pct: 0.2, color: { r: 0xCC, g: 0xF0, b: 0xF1 } },
    { pct: 0.3, color: { r: 0xB2, g: 0xE9, b: 0xEB } },
    { pct: 0.4, color: { r: 0x99, g: 0xE1, b: 0xE4 } },
    { pct: 0.5, color: { r: 0x7F, g: 0xDA, b: 0xDE } },
    { pct: 0.6, color: { r: 0x66, g: 0xD3, b: 0xD7 } },
    { pct: 0.7, color: { r: 0x4C, g: 0xCB, b: 0xD0 } },
    { pct: 0.8, color: { r: 0x33, g: 0xC4, b: 0xCA } },
    { pct: 0.9, color: { r: 0x19, g: 0xBD, b: 0xC3 } },
    { pct: 1, color: { r: 0x00, g: 0xB6, b: 0xBD } }
];


percentColors = [
    { pct: 0, color: { r: 0xFF, g: 0xFF, b: 0xFF } },
    { pct: 0.1, color: { r: 0xF1, g: 0xFF, b: 0xE5 } },
    { pct: 0.2, color: { r: 0xE3, g: 0xFF, b: 0xCC } },
    { pct: 0.3, color: { r: 0xD6, g: 0xFF, b: 0xB2 } },
    { pct: 0.4, color: { r: 0xC8, g: 0xFF, b: 0x99 } },
    { pct: 0.5, color: { r: 0xBB, g: 0xFF, b: 0x7F } },
    { pct: 0.6, color: { r: 0xAD, g: 0xFF, b: 0x66 } },
    { pct: 0.7, color: { r: 0x9F, g: 0xFF, b: 0x4C } },
    { pct: 0.8, color: { r: 0x92, g: 0xFF, b: 0x33 } },
    { pct: 0.9, color: { r: 0x84, g: 0xFF, b: 0x19 } },
    { pct: 1, color: { r: 0x77, g: 0xFF, b: 0x00 } },
];

getColorForPercentageNegative = function(pct) {
    for (var i = 0; i < percentColorsNegative.length; i++) {
        if (pct <= percentColorsNegative[i].pct) {
            var lower = percentColorsNegative[i - 1] || { pct: 0.1, color: { r: 0x0, g: 0x00, b: 0 } };
            var upper = percentColorsNegative[i];
            var range = upper.pct - lower.pct;
            var rangePct = (pct - lower.pct) / range;
            var pctLower = 1 - rangePct;
            var pctUpper = rangePct;
            var color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            };
            return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
        }
    }
}

getColorForPercentagePositive = function(pct) {
    for (var i = 0; i < percentColorsPositive.length; i++) {
        if (pct <= percentColorsPositive[i].pct) {
            var lower = percentColorsPositive[i - 1] || { pct: 0.1, color: { r: 0x0, g: 0x00, b: 0 } };
            var upper = percentColorsPositive[i];
            var range = upper.pct - lower.pct;
            var rangePct = (pct - lower.pct) / range;
            var pctLower = 1 - rangePct;
            var pctUpper = rangePct;
            var color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            };
            return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
        }
    }
}

getColor = function(value){
    //value from 0 to 1
    var hue=((value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

roughSizeOfObject = function( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

memorySizeOf = function (obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
                case 'number':
                    bytes += 8;
                    break;
                case 'string':
                    bytes += obj.length * 2;
                    break;
                case 'boolean':
                    bytes += 4;
                    break;
                case 'object':
                    var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                    if(objClass === 'Object' || objClass === 'Array') {
                        for(var key in obj) {
                            if(!obj.hasOwnProperty(key)) continue;
                            sizeOf(obj[key]);
                        }
                    } else bytes += obj.toString().length * 2;
                    break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};

capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

merge_options = function(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}