import React from 'react' ;

export default class TopMenu extends React.Component {
    constructor(){
        super();
    }

    getError(){
        if(this.props.positionOption == "GPS"){
            if(!Session.get("position")){
                return "GPS Disabled";
            }
        }else if(this.props.positionOption == "state"){
            if(!this.props.state){
                return "Choose State";
            }
        }else if(this.props.positionOption == "ZIP") {
            console.log(this.props.ZIP);
            console.log(typeof this.props.ZIP);

            if(this.props.ZIP == "false"){
                return "Bad ZIP";
            }
        }
    }

    activatedlink(selected){
        return selected == this.props.activatedlink ? "active" : null;
    }

    changeZip(e){

        if(e.target.value.length == 5){
            var ZIP = parseInt(e.target.value);
            Meteor.call("checkIfZipExists", ZIP, (err, data)=>{
                var cookies = new Cookies();
                if(data){
                    cookies.set("ZIP", ZIP)
                    Session.set("ZIP", ZIP)
                }else{
                    cookies.set("ZIP", "false")
                    Session.set("ZIP", "false")
                }
            })
        }
    }

    stateChange(e){
        var cookies = new Cookies();
        cookies.set("state", e.target.value);
        Session.set("state", e.target.value);
    }

    getPositionOption(){
        if(Session.get("positionOption") == "GPS"){
            return <input onChange={this.changeDistance} value={this.props.distance} className="distanceNumber" min="0" type="number"/>
        }else if(Session.get("positionOption") == "state"){
            const states = ['', 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO',
                            'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU',
                            'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
                            'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN',
                            'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                            'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK',
                            'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD',
                            'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA',
                            'WV', 'WI', 'WY', 'AE', 'AA', 'AP']

            return <select onChange={this.stateChange} value={this.props.state}> {states.map((state)=>{
                                return <option key={state} value={state}> {state}</option>
                            })}
                </select>
        }else if(Session.get("positionOption") == "ZIP"){ return <span><input onChange={this.changeZip} defaultValue={this.props.ZIP} className="zipNumber" min="0" type="number"/>Distance : <input onChange={this.changeDistance} value={this.props.distance} className="distanceNumber" min="0" type="number"/></span>
        }
    }

    changedOption(e){
        var cookies = new Cookies();
        cookies.set("positionOption", e.target.value);
        Session.set("positionOption", e.target.value);
    }

    url(path){
        return FlowRouter.path(path, {format : this.props.format});
    }

    changeDistance(e){
        var cookies = new Cookies();
        cookies.set("distance", e.target.value)
        Session.set("distance", e.target.value)
    }

    logOut(){
        Meteor.logout(()=> {
            FlowRouter.go('/');
        });
    }

    checkedOption(option){
        if(Session.get("positionOption")){
            return true;
        }
        return false;
    }

    render(){
        var menu = [
            {value : "main", path : "main", text : "Main"},
            {value : "decks", path : "decks", text : "Decks"},
            {value : "meta", path : "selectedMeta", text : "Meta"},
            {value : "events", path : "events", text : "Events"},
            {value : "lgs", path : "lgs", text : "LGS"},
            {value : "addEvent", path : "addEvent", text : "Add Event"},
        ]
        return(
            <div className="TopMenuComponent">
                <nav className="navbar navbar-default navbar-static-top navbar-height">
                    <div className="row">
                        <div className="col-xs-7">
                            <div className="collapse navbar-collapse">
                                <ul className="nav navbar-nav">
                                    {menu.map((link)=>{
                                        return <li key={link.value} className={this.activatedlink(link.value)}><a href={this.url(link.path)}>{link.text}</a></li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="col-xs-5">
                            <div className="row">
                                <div className="positionLoginDistanceWrapper">
                                    <span className="error">{this.getError()}</span>
                                    <span className="distance">
                                        <select onChange={this.changedOption} value={Session.get("positionOption")}>
                                            <option value="GPS">GPS</option>
                                            <option value="state">State</option>
                                            <option value="ZIP">ZIP</option>
                                        </select>
                                        {this.getPositionOption()}
                                    </span>
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
                    </div>
                </nav>
            </div>
        );
    }
}