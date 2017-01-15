import AddEvent from "/client/templates/addEvent/AddEvent.jsx";
import AdminEvent from "/client/templates/AdminEvent/AdminEvent.jsx";
import LGS from "/client/templates/LGS/LGS.jsx";
import MetaDeckListComponent from "/client/templates/deck/MetaDeckList/MetaDeckListComponent.jsx";
import CustomAdmin from "/client/templates/customAdmin/CustomAdmin.jsx";
import CustomEventsAdmin from "/client/templates/customAdmin/CustomEventsAdmin/CustomEventsAdmin.jsx";


navigator.geolocation.getCurrentPosition((location)=> {
    Session.set("position", [location.coords.longitude ,location.coords.latitude]);
});

Template.ApplicationLayout.onCreated(function(){
    this.subscribe("DecksNamesGlobal");
    this.subscribe("DecksArchetypesGlobal");
    this.state = new ReactiveDict;
    this.state.set("selected", null);
});

Template.ApplicationLayout.helpers({
    subscriptionsReady (){
        return Template.instance().subscriptionsReady();
    },
    UserAvatar() {
        return myComponent;
    },
    dropdown: function () {
        // Assuming this is https://github.com/fraserxu/react-dropdown, loaded
        // elsewhere in the project.
        return DropDown;
    },
    options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        {
            type: 'group', name: 'group1', items: [
            { value: 'three', label: 'Three' },
            { value: 'four', label: 'Four' }
        ]
        }
    ],
    selected: function () {
        return Template.instance().state.get("selected");
    },
    onChange: function () {
        var tmpl = Template.instance();
        return function (option) {
            tmpl.state.set("selected", option);
        }
    }
});

Template.deckSelected.helpers({
   isSelected : function(){
       return FlowRouter.getParam("deckSelected");
   }
});

Template.selectADeck.helpers({
    deckOrArchetype : function(){
        return Session.get("deckOrArchetype");
    }
})

Template.selectADeck.onRendered(function(){
    Session.set("deckOrArchetype", false);
});

Template.selectedMeta.onRendered(function(){

    //$("table").each(function(index){
    //    var length = 2;
    //    //if($(this).hasClass("20")){
    //    //    length = 20;
    //    //}
    //
    //    var oTable = $(this).DataTable({
    //        paging: true,
    //        searching : false,
    //        ordering : false,
    //        info : false,
    //        pagingType : "simple",
    //        lengthChange: false,
    //        pageLength : length,
    //        language: {
    //            paginate: {
    //                first: '>>',
    //                previous: '<',
    //                next: '>',
    //                last: '>>'
    //            }
    //        },
    //        dom:"<'row'<'col-sm-12'tp>>"
    //    });
    //
    //    $(this).closest(".customTable").find(".previous:first").click(function(){
    //        oTable.page('previous').draw(false);
    //    });
    //
    //    $(this).closest(".customTable").find(".next:first").click(function(){
    //        oTable.page('next').draw(false);
    //    });
    //
    //
    //});
    //
    //var table = $('#example2').DataTable({});
    //
    //$('#example2 tbody').on('click', 'td.details-control', function () {
    //    var tr = $(this).closest('tr');
    //    var row = table.row( tr );
    //    console.log("AVVVVVVVVVVVVVVV");
    //    if ( row.child.isShown() ) {
    //        console.log("ZZZZZZZZZZZZ");
    //        // This row is already open - close it
    //        row.child.hide();
    //        tr.removeClass('shown');
    //    }
    //    else {
    //        console.log("YYYYYYYYYYYYYY");s
    //        // Open this row
    //        row.child().show();
    //        tr.addClass('shown');
    //    }
    //} );


});

Template.events.helpers({
    test : function(){
        return {

        }
    }
});

Template.decks.helpers({
    MetaDeckList(){
        return MetaDeckListComponent;
    }
});


Template.events.onRendered(function(){
 });

Template.lgs.helpers({
    LGS(){
        return LGS;
    }
});

Template.addEvent.helpers({
    AddEvent(){
        return AddEvent;
    },
});

Template.adminEvent.helpers({
    AdminEvent(){
        return AdminEvent;
    },
});

Template.admin.helpers({
    CustomAdmin(){
        return CustomAdmin;
    },
});

Template.CustomEventsAdmin.helpers({
    CustomAdmin(){
        return CustomEventsAdmin;
    },
});