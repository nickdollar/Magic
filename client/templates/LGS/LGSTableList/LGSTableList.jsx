import React from 'react' ;
import LGSEventsCalendar from "./LGSEventsCalendar/LGSEventsCalendar.jsx";
import LGSLatestEventsContainer from "./LGSLastestEvents/LGSLatestEventsContainer.jsx"
import LGSList from "./LGSList/LGSList.jsx"

export default class LGSTableList extends React.Component {

    constructor(){
        super();

        var lgsArray = LGS.find({}).map((lgs)=>{
            return Object.assign(lgs, {checked : true, showing : true})
        })

        this.state = {
            LGS : lgsArray
        }
    }

    LGS(){
        return LGS.find().fetch();
    }

    componentWillReceiveProps(newProps){
        var arraysOfLGS = this.state.LGS.concat();

        arraysOfLGS.forEach((LGSObj)=>{
            LGSObj.showing = false;
        });
        if(newProps.LGS){
            newProps.LGS.forEach((LGSObj)=>{
                var index = arraysOfLGS.findIndex((obj)=>{
                    return obj._id == LGSObj._id;
                })
                if(index == -1){
                    arraysOfLGS.push({_id : LGSObj._id, checked : true, showing : true});
                }else{
                    arraysOfLGS[index].showing = true;
                }
            });
            this.setState({LGS : arraysOfLGS});
        }
    }


    checkedOrNotChecked(_id){
        if(!this.state.LGS.find((LGSObj)=>{return _id == LGSObj._id})){
            return true;
        }
        return this.state.LGS.find((LGSObj)=>{return _id == LGSObj._id}).checked;
    }

    checkEvent(LGS_id){
        var arrayTemp = this.state.LGS.concat();

        var index = arrayTemp.findIndex((arrayImuOby)=>{
            return  LGS_id == arrayImuOby._id;
        })

        if(arrayTemp[index].checked){
            arrayTemp[index].checked = false;
        }else{
            arrayTemp[index].checked = true;
        }
        this.setState({LGS : arrayTemp});
    }

    render(){
        return(
            <div className="LGSTableListComponent">
                <LGSList LGS={this.props.LGS} checkEvent={this.checkEvent.bind(this)} checkedOrNotChecked={this.checkedOrNotChecked.bind(this)} positionOption={this.props.positionOption}/>
                <LGSLatestEventsContainer LGS={this.state.LGS} positionOption={this.props.positionOption}/>
                <LGSEventsCalendar LGS={this.state.LGS}/>
            </div>
        );
    }
}

