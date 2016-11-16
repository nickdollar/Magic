Template.AdminDecksArchetypesNew.onCreated(function(){
    this.subscribe('DecksNames');
});

Template.AdminDecksArchetypesNew.helpers({
    DecksArchetypesSchema : function(){
        return Schemas.DecksArchetypes;
    }
});

Template.AdminDecksArchetypesNew.onRendered(function(){

});

// if (typeof Schema === 'undefined' || Schema === null) {
//     Schema = {};
// }
//
// Schemas.DecksArchetypes = new SimpleSchema({
//     name : {
//         type: String
//     },
//     format : {
//         type : String,
//         allowedValues : ["Standard", "Modern", "Legacy", "Vintage"]
//
//     },
//     type : {
//         type : String,
//         allowedValues : ["Combo", "Control", "Aggro"]
//     },
//     DecksNames :{
//         type : Array
//     },
//     "DecksNames.$" : {
//         type: Object
//     },
//     "DecksNames.$._id" : {
//         type: String,
//         autoform : {
//             type: "select"
//         }
//     }
// });
