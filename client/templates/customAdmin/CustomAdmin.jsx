import React from 'react' ;
import CustomEventsAdmin from './CustomEventsAdmin/CustomEventsAdmin.jsx';
import CustomDecksArchetypesAdmin from './CustomDecksArchetypesAdmin/CustomDecksArchetypesAdmin.jsx';
import CustomDecksDataAdmin from './CustomDecksDataAdmin/CustomDecksDataAdmin.jsx';
import CustomLGSAdmin from './CustomLGSAdmin/CustomLGSAdmin.jsx';
import CustomLGSEventsAdmin from './CustomLGSEventsAdmin/CustomLGSEventsAdmin.jsx';
import CustomEventsCalendarAdmin from './CustomEventsCalendarAdmin/CustomEventsCalendarAdmin.jsx';
import CustomZipCodesAdmin from './CustomZipCodesAdmin/CustomZipCodesAdmin.jsx';
import CustomCardsSimpleAdmin from './CustomCardsSimpleAdmin/CustomCardsSimpleAdmin.jsx';
import CustomNewestAdmin from './CustomNewestMetaAdmin/CustomNewestAdmin.jsx';
import CustomCardsAdmin from './CustomCardsAdmin/CustomCardsAdmin.jsx';
import Workbench from './Workbench/Workbench.jsx';
import CustomTCGPricesAdmin from './CustomTCGPricesAdmin/CustomTCGPricesAdmin.jsx';
import CustomUsersCollectionAdmin from './CustomUsersCollectionAdmin/CustomUsersCollectionAdmin.jsx';
import CustomCardsUniqueAdmin from './CustomCardsUniqueAdmin/CustomCardsUniqueAdmin.jsx';
import CustomStartUpAdmin from './CustomStartUpAdmin/CustomStartUpAdmin.jsx';
import CustomMetaLastDaysAdditions from './CustomMetaLastDaysAdditions/CustomMetaLastDaysAdditions.jsx';


export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        var formats = Formats.find({}).map((format)=>{
            return {_id : format._id, name : format.name};
        })
        this.state = {Formats_id : "sta", formats : formats};
    }

    routes(route){
        if(route=="Events"){
            return <CustomEventsAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="DecksArchetypes"){
            return <CustomDecksArchetypesAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="DecksData"){
            return <CustomDecksDataAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="LGS"){
            return <CustomLGSAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="LGSEvents"){
            return <CustomLGSEventsAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="EventsCalendar"){
            return <CustomEventsCalendarAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="ZipCodes"){
            return <CustomZipCodesAdmin/>
        }else if (route=="CardsSimple"){
            return <CustomCardsSimpleAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="MetaNewest"){
            return <CustomNewestAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="Cards"){
            return <CustomCardsAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="Workbench"){
            return <Workbench/>
        }else if (route=="TCGPrices"){
            return <CustomTCGPricesAdmin/>
        }else if (route=="UsersCollection"){
            return <CustomUsersCollectionAdmin/>
        }else if (route=="CardsUnique"){
            return <CustomCardsUniqueAdmin/>
        }else if (route=="StartUp"){
            return <CustomStartUpAdmin/>
        }else if (route=="MetaLastDaysAdditions"){
            return <CustomMetaLastDaysAdditions/>
        }
    }

    closeNav(){
        this.refs["mySideNav"].style.display = "none";
    }


    defaultRadio(opt){
        if(opt == this.state.Formats_id){
            return true
        }
        return false;
    }

    formatChange(e){
        this.setState({Formats_id : e});
    }

    render(){
        var collections = [ "Cards", "Events", "DecksNames", "DecksArchetypes",
                            "DecksData", "LGS", "LGSEvents", "EventsCalendar", "ZipCodes", "MetaLastDaysAdditions",
                            "CardsSimple", "MetaNewest", "Sets", "TCGPrices", "UsersCollection", "CardsUnique"];
        collections.sort()
        return (
            <div className="CustomAdminComponent">
                <div ref="mySideNav" className="sidenav col-xs-2">
                    <a href={FlowRouter.path("admin", {collection : "Workbench"})}>Workbench</a>
                    <a href={FlowRouter.path("admin", {collection : "StartUp"})}>StartUp</a>
                    <a href={FlowRouter.path("admin")}>Main</a>
                    {collections.map((collection)=>{
                        return <a key={collection} href={FlowRouter.path("admin", {collection : collection})}>{collection}</a>
                    })}
                </div>
                <div className="col-xs-10">
                    <div className="row">
                        {this.state.formats.map(format=>{
                            return <label key={format._id} className="radio-inline"><input onChange={this.formatChange.bind(this, format._id)}
                                                                                    checked={this.defaultRadio(format._id)} type="radio"
                                                                                    value={format._id}/>{format.name}</label>
                        })}
                        {this.routes(FlowRouter.getParam("collection"))}
                    </div>
                </div>
            </div>
        )
    }
}
