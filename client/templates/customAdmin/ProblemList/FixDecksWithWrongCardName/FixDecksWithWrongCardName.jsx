import React from 'react' ;
import FixDecksWithWrongCardNameListContainer from './FixDecksWithWrongCardNameListContainer.jsx' ;

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
                <FixDecksWithWrongCardNameListContainer format={this.props.format}/>
            </div>
        )
    }
}
