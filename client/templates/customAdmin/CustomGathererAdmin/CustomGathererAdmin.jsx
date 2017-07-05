import React from 'react' ;

export default class CustomGathererAdmin extends React.Component {
    constructor(){
        super();

    }

    render(){
        return(
            <div className="CustomGathererAdminComponent">
               <button className="btn" onClick={()=>{Meteor.call("updateGathererMethod")}}>updateGathererMethod</button>
            </div>
        );
    }
}