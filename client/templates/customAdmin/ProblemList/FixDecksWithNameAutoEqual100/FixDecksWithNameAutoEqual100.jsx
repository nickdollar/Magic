import React from 'react' ;
import FixDecksWithNameAutoEqual100ListContainer from './FixDecksWithNameAutoEqual100ListContainer.jsx' ;

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
                <FixDecksWithNameAutoEqual100ListContainer format={this.props.format}/>
            </div>
        )
    }
}
