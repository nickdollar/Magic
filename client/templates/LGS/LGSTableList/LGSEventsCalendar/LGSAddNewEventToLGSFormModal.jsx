import React from 'react' ;
import ReactDOM from 'react-dom';
import LGSAddNewEventToLGSStoreForm from './LGSAddNewEventToLGSStoreForm.jsx';

class LGSAddNewEventToLGSFormModal extends React.Component{
    componentDidMount(){
        $(ReactDOM.findDOMNode(this)).modal('show');
        $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
    }
    render(){
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">Add Store. (Will be Added After Mods Confirms Information) fffdfd</h4>
                        </div>
                        <div className="modal-body">
                            <LGSAddNewEventToLGSStoreForm />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LGSAddNewEventToLGSFormModal;