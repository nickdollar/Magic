import React from 'react' ;
import SubmitDeck from './SubmitDeck.jsx/SubmitDeck.jsx';
import CreateEvent from './CreateEvent/CreateEvent.jsx';


export default class AddEvent extends React.Component{


    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){

        return (
            <div >
                <SubmitDeck />
                <CreateEvent LGS={this.props.LGS}/>
            </div>
        )
    }
}