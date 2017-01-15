import React from 'react' ;
import FixEventsNotStateNamesListContainer from './FixEventsNotStateNamesListContainer.jsx' ;

export default class FixEventsWithDecksWithoutNames extends React.Component{
    constructor(props){
        super();
    }

    componentWillReceiveProps(nextProps){

    }

    componentDidMount(){

    }

    render(){
        return (
            <div>
                <FixEventsNotStateNamesListContainer format={this.props.format}/>
            </div>
        )
    }
}
