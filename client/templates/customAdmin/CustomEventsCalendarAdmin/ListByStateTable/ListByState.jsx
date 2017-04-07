import React from 'react' ;
import ReactTableContainer from '/client/dumbReact/ReactTable/ReactTableContainer.jsx' ;


export default class ListByState extends React.Component {
    constructor(props){
        super();
        this.state = {selectedState : props.state ? props.state[0] : null, selectedRows : []}
    }

    onClickState(state){
        this.setState({selectedState : state})
    }

    sortTD(_id){
        if(!_id) return "";
        return _id.substring(0, 4);
    }

    selectedEvent(row, isSelected){
        var tempArray = this.state.selectedRows.concat();

        if(isSelected){
            tempArray.push(row._id);
        }else{
            var index = tempArray.findIndex((_id)=>{
                return row._id == _id
            });
            tempArray.splice(index, 1);
        }
        this.setState({selectedRows : tempArray});
    }

    onSelectAll(isSelected, rows){
        var tempArray = []
        if(isSelected==false){
            this.setState({selectedRows : tempArray});
        }else{
            var tempArray = rows.map((row)=>{
                return row._id
            })
            this.setState({selectedRows : tempArray});
        }
    }

    confirmLGSEvents(){
        Meteor.call("stateConfirmLGSEvents", this.state.selectedRows);
    }

    deleteLGSEvents(){
        Meteor.call("removeConfirmLGSEvents", this.state.selectedRows);
    }

    render(){

        const columns = [
            {attr : {key : "_id",       dataField : "_id",      isKey : true, dataFormat: this.sortTD}, text : "_id"},
            {attr : {key : "name",      dataField : "name",     dataFormat: this.sortTD},   text : "name"},
            {attr : {key : "LGS_id",    dataField : "LGS_id",   dataFormat: this.sortTD},   text : "LGS_id"},
            {attr : {key : "price",     dataField : "price"},                               text : "price"},
            {attr : {key : "Formats_id",    dataField : "Formats_id"},                             text : "Formats_id"},
            {attr : {key : "rounds",    dataField : "rounds",                           },   text : "rounds"},
            {attr : {key : "day",       dataField : "day"},     text : "day"},
            {attr : {key : "start",     dataField : "start"},   text : "start"},
            {attr : {key : "state",     dataField : "state"},   text : "state"},
        ]

        const options = {
                options : {
                    sizePerPage : 5,
                    hideSizePerPage: true
                },
                selectRow : {
                    selected : this.state.selectedRows,
                    mode : "checkbox",
                    clickToSelect : true,
                    onSelect : this.selectedEvent.bind(this),
                    onSelectAll : this.onSelectAll.bind(this)
                },
                pagination : true
            }


        return(
            <div className="ListByStateComponent">
                {this.props.state.map((state)=>{
                    return  <label key={state} className="radio-inline">
                        <input type="radio" name="states" checked={this.state.selectedState == state? true : false} onChange={this.onClickState.bind(this, state)}/>
                        {state}
                    </label>
                })}


                <ReactTableContainer    collection={"LGSEvents"}
                                        subscription="LGSEventsStateFormat"
                                        subscriptionParams={[this.props.Formats_id, this.state.selectedState]}
                                        query={{Formats_id : this.props.Formats_id, state : this.state.selectedState}}
                                        Formats_id={this.props.Formats_id}
                                        options={options}
                                        columns={columns}
                />
                <button className="btn" onClick={this.confirmLGSEvents.bind(this)}>confirm</button>
                <button className="btn" onClick={this.deleteLGSEvents.bind(this)}>Delete</button>


            </div>
        );
    }
}