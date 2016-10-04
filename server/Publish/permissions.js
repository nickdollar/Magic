Images.allow({
    'insert': function () {
        // add custom authentication code here
        return true;
    },
    download: function(userId, fileObj) {
        return true
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});

