String.prototype.toTitleCase = function(){
    var smallWords = /^(a|an|and|as|at|but|by|from|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
        if (index > 0 && index + match.length !== title.length &&
            match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
            (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
            title.charAt(index - 1).search(/[^\s-]/) < 0) {
            return match.toLowerCase();
        }

        if (match.substr(1).search(/[A-Z]|\../) > -1) {
            return match;
        }

        return match.charAt(0).toUpperCase() + match.substr(1);
    });
};


if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

// Object.prototype.equals = function(object2) {
//     //For the first loop, we only check for types
//     for (propName in this) {
//         //Check for inherited methods and properties - like .equals itself
//         //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
//         //Return false if the return value is different
//         if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
//             return false;
//         }
//         //Check instance type
//         else if (typeof this[propName] != typeof object2[propName]) {
//             //Different types => not equal
//             return false;
//         }
//     }
//     //Now a deeper check using other objects property names
//     for(propName in object2) {
//         //We must check instances anyway, there may be a property that only exists in object2
//         //I wonder, if remembering the checked values from the first loop would be faster or not
//         if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
//             return false;
//         }
//         else if (typeof this[propName] != typeof object2[propName]) {
//             return false;
//         }
//         //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
//         if(!this.hasOwnProperty(propName))
//             continue;
//
//         //Now the detail check and recursion
//
//         //This returns the script back to the array comparing
//         /**REQUIRES Array.equals**/
//         if (this[propName] instanceof Array && object2[propName] instanceof Array) {
//             // recurse into the nested arrays
//             if (!this[propName].equals(object2[propName]))
//                 return false;
//         }
//         else if (this[propName] instanceof Object && object2[propName] instanceof Object) {
//             // recurse into another objects
//             //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
//             if (!this[propName].equals(object2[propName]))
//                 return false;
//         }
//         //Normal value comparison for strings and numbers
//         else if(this[propName] != object2[propName]) {
//             return false;
//         }
//     }
//     //If everything passed, let's say YES
//     return true;
// }
//
// Object.defineProperty(Array.prototype, "equals", {enumerable: false});
