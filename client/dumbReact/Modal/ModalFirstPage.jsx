import React from 'react' ;
import Modal from './Modal.jsx' ;

export default class FixDecksWithoutNames extends React.Component{

    constructor(){
        super();
    }

    render(){
        return (

            <div>
                {this.props.showModal ?
                    <Modal
                        handleHideModal={this.props.handleHideModal}
                        title={this.props.title}
                    >
                        {this.props.children}
                    </Modal>
                    : null}
            </div>
        )
    }
}


/*props
 handleHideModal --> ()=>
 showModal --> boolean
 */