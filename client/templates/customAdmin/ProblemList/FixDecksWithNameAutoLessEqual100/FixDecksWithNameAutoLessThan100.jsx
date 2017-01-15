import React from 'react' ;
import FixDecksWithNameAutoLessThan100ListContainer from './FixDecksWithNameAutoLessThan100ListContainer.jsx' ;

export default class FixDecksWithoutNames extends React.Component{
    constructor(props){
        super();
    }

    componentWillReceiveProps(nextProps){

    }

    componentDidMount(){
        this
    }

    render(){
        return (
            <div>
                <FixDecksWithNameAutoLessThan100ListContainer format={this.props.format}/>
            </div>
        )
    }
}
