import React from 'react' ;
import AddDecksNamesContainer from "./AddDecksNames/AddDecksNames.jsx"

export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div className="CustomDecksNamesAdmin">
                <AddDecksNamesContainer format={this.props.format}/>
            </div>
        )
    }
}
