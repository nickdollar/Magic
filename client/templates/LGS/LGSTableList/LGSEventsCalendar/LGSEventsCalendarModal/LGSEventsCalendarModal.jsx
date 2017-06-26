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
        var trs = [];

        if(this.props.eventObject.LGS_id){
            trs.push(<tr key="LGS_id">
                <td className="rightTitle">Store:</td><td className="leftInformation">{LGS.findOne({_id : this.props.eventObject.LGS_id}).name} ({LGS.findOne({_id : this.props.eventObject.LGS_id}).location.city})</td>
            </tr>)
        };
        
        if(this.props.eventObject.when){
            trs.push(<tr key="when">
                <td className="rightTitle">When:</td><td className="leftInformation">{this.props.eventObject.when}</td>
            </tr>)
        };

        if(this.props.eventObject.formats){
            trs.push(<tr key="formats">
                <td className="rightTitle">Formats:</td><td className="leftInformation">{this.props.eventObject.formats}</td>
            </tr>)
        };

        if(this.props.eventObject.price != null){
            var price;
            if(this.props.eventObject.price == 0){
                price = "Free"
            }else{
                price = this.props.eventObject.price;
            }
            trs.push(<tr key="price">
                <td className="rightTitle">Price:</td><td className="leftInformation">{price}</td>
            </tr>)
        };
        if(this.props.eventObject.rounds){
            trs.push(<tr key="rounds">
                <td className="rightTitle">Rounds:</td><td className="leftInformation">{this.props.eventObject.rounds}</td>
            </tr>)
        };

        if(this.props.eventObject.description){
            trs.push(<tr key="description">
                <td className="rightTitle">Description:</td><td className="leftInformation"><div>{this.props.eventObject.description}</div></td>
            </tr>)
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
                                <table>
                                    <tbody>
                                        {trs.map((obj)=>{
                                            return obj
                                        })}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LGSEventsCalendarModal;