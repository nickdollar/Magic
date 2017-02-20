import React from 'react' ;

export default class LGSList extends React.Component {
    constructor(){
        super();

    }

    getDistanceFromLatLonInKm(lon1,lat1) {
        if(!lon1 || !lat1) 0;
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

    checkDistanceHeader(){
        if(Session.get("positionOption") == "state"){
            return null;
        }
        return <th>Distance</th>;
    }

    checkDistanceType(lgs){
        if(Session.get("positionOption") == "state"){
            return null;
        }
        return <td>{this.getDistanceFromLatLonInKm(lgs.location.coords.coordinates[0], lgs.location.coords.coordinates[1])} Miles</td>;
    }

    render(){
        return(
            <div className="LGSListComponent">
                <h3>LGS List</h3>
                <table className="table table-sm">
                    <thead>
                    <tr>
                        <th>Events</th>
                        <th>Name</th>
                        <th>Address</th>
                        {this.checkDistanceHeader()}

                    </tr>
                    </thead>
                    <tbody>
                    {this.props.LGS.map((lgs)=>{
                        return <tr key={lgs._id}>
                            <td><input type="checkbox" data-_id={lgs._id} checked={this.props.checkedOrNotChecked(lgs._id)} onChange={this.props.checkEvent.bind(this)}/></td>
                            <td>{lgs.name} {lgs.location.city ? "({${lgs.location.city}})" : ""}</td>
                            <td>{lgs.location.formatedAddress}</td>
                            {this.checkDistanceType(lgs)}
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}