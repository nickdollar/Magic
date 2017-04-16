import React from 'react' ;
import SelectedEventPlayerList from './SelectedEventPlayerList/SelectedEventPlayerList.jsx' ;
import DeckAggregate from '/client/dumbReact/DeckAggregate/DeckAggregate.jsx' ;
import SelectedEventHeader from './SelectedEventHeader/SelectedEventHeader.jsx';

export default class LGSAddNewStore extends React.Component {
    constructor(props){
        super();
        this.state = {  DecksData_id : props.DecksData_id ? props.DecksData_id : null,
                        DecksList : [],
                        DecksData : {},
                        Event : {}
        }
    }

    sortFunc(a, b){
        if(!a.position) return 1;
        if(a.position){
            return a.position - b.position;
        } else if (a.victory){
            return a.victory - b.victory;
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.Events_id != this.props.Events_id){
            this.getNewList(nextProps.Events_id);
        }

        if(nextProps.DecksData_id != this.props.DecksData_id){
            var decksData = this.state.DecksList.find((deck)=>{
                if(deck._id == nextProps.DecksData_id){
                    return true
                }
            })
            this.setState({DecksData_id : nextProps.DecksData_id, DecksData : decksData})
        }
    }

    componentDidMount(){
        this.getDecksListEvents_id(this.props.Events_id);
    }


    getDecksListEvents_id(Events_id){
        Meteor.call("getDecksListEvents_id", Events_id, (err, data)=>{
            if(data.DecksData.length!=0){
                data.DecksData.sort(this.sortFunc);
            }

            var DecksData_id = this.state.DecksData_id;
            var DecksData;
            if(!DecksData_id){
                data.DecksData[0] ? DecksData_id = data.DecksData[0]._id : DecksData_id = "";
                data.DecksData[0] ? DecksData = data.DecksData[0] : DecksData_id = {};

            }else{
                DecksData = data.DecksData.find((deck)=>{
                    return deck._id == DecksData_id
                })
            }
            this.setState({DecksList : data.DecksData, DecksData : DecksData ? DecksData : {}, DecksData_id : DecksData_id, Event : data.Event})
        });
    }

    render(){
        return(
            <div className="SelectedEventComponent">
                <SelectedEventHeader DecksData={this.state.DecksData}
                                     Event={this.state.Event}
                />
                <div className="col-xs-3">
                    <div className="row">
                        <SelectedEventPlayerList Events_id={this.props.Events_id}
                                                 DecksData_id={this.state.DecksData_id}
                                                 DecksList={this.state.DecksList}
                                                 Event={this.state.Event}
                       />
                    </div>
                </div>
                <div className="col-xs-9">
                    <div className="row">
                        <DeckAggregate DecksData_id={this.state.DecksData_id}/>
                    </div>
                </div>

            </div>
        );
    }
}
