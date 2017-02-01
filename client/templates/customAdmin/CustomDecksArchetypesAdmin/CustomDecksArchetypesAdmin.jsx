import React from 'react' ;
import AddDecksArchetypes from "./AddDecksArchetypes/AddDecksArchetypes.jsx"

export default class CustomDecksArchetypesAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div>
                <AddDecksArchetypes />
            </div>
        )
    }
}
