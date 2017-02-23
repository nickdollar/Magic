import React from 'react' ;
import AddDecksArchetypes from "./AddDecksArchetypes/AddDecksArchetypes.jsx"
import DecksArchetypesListContainer from "./DecksArchetypesList/DecksArchetypesListContainer"
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
                <DecksArchetypesListContainer format={this.props.format}/>
            </div>
        )
    }
}
