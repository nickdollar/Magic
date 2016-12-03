Meteor.startup(function () {
    AdminDashboard.addCollectionItem(function (collection, path) {
        return {
            title: 'Delete',
            url: path + '/delete'
        };
    });

    AdminDashboard.addCollectionItem(function (collection, path) {
        if (collection === 'DecksData' || collection === 'DecksDataUniqueWithoutQuantity') {
            return {
                title: 'add Names',
                url: path + '/addNames'
            };
        }
    });

    AdminDashboard.addCollectionItem(function (collection, path) {
        if (collection === 'DecksData') {
            return {
                title: 'add Names Audit',
                url: path + '/addNamesAudit'
            };
        }
    });

    AdminDashboard.addCollectionItem(function (collection, path) {
        return {
            title: 'fix',
            url: path + '/fix'
        };
    });

    AdminDashboard.addCollectionItem(function (collection, path) {
        if(collection === "CardsFullData"){
            return {

                    title: 'Update Whole Database',
                    url: path + '/updateWholeDatabase'
            };
        }
    });
});
