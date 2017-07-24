import React from 'react' ;

var timer = {};


export default class PlayerInfo extends React.Component {
    constructor(){
        super();
        this.state = {savedDisplay : "none"};
    }


    setDCINumber({target}){

        window.clearTimeout(timer["DCINumber"]);
        if(this.state.savedDisplay != "none"){
            this.setState({savedDisplay : "none"})
        }
        timer["DCINumber"] = window.setTimeout(()=>{
            Meteor.call("setUsersProfileDCINumberMethod", {DCINumber : target.value}, (err, response)=>{
                this.setState({savedDisplay : "block"})
            })
        }, 1500);
    }

    setName({target}){

        window.clearTimeout(timer["name"]);
        if(this.state.savedDisplay != "none"){
            this.setState({savedDisplay : "none"})
        }
        timer["name"] = window.setTimeout(()=>{
            Meteor.call("setNameMethod", {name : target.value}, (err, response)=>{
                this.setState({savedDisplay : "block"})
            })
        }, 1500);
    }

    setPreferredName({target}){
        window.clearTimeout(timer["preferredName"]);
        if(this.state.savedDisplay != "none"){
            this.setState({savedDisplay : "none"})
        }
        timer["preferredName"] = window.setTimeout(()=>{
            Meteor.call("setPreferredNameMethod", {preferredName : target.value}, (err, response)=>{
                this.setState({savedDisplay : "block"})
            })
        }, 1500);
    }

    render(){

        var profiles = UsersProfile.findOne();
        if(!profiles){
            profiles = {preferredName : "", DCINumber : "", name : ""};
        }

        return(
            <div className="PlayerInfoComponent">
                <ul className="form-list">
                    <li className="form-list__item"><div className="form-list__item-name">Name:</div><input onChange={(event)=>this.setName({target : event.target})} defaultValue={profiles.name} type="text"/></li>
                    <li className="form-list__item"><div className="form-list__item-name">Preferred Name:</div><input onChange={(event)=>this.setPreferredName({target : event.target})} defaultValue={profiles.preferredName} type="text"/></li>
                    <li className="form-list__item"><div className="form-list__item-name">DCI Number:</div><input onChange={(event)=>this.setDCINumber({target : event.target})} type="text"  defaultValue={profiles.DCINumber}/></li>
                    <div ref="saved" style={{display : this.state.savedDisplay}}>Saved!</div>
                </ul>
            </div>
        );
    }
}