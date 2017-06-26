import AdminEvent from "/client/templates/AdminEvent/AdminEvent.jsx";
import LGS from "/client/templates/LGS/LGS.jsx";
import MetaDeckListComponent from "/client/templates/deck/MetaDeckList/MetaDeckListComponent.jsx";
import CustomAdmin from "/client/templates/customAdmin/CustomAdmin.jsx";
import CustomEventsAdmin from "/client/templates/customAdmin/CustomEventsAdmin/CustomEventsAdmin.jsx";
import SelectedEventContainer from "/client/templates/event/SelectedEvent/SelectedEventContainer.jsx";
import ArchetypeDeckInformationContainer from "/client/templates/deck/ArchetypeDeckInformation/ArchetypeDeckInformationContainer.jsx";
import MetaContainer from           "/client/templates/meta/MetaContainer.jsx";
import LatestDecks from           "/client/templates/main/LatestDecksReact/LatestDecks.jsx";
import TopMenuContainer from           "/client/templates/menu/TopMenu/TopMenuContainer.jsx";
import EventsTableComponent from           "/client/templates/event/EventsTableReact/EventsTableContainer.jsx";
import BigEventsCalendarContainer from           "/client/templates/event/eventsCalendar/BigEventsCalendarContainer.jsx";
import User                         from    "/client/templates/User/User";
import FormatsMenu from "/client/templates/menu/formatsMenu/FormatsMenu.jsx";
import FormsyNamoro from "/client/templates/FormsyNamoro/FormsyNamoro"
import SevenDayCalendar from "/client/templates/main/SevenDayCalendar/SevenDayCalendar.jsx"
import LinksT from "/client/templates/Links.jsx";
import Footer from "/client/templates/Footer/Footer.jsx";


Template.ApplicationLayout.onCreated(function(){
    this.subscribe("DecksNamesGlobal");
    this.subscribe("DecksArchetypesGlobal");
    this.subscribe("EventsTypes");
    this.subscribe("Formats");

    this.state = new ReactiveDict;
    this.state.set("selected", null);

    this.autorun(()=>{
        this.subscribe("UserCollectionPublish", {
            onReady(){
                updateCollectionNumbersFunction();
            },
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
    },
    FormatsMenu(){
        return FormatsMenu;
    },
    Footer(){
        return Footer;
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
        return LatestDecks;
    },
    FormsyNamoro(){
        return FormsyNamoro;
    },
    SevenDayCalendar(){
        return SevenDayCalendar;
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
        return AddEventContainer;
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
    ArchetypeDeckInformationContainer(){
        return ArchetypeDeckInformationContainer;
    },
});

Template.Links.helpers({
    Links(){
        return LinksT;
    }
});

import FAQ from "/client/templates/Footer/FAQ/FAQ"
Template.FAQ.helpers({
    FAQ(){
        return FAQ;
    }
})

import CompanyInformation from "/client/templates/Footer/CompanyInformation/CompanyInformation"
Template.FAQ.helpers({CompanyInformation(){ return CompanyInformation; }})

import UsersDecks from "/client/templates/PublicUsersDecks/PublicUsersDecks.jsx";
Template.UsersDecks.helpers({ UsersDecks(){ return UsersDecks; }})