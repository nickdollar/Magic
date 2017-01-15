import React from 'react' ;
import CustomEventsAdmin from './CustomEventsAdmin/CustomEventsAdmin.jsx';



export default class CustomAdmin extends React.Component{


    constructor(props){
        super();
        this.state = {};
    }

    routes(route){
        if(route=="events"){
            return <CustomEventsAdmin/>
        }
    }

    closeNav(){
        this.refs["mySideNav"].style.display = "none";
        console.log("close");
    }

    render(){

        var collections = ["events"];
        return (
            <div className="row">
                <div ref="mySideNav" className="sidenav col-xs-2">
                    <a href={FlowRouter.path("admin")}>Main</a>
                    {collections.map((collection)=>{
                        return <a key="collection" href={FlowRouter.path("admin", {collection : collection})}>{collection}</a>
                    })}
                </div>
                <div className="col-xs-10">
                    {this.routes(FlowRouter.getParam("collection"))}
                </div>
            </div>
        )
    }
}
