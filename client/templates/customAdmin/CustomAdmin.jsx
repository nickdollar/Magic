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
import CustomCardsCollectionSimplifiedAdmin from './CustomCardsCollectionSimplifiedAdmin/CustomCardsCollectionSimplifiedAdmin.jsx';
import CustomNewestAdmin from './CustomNewestMetaAdmin/CustomNewestAdmin.jsx';
import CustomTCGPlayerCardsDailyPricesAdmin from './CustomTCGPlayerCardsDailyPricesAdmin/CustomTCGPlayerCardsDailyPricesAdmin.jsx';
import CustomTCGPlayerCardsFullDataAdmin from './CustomTCGPlayerCardsFullDataAdmin/CustomTCGPlayerCardsFullDataAdmin';

export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {Formats_id : "sta"};
    }

    routes(route){
        if(route=="Events"){
            return <CustomEventsAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="CardsDatabase"){
            return <CustomCardsDatabaseAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="DecksNames"){
            return <CustomDecksNamesAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="DecksArchetypes"){
            return <CustomDecksArchetypesAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="DecksData"){
            return <CustomDecksDataAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="CardsDatabase"){
            return <CustomDecksDatabaseAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="LGS"){
            return <CustomLGSAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="LGSEvents"){
            return <CustomLGSEventsAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="EventsCalendar"){
            return <CustomEventsCalendarAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="ZipCodes"){
            return <CustomZipCodesAdmin/>
        }else if (route=="CardsFullData"){
            return <CustomCardsFullDataAdmin/>
        }else if (route=="CardsCollectionSimplified"){
            return <CustomCardsCollectionSimplifiedAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="MetaNewest"){
            return <CustomNewestAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="TCGPlayerCardsDailyPrices"){
            return <CustomTCGPlayerCardsDailyPricesAdmin Formats_id={this.state.Formats_id}/>
        }else if (route=="TCGPlayerCardsFullData"){
            return <CustomTCGPlayerCardsFullDataAdmin Formats_id={this.state.Formats_id}/>
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
        var collections = [ "Events", "CardsDatabase", "DecksNames", "DecksArchetypes",
                            "DecksData", "LGS", "LGSEvents", "EventsCalendar", "ZipCodes", "CardsFullData",
                            "CardsCollectionSimplified", "MetaNewest", "TCGPlayerCardsDailyPrices", "TCGPlayerCardsFullData"];
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
                        {Formats.find({}).map(format=>{
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
