import React from 'react' ;
import SubmitPasswordContainer from "./SubmitPasswordContainer.jsx";
import EventInfoContainer from "./EventInfoContainer.jsx";


class AdminEvent extends React.Component {
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

    render() {
        return (
            <div>
                {this.state.passwordCorrect ?
                    <EventInfoContainer /> :
                    <SubmitPasswordContainer confirmPassword={this.confirmPassword.bind(this)}/> }
            </div>
        )
    }
}

export default AdminEvent;