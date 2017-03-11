import React from 'react' ;
import CustomEventsAdmin from './CustomEventsAdmin/CustomEventsAdmin.jsx';
import CustomCardsDatabaseAdmin from './CustomCardsDatabaseAdmin/CustomCardsDatabaseAdmin.jsx';
import CustomDecksNamesAdmin from './CustomDecksNamesAdmin/CustomDecksNamesAdmin.jsx';
import CustomDecksArchetypesAdmin from './CustomDecksArchetypesAdmin/CustomDecksArchetypesAdmin.jsx';
import CustomDecksDataAdmin from './CustomDecksDataAdmin/CustomDecksDataAdmin.jsx';
import CustomDecksDatabaseAdmin from './CustomDecksDatabaseAdmin/CustomDecksDatabaseAdmin.jsx';
import CustomLGSAdmin from './CustomLGSAdmin/CustomLGSAdmin.jsx';
import CustomLGSEventsAdmin from './CustomLGSEventsAdmin/CustomLGSEventsAdmin.jsx';
import CustomEventsCalendarAdmin from './CustomEventsCalendarAdmin/CustomEventsCalendarAdmin.jsx';
import CustomZipCodesAdmin from './CustomZipCodesAdmin/CustomZipCodesAdmin.jsx';
import CustomCardsFullDataAdmin from './CustomCardsFullDataAdmin/CustomCardsFullDataAdmin.jsx';
import CustomArchetypesShellsAdmin from './CustomArchetypesShellsAdmin/CustomArchetypesShells.jsx';



export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {format : "standard"};
    }

    routes(route){
        if(route=="Events"){
            return <CustomEventsAdmin format={this.state.format}/>
        }else if (route=="CardsDatabase"){
            return <CustomCardsDatabaseAdmin format={this.state.format}/>
        }else if (route=="DecksNames"){
            return <CustomDecksNamesAdmin format={this.state.format}/>
        }else if (route=="DecksArchetypes"){
            return <CustomDecksArchetypesAdmin format={this.state.format}/>
        }else if (route=="DecksData"){
            return <CustomDecksDataAdmin format={this.state.format}/>
        }else if (route=="CardsDatabase"){
            return <CustomDecksDatabaseAdmin format={this.state.format}/>
        }else if (route=="LGS"){
            return <CustomLGSAdmin format={this.state.format}/>
        }else if (route=="LGSEvents"){
            return <CustomLGSEventsAdmin format={this.state.format}/>
        }else if (route=="EventsCalendar"){
            return <CustomEventsCalendarAdmin format={this.state.format}/>
        }else if (route=="ZipCodes"){
            return <CustomZipCodesAdmin/>
        }else if (route=="CardsFullData"){
            return <CustomCardsFullDataAdmin/>
        }else if (route=="ArchetypesShells"){
            return <CustomArchetypesShellsAdmin format={this.state.format}/>
        }
    }

    closeNav(){
        this.refs["mySideNav"].style.display = "none";
    }


    defaultRadio(opt){
        if(opt == this.state.format){
            return true
        }
        return false;
    }

    formatChange(e){
        this.setState({format : e});
    }

    render(){
        var formats = ["standard", "modern", "legacy", "vintage"];
        var collections = [ "Events", "CardsDatabase", "DecksNames", "DecksArchetypes",
                            "DecksData", "LGS", "LGSEvents", "EventsCalendar", "ZipCodes", "CardsFullData", "ArchetypesShells"];
        collections.sort()
        return (
            <div className="CustomAdminComponent">
                <div ref="mySideNav" className="sidenav col-xs-2">
                    <a href={FlowRouter.path("admin")}>Main</a>
                    {collections.map((collection)=>{
                        return <a key={collection} href={FlowRouter.path("admin", {collection : collection})}>{collection}</a>
                    })}
                </div>
                <div className="col-xs-10">
                    <div className="row">
                        {formats.map((opt)=>{
                            return <label key={opt} className="radio-inline"><input onChange={this.formatChange.bind(this, opt)}
                                                                                    checked={this.defaultRadio(opt)} type="radio"
                                                                                    value={opt}/>{opt}</label>
                        })}
                        {this.routes(FlowRouter.getParam("collection"))}
                    </div>
                </div>
            </div>
        )
    }
}
