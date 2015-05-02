
exports.compareVersionIDs = function(v1, v2){
    if (v1[0] == "r" && v2[0] == "r"){
        return (parseInt(v1.substring(1)) < parseInt(v2.substring(1)));
    } else if (v1[0] != "r" && v2[0] != "r"){
        return compareVersionNumbers(v1, v2);
    } else {
        throw new Error("Trying to compare nightly version number with stable ");
        
    }
}

function compareVersionNumbers (v1, v2) {

    var a = v2.split('.');
    var b = v1.split('.');

    for (var i = 0; i < a.length; ++i) {
        a[i] = Number(a[i]);
    }
    for (var i = 0; i < b.length; ++i) {
        b[i] = Number(b[i]);
    }
    if (a.length == 2) {
        a[2] = 0;
    }

    if (a[0] > b[0]) return true;
    if (a[0] < b[0]) return false;

    if (a[1] > b[1]) return true;
    if (a[1] < b[1]) return false;

    if (a[2] > b[2]) return true;
    if (a[2] < b[2]) return false;

    return true;
}
