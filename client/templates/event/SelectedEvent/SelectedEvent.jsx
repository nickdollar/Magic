import React from 'react' ;
import SelectedEventPlayerList from './SelectedEventPlayerList/SelectedEventPlayerList.jsx' ;
import DeckContainer from '/client/dumbReact/Deck/DeckContainer.jsx' ;
import SelectedEventHeader from './SelectedEventHeader/SelectedEventHeader.jsx';

export default class LGSAddNewStore extends React.Component {
    constructor(props){
        super();
        this.state = {  DecksData_id : props.DecksData_id ? props.DecksData_id : null,
                        DecksList : [],
                        DecksData : {},
                        event : {}
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
            this.setState({DecksData_id : nextProps.DecksData_id})
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
            if(!DecksData_id){
                data.DecksData[0] ? DecksData_id = data.DecksData[0]._id : DecksData_id = "";
            }


            this.setState({DecksList : data.DecksData, DecksData : data.DecksData[0] ? data.DecksData[0] : {}, DecksData_id : DecksData_id, Event : data.Event})
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
                       />
                    </div>
                </div>
                <div className="col-xs-9">
                    <div className="row">
                        <DeckContainer DecksData_id={this.state.DecksData_id}/>
                    </div>
                </div>

            </div>
        );
    }
}
