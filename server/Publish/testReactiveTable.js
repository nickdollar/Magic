// Insecure: entire collection will be available to all clients
ReactiveTable.publish("user-items", _Deck);
//// Publish only a subset of items with "show" set to true
//ReactiveTable.publish("some-items", Items, {"show": true});
//
//// Publish only to logged in users
//ReactiveTable.publish("all-items", function () {
//    if (this.userId) {
//        return Items;
//    } else {
//        return [];
//    }
//});
//
//// Publish only the current user's items
//ReactiveTable.publish("user-items", Items, function () {
//    return {"userId": this.userId};
//});