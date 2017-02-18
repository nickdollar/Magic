import React from 'react' ;
import LGSEventsCalendarContainer from "./LGSEventsCalendar/LGSEventsCalendarContainer.jsx";
import LGSLatestEventsContainer from "./LGSLastestEvents/LGSLatestEventsContainer.jsx"
import LGSList from "./LGSList/LGSList.jsx"

export default class LGSTableList extends React.Component {

    constructor(){
        super();
        this.state = {
            LGS : []
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
        if(!this.state.LGS.find((LGSObj)=>{ return _id == LGSObj._id})){
            return true;
        }

        return this.state.LGS.find((LGSObj)=>{ return _id == LGSObj._id}).checked;
    }

    checkEvent(e){
        var arrayImu = this.state.LGS.concat();

        var obj = arrayImu.find((arrayImuOby)=>{
            return e.target.getAttribute("data-_id") == arrayImuOby._id;
        })

        if(obj.checked == true){
            obj.checked = false;
        }else{
            obj.checked = true;
        }
        this.setState({LGS : arrayImu});
    }


    render(){
        return(
            <div className="LGSTableListComponent">
                <LGSList LGS={this.props.LGS} checkEvent={this.checkEvent.bind(this)} checkedOrNotChecked={this.checkedOrNotChecked.bind(this)}/>
                <LGSLatestEventsContainer LGS={this.state.LGS}/>
                <LGSEventsCalendarContainer LGS={this.state.LGS}/>
            </div>
        );
    }
}

