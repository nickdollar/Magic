import React from 'react' ;
import ReactDOM from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class LGSEventsCalendarModal extends TrackerReact(React.Component){
    componentDidMount(){
        $(ReactDOM.findDOMNode(this)).modal('show');
        $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
    }

    constructor(){
        super();
        this.state = {
            subscription : {
                LGS : Meteor.subscribe("LGS")
            }
        }
    }

    render(){
        var divs = [];

        if(this.props.eventObject.LGS_id){
            divs.push(<div key="LGS_id">
                <span className="rightTitle">Store:</span><span className="leftInformation">{LGS.findOne({_id : this.props.eventObject.LGS_id}).name} ({LGS.findOne({_id : this.props.eventObject.LGS_id}).location.city})</span>
            </div>)
        };
        
        if(this.props.eventObject.when){
            divs.push(<div key="when">
                <span className="rightTitle">When:</span><span className="leftInformation">{this.props.eventObject.when}</span>
            </div>)
        };

        if(this.props.eventObject.formats){
            divs.push(<div key="formats">
                <span className="rightTitle">Formats:</span><span className="leftInformation">{this.props.eventObject.formats}</span>
            </div>)
        };

        if(this.props.eventObject.price != null){
            var price;
            if(this.props.eventObject.price == 0){
                price = "Free"
            }else{
                price = this.props.eventObject.price;
            }
            divs.push(<div key="price">
                <span className="rightTitle">Price:</span><span className="leftInformation">{price}</span>
            </div>)
        };
        if(this.props.eventObject.rounds){
            divs.push(<div key="rounds">
                <span className="rightTitle">Rounds:</span><span className="leftInformation">{this.props.eventObject.rounds}</span>
            </div>)
        };

        if(this.props.eventObject.description){
            divs.push(<div key="description">
                <span className="rightTitle">Description:</span><span className="leftInformation">{this.props.eventObject.description}</span>
            </div>)
        };



        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.props.eventObject.title}</h4>
                        </div>
                        <div className="modal-body">
                            <div className="eventCalendarModal">
                                {divs.map((obj)=>{
                                    return obj
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LGSEventsCalendarModal;