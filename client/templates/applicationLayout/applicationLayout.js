import AddEvent from "/client/templates/addEvent/AddEvent.jsx";
import AdminEvent from "/client/templates/AdminEvent/AdminEvent.jsx";
import LGS from "/client/templates/LGS/LGS.jsx";
import MetaDeckListComponent from "/client/templates/deck/MetaDeckList/MetaDeckListComponent.jsx";
import CustomAdmin from "/client/templates/customAdmin/CustomAdmin.jsx";
import CustomEventsAdmin from "/client/templates/customAdmin/CustomEventsAdmin/CustomEventsAdmin.jsx";
import SelectedEventContainer from "/client/templates/event/SelectedEvent/SelectedEventContainer.jsx";
import ArchetypeDeckInformation from "/client/templates/deck/ArchetypeDeckInformation/ArchetypeDeckInformation.jsx";
import MetaContainer from           "/client/templates/meta/MetaContainer.jsx";
import LatestDecksContainer from           "/client/templates/main/LatestDecksReact/LatestDecksContainer.jsx";
import TopMenuContainer from           "/client/templates/menu/TopMenu/TopMenuContainer.jsx";
import EventsTableComponent from           "/client/templates/event/EventsTableReact/EventsTableContainer.jsx";
import BigEventsCalendarContainer from           "/client/templates/event/eventsCalendar/BigEventsCalendarContainer.jsx";
import User                         from    "/client/templates/User/User";



Template.ApplicationLayout.onCreated(function(){
    this.subscribe("DecksNamesGlobal");
    this.subscribe("DecksArchetypesGlobal");

    this.state = new ReactiveDict;
    this.state.set("selected", null);

    this.autorun(()=>{
        this.subscribe("UserCollection", {
            onReady(){
                var objects = UsersCollection.find({Users_id : Meteor.userId()}, {limit : 1}).fetch();
                var cardsObjects = {};
                if(objects.length){
                    for(var i = 0; i < objects[0].cards.length; ++i){
                        var cardName = objects[0].cards[i].name;
                        var qty = objects[0].cards[i].qty;
                        if(!cardsObjects[cardName]){
                            cardsObjects[cardName] = 0;
                        }
                        cardsObjects[cardName] += qty;
                    }
                }
                Session.set("cards", cardsObjects);
            }
        });
    })
});

Template.ApplicationLayout.helpers({
    subscriptionsReady (){
        return Template.instance().subscriptionsReady();
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
    TopMenuContainer(){
      return TopMenuContainer;
    },
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

Template.selectedMeta.helpers({
    MetaContainer(){
        return MetaContainer;
    }
});

Template.User.helpers({
    User(){
        return User;
    }
});

Template.main.helpers({
    LatestDecks(){
        return LatestDecksContainer;
    }
})

Template.events.helpers({
    EventsTableComponent(){
        return EventsTableComponent;
    },
    BigEventsCalendarContainer(){
        return BigEventsCalendarContainer
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

Template.selectedEvent.helpers({
    selectedEvent(){
        return SelectedEventContainer;
    },
});

Template.ArchetypeDeckInformation.helpers({
    ArchetypeDeckInformation(){
        return ArchetypeDeckInformation;
    },
});