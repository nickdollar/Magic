import React from 'react' ;

export default class CustomCardsAdmin extends React.Component {
    constructor(){
        super();
        this.state = {sets : [], selectedSet : ""}
    }

    getGathererSets(){
        Meteor.call("getGathererSetsMethod", {}, (err, response)=>{
            this.setState({sets : response});
        })
    }

    selectedComponent(selectedSet){
        this.setState({selectedSet : selectedSet})
    }

    componentDidMount(){
        this.getGathererSets();
    }

    addCollection(){
        console.log(this.state.selectedSet);
    }

    render(){
        return(
            <div className="CustomCardsAdminComponent">
                <button onClick={()=>Meteor.call("giveLatestPriceForEach")}>giveLatestPriceForEach</button>
                {/*<button onClick={()=>Meteor.call("organizeAllCardsDatabaseMethod")}>organizeAllCardsDatabaseMethod</button>*/}
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("AddNewCardsPrintingsFromGathererMethod")}>AddNewCardsPrintingsFromGathererMethod</button>
                </div>
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("AddNewCardsFromGathererMethod")}>AddNewCardsFromGathererMethod</button>
                </div>
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("AddTCGCardsMethod")}>AddTCGCardsMethod</button>
                </div>
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("addNumbersToCardsPrintingsMethod")}>addNumbersToCardsPrintingsMethod</button>
                </div>
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("giveNamesToLandsMethod")}>giveNamesToLandsMethod</button>
                </div>
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("giveTCGCards_id")}>giveTCGCards_id</button>
                </div>
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("giveLatestPriceForEachPrintingsMethod")}>giveLatestPriceForEachPrintingsMethod</button>
                </div>
                <div>
                    <button className="btn btn-default" onClick={()=>Meteor.call("giveLatestPriceForEachMethod")}>giveLatestPriceForEachMethod</button>
                </div>
                <div className="input-group">
                    <select onChange={(event)=>{this.selectedComponent(event.target.value)}}>
                        <option></option>

                        {this.state.sets.map((set)=>{
                            return <option key={set._id}value={set._id}>{set._id}</option>
                        })}
                    </select>
                    <span className="input-group-btn">
                        <button className="btn btn-default" onClick={this.addCollection.bind(this)}>Add to Collection</button>
                    </span>
                </div>
            </div>
        );
    }
}