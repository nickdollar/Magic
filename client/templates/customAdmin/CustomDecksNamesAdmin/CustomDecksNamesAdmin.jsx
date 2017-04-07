import React from 'react' ;
import AddDecksNamesContainer from "./AddDecksNames/AddDecksNames.jsx"
import DecksNamesListContainer from "./DecksNamesList/DecksNamesListContainer"
import DecksNamesShells from "./DecksNamesShells/DecksNamesShells"
import DecksNamesFixes from "./DecksNamesFixes/DecksNamesFixes"

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
                <AddDecksNamesContainer Formats_id={this.props.Formats_id}/>
                <DecksNamesListContainer Formats_id={this.props.Formats_id}/>
                <DecksNamesShells Formats_id={this.props.Formats_id}/>
                <DecksNamesFixes Formats_id={this.props.Formats_id}/>

            </div>
        )
    }
}
