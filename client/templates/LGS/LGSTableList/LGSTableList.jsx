import React from 'react' ;
import LGSEventsCalendarContainer from "./LGSEventsCalendar/LGSEventsCalendarContainer.jsx";
import LGSLatestEventsContainer from "./LGSLastestEvents/LGSLatestEventsContainer.jsx"

class LGSTableList extends React.Component {

    constructor(){
        super();
        this.state = {
            LGS : []
        }
    }

    LGS(){
        return LGS.find().fetch();
    }

    getDistanceFromLatLonInKm(lon1,lat1) {
        var lon2 = Session.get("position")[0],
            lat2 = Session.get("position")[1];

        var R = 3963.2; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return Math.round(d);
    }

    deg2rad(deg) {
        return deg * (Math.PI/180)
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
        console.log(this.state.LGS);
        return(
            <div className="LGSTableList">
                <h3>LGS List</h3>
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th>Events</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Distance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.LGS.map((lgs)=>{
                        return <tr key={lgs._id}>
                            <td><input type="checkbox" data-_id={lgs._id} checked={this.checkedOrNotChecked(lgs._id)} onChange={this.checkEvent.bind(this)}/></td>
                            <td>{lgs.name} ({lgs.location.city})</td>
                            <td>{lgs.location.formatedAddress}</td>
                            <td>{this.getDistanceFromLatLonInKm(lgs.location.coords.coordinates[0], lgs.location.coords.coordinates[1])} Miles</td>
                        </tr>
                    })}
                    </tbody>
                </table>
                <LGSLatestEventsContainer LGS={this.state.LGS}/>
                <LGSEventsCalendarContainer LGS={this.state.LGS}/>
            </div>

        );
    }
}

export default LGSTableList;