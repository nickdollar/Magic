import React from 'react' ;
import LgsModal from './LGSAddNewStoreFormModal.jsx';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
class LGSAddNewStore extends TrackerReact(React.Component) {

    constructor(){
        super();
        this.state = {view: {showModal: false}}
    }

    handleHideModal(){
        this.setState({view: {showModal: false}})
    }
    handleShowModal(){
        this.setState({view: {showModal: true}})
    }
    render(){
        return(
            <div className="row">
                <button className="btn btn-default btn-block" onClick={this.handleShowModal.bind(this)}>Open Modal</button>
                {this.state.view.showModal ? <LgsModal handleHideModal={this.handleHideModal.bind(this)}/> : null}
                <div>{this.state.view.showModal}</div>
            </div>
        );
    }
}

export default LGSAddNewStore;