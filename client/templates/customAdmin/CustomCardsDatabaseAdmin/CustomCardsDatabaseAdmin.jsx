import React from 'react' ;
import UpdateCardsDatabase from "./UpdateCardsDatabase/UpdateCardsDatabase"

export default class CustomAdmin extends React.Component{
    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){
        return (
            <div>
                <UpdateCardsDatabase />
            </div>
        )
    }
}
