Template.AdminDecksArchetypesEdit.onCreated(function(){


    this.subscribe('DecksNames');
});

Template.AdminDecksArchetypesEdit.helpers({
    editName : function(){
        return Schemas.DecksArchetypesName;
    },
    editFormat : function(){
        return Schemas.DecksArchetypesFormat;
    },
    editType : function(){
        return Schemas.DecksArchetypesType;
    },
    editDecksNames : function(){
        return Schemas.DecksArchetypesDecksNames;
    },
    editDecksNamesDefaultValue : function(){
        return {_id : ["BVBBBBB"]};
    },
    DecksArchetypes : function(){
        return Schemas.DecksArchetypes;
    },
    documentValue : function(){
        return DecksArchetypes.findOne({_id : Router.current().params._id});
    }
});

Template.AdminDecksArchetypesEdit.onRendered(function(){

});

if (typeof Schemas === 'undefined' || Schemas === null) {
    Schemas = {};
}

Schemas.DecksArchetypesName = new SimpleSchema({
    name : {
        type: String
    }
});

Schemas.DecksArchetypesFormat = new SimpleSchema({
    format : {
        type : String,
        allowedValues : ["Standard", "Modern", "Legacy", "Vintage"],
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "Standard", value: "standard"},
                    {label: "Modern", value: "modern"},
                    {label: "Legacy", value: "legacy"},
                    {label: "Vintage", value: "vintage"}
                ]
            }
        }
    }
});

Schemas.DecksArchetypesType = new SimpleSchema({
    type : {
        type : String,
        allowedValues : ["aggro", "combo", "control"],
        autoform : {
            type : "select",
            options : function (){
                return [
                    {label: "aggro", value: "Aggro"},
                    {label: "combo", value: "Combo"},
                    {label: "control", value: "Control"}
                ]
            }
        }
    }
});