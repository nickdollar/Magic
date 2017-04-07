import React from 'react' ;
import AddDecksArchetypes from "./AddDecksArchetypes/AddDecksArchetypes.jsx"
import DecksArchetypesListContainer from "./DecksArchetypesList/DecksArchetypesListContainer"
import DecksArchetypesFixes from "./DecksArchetypesFixes/DecksArchetypesFixes"

export default class CustomDecksArchetypesAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div className="CustomDecksArchetypesAdmin">
                <AddDecksArchetypes />
                <DecksArchetypesListContainer format={this.props.Formats_id}/>
                <DecksArchetypesFixes format={this.props.Formats_id}/>

            </div>
        )
    }
}
