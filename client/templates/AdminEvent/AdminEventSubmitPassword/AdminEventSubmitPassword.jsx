import React from 'react' ;


class AdminEvent extends React.Component {
    constructor(){
        super();

    }

    checkPassword(){
        Meteor.call("checkIfEventPasswordIsRight", {password : this.refs["input"].value, _id : FlowRouter.getParam("Event_id")}, (error, data)=>{
            if(!data){
                this.refs["error"].textContainer = "Wrong Password";
                return;
            }
            this.props.confirmPassword();
        })
    }
    render() {
        var html;
        if(Events.find({_id : FlowRouter.getParam("Event_id")}).count()){
            html = <div className="form-group row">
                <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Event Password</label>
                <div className="col-xs-10">
                    <input className="form-control" ref="input" type="text" id="example-text-input"/>
                </div>
                <button onClick={this.checkPassword.bind(this)}>Submit</button>
                <span ref="error" className="error"></span>
            </div>
        }else{
            html = <div>Event Doesn't Exists</div>
        }


        return (
            <div className="AdminEventSubmitPasswordComponent">
                {html}
            </div>
        )
    }
}

export default AdminEvent;