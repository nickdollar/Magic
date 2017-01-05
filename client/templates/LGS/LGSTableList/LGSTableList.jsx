import React from 'react' ;
import TrackerReact from 'meteor/ultimatejs:tracker-react';

class List extends TrackerReact(React.Component) {

    constructor(){
        super();
        var location;

    }

    componentWillUnmount(){
        this.state.subscription.LGS.stop();
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

    render(){
        return(
            <table className="table table-sm">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Distance</th>
                </tr>
                </thead>
                <tbody>
                {this.props.LGS.map((lgs)=>{
                    return <tr key={lgs._id}>
                        <td>{lgs.name} ({lgs.location.city})</td>
                        <td>{lgs.location.formatedAddress}</td>
                        <td>{this.getDistanceFromLatLonInKm(lgs.location.coords.coordinates[0], lgs.location.coords.coordinates[1])} Miles</td>
                    </tr>
                })}
                </tbody>
            </table>
        );
    }
}

export default List;