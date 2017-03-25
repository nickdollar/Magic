import React from 'react' ;
import LGSLocation from "./LGSLocation/LGSLocation.jsx";

export default class TopMenu extends React.Component {
    constructor(){
        super();
    }

    activatedlink(selected){
        return selected == this.props.activatedlink ? "active" : null;
    }

    url(path){
        return FlowRouter.path(path, {format : this.props.format});
    }



    logOut(){
        Meteor.logout(()=> {
            FlowRouter.go('/');
        });
    }



    render(){
        var menu = [
            {value : "main", path : "main", text : "Main"},
            {value : "decks", path : "decks", text : "Decks"},
            {value : "meta", path : "selectedMeta", text : "Meta"},
            {value : "events", path : "events", text : "Events"},
            {value : "lgs", path : "lgs", text : "LGS"},
            {value : "addEvent", path : "addEvent", text : "Add Event/Deck"},
        ]
        return(
            <div className="TopMenuComponent">
                <nav className="navbar navbar-default navbar-static-top navbar-height">
                    <div className="row">
                        <div className="col-xs-8">
                            <div className="collapse navbar-collapse">
                                <ul className="nav navbar-nav">
                                    {menu.map((link)=>{
                                        return <li key={link.value} className={this.activatedlink(link.value)}><a href={this.url(link.path)}>{link.text}</a></li>
                                    })}
                                    <li className={this.activatedlink("User")}><a href={this.url("User")}>User</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="positionLoginDistanceWrapper">
                                <div className="LGSLocation">
                                    <LGSLocation/>
                                </div>

                                <span className="topMenuLogin">
                                    {this.props.currentUser ? <button onClick={this.logOut} type="button" className="btn btn-primary btn-sm logout">
                                        Logout
                                        </button>
                                        : <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#loginModal">
                                            Login/Sign-up
                                        </button>
                                        }
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}