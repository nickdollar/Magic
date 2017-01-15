import React from 'react' ;
import ProblemContainer from "./ProblemContainer.jsx";
import FixDecksWithoutNames from "./FixDecksWithoutNames/FixDecksWithoutNames.jsx";
import FixDecksWithNameAutoLessThan100 from "./FixDecksWithNameAutoLessEqual100/FixDecksWithNameAutoLessThan100.jsx";
import FixDecksWithNameAutoEqual100 from "./FixDecksWithNameAutoEqual100/FixDecksWithNameAutoEqual100.jsx";
import FixDecksWithWrongCardName from "./FixDecksWithWrongCardName/FixDecksWithWrongCardName.jsx";

export default class ProblemList extends React.Component{


    constructor(props){
        super();
        this.state = {format : "standard"};
    }

    componentDidMount(){

    }

    methodsCardsData(){
        Meteor.call("methodsCardsData");
    }

    render(){

        var states = ["startProduction", "notFound", "notFoundOld", "exists", "mainHTMLFail", "HTMLFail", "HTMLMain",
            "HTMLPartial", "HTML", "decks", "names"]
        return (
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Show Objects</th>
                        <th>Fix</th>
                        <th>Problem Name</th>
                        <th>Quantity</th>
                        <th>Find Problem</th>
                        <th>Fix All</th>
                    </tr>
                    </thead>
                    <ProblemContainer title="Decks Without Names Daily And League"
                                      fixMethod="methodAddNameToDeckWithoutNameAutomatically"
                                      subscription="DecksWithoutNamesQuantity"
                                      collection="DecksData"
                                      format="standard"
                                      fixComponent={<FixDecksWithoutNames format={this.state.format}/>}
                                      ObjectWithProblemsObject={
                                          {
                                              format: this.state.format,
                                              DecksNames_id: null
                                          }
                                      }
                    />
                    <ProblemContainer title="Decks With Name Auto Percentage Less Than 100% Daily And League"
                                      fixMethod="methodAddNameToDeckAutomaticallyLessThan100LeaguedailyQuantity"
                                      subscription="DecksAutoPercentageLessThan100LeagueDailyQuantity"
                                      collection="DecksData"
                                      format={this.state.format}
                                      fixComponent={<FixDecksWithNameAutoLessThan100 format={this.state.format}/>}
                                      ObjectWithProblemsObject={
                                          {
                                              format: this.state.format,
                                              autoPercentage : {$lt : 1}
                                          }
                                      }

                    />
                    <ProblemContainer title="Decks With Name Auto Naming and Percentage equal to 100"
                                      fixMethod={null}
                                      subscription="DecksAutoPercentage100AutoNamingQuantity"
                                      collection="DecksData"
                                      format={this.state.format}
                                      fixComponent={<FixDecksWithNameAutoEqual100 format={this.state.format}/>}

                                      ObjectWithProblemsObject={
                                          {
                                              format: this.state.format,
                                              autoNaming : true,
                                              autoPercentage : 1
                                          }
                                      }
                    />
                    <ProblemContainer title="Decks With Cards With Wrong Name"
                                      fixMethod="recheckDeckWithWrongCardName"
                                      subscription="DecksDataLeagueDailyWithWrongCardsNameQuantity"
                                      collection="DecksData"
                                      format={this.state.format}
                                      fixComponent={<FixDecksWithWrongCardName format={this.state.format}/>}
                                      ObjectWithProblemsObject={
                                          {
                                              format: this.state.format,
                                              $or : [
                                                      {"main.wrongName" : true},
                                                      {"sideboard.wrongName" : true}
                                                    ]
                                          }
                                      }
                    />

                </table>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Show Objects</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <button onClick={this.methodsCardsData.bind(this)}>fixDatabase</button>
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>



        )
    }
}