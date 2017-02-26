import React from 'react' ;
import AdminEventSubmitPasswordContainer from "./AdminEventSubmitPassword/AdminEventSubmitPasswordContainer.jsx";
import EventInfoContainer from "./AdminEventInfo/AdminEventInfoContainer.jsx";


export default class AdminEvent extends React.Component {
    constructor(){
        super();
        this.state = {
            passwordCorrect : false
        }

    }

    confirmPassword(){
        this.setState({
            passwordCorrect : true
        })
    }

    componentDidMount(){
        Meteor.call("checkIfAdmin", (err, data)=>{
            if(data){
                this.setState({passwordCorrect : true})
            }
        })
    }

    render() {
        return (
            <div className="AdminEventsComponent">
                {this.state.passwordCorrect ?
                    <EventInfoContainer /> :
                    <AdminEventSubmitPasswordContainer confirmPassword={this.confirmPassword.bind(this)}/> }
            </div>
        )
    }
}

