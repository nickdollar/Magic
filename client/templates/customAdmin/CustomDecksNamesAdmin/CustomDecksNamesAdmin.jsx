import React from 'react' ;
import AddDecksNamesContainer from "./AddDecksNames/AddDecksNames.jsx"
import DecksNamesListContainer from "./DecksNamesList/DecksNamesListContainer"
import DecksNamesShells from "./DecksNamesShells/DecksNamesShells"

export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div className="CustomDecksNamesAdminComponent">
                <AddDecksNamesContainer format={this.props.format}/>
                <DecksNamesListContainer format={this.props.format}/>
                <DecksNamesShells format={this.props.format}/>
            </div>
        )
    }
}
