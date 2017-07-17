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
            Meteor.call("setUsersProfileDCINumber", {DCINumber : target.value}, (err, response)=>{
                this.setState({savedDisplay : "block"})
            })
        }, 1500);
    }

    setPreferredNameMethod({target}){
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
        return(
            <div className="PlayerInfoComponent">
                <ul className="form-list">
                    <li className="form-list__item"><div className="form-list__item-name">Preferred Name:</div><input onChange={(event)=>this.setPreferredNameMethod({target : event.target})} defaultValue={UsersProfile.findOne().preferredName} type="text"/></li>
                    <li className="form-list__item"><div className="form-list__item-name">DCI Number:</div><input onChange={(event)=>this.setDCINumber({target : event.target})} type="text"  defaultValue={UsersProfile.findOne().DCINumber}/></li>
                    <div ref="saved" style={{display : this.state.savedDisplay}}>Saved!</div>
                </ul>
            </div>
        );
    }
}