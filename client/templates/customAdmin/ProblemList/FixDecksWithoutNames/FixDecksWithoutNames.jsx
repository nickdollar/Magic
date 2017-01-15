import React from 'react' ;
import FixDecksWithoutNameListsContainer from './FixDecksWithoutNameListsContainer.jsx' ;

export default class FixDecksWithoutNames extends React.Component{
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
                <FixDecksWithoutNameListsContainer format={this.props.format}/>
            </div>
        )
    }
}
