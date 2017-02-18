import React from 'react' ;
import ReactTableContainer from '/client/dumbReact/ReactTable/ReactTableContainer.jsx' ;


export default class ListByStateTable extends React.Component {
    constructor(props){
        super();
        this.state = {selectedState : props.state ? props.state[0] : null, selectedRows : []}
    }

    onClickState(state){
        this.setState({selectedState : state})
    }

    fixLocation(value, row){
        return value.formatedAddress;
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

    confirmLGS(){
        Meteor.call("stateConfirmLGS", this.state.selectedRows);
    }

    removeLGS(){
        Meteor.call("removeLGS", this.state.selectedRows);
    }

    render(){

        const columns = [
            {attr : {key : "_id",       dataField : "_id",          isKey : true},                  text : "_id"},
            {attr : {key : "name",      dataField : "name",         },                              text : "name"},
            {attr : {key : "location",  dataField : "location",     dataFormat: this.fixLocation},  text : "URL"},
            {attr : {key : "state",     dataField : "state"},                                       text : "state"}
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


                <ReactTableContainer    collection={"LGS"}
                                        subscription="LGSState"
                                        subscriptionParams={[this.state.selectedState]}
                                        query={{state : this.state.selectedState}}
                                        options={options}
                                        columns={columns}
                />
                <button className="btn" onClick={this.confirmLGS.bind(this)}>confirm</button>
                <button className="btn" onClick={this.removeLGS.bind(this)}>Delete</button>


            </div>
        );
    }
}