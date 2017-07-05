import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class ImportOptions extends React.Component {
    constructor() {
        super();
        this.state = {found: [], notFound : [], replaceTotal : true, message : "", disableTCGButton : false, selectedCSVOption : "CrowdMTG"}
    }

    importFromTCG(){
        this.setState({found : [], notFound : [], disableTCGButton : true, message : "loading..."});
        Meteor.call("importCollectionMethod", {URLNumber : this.refs["URLNumber"].value}, (err, response)=>{
            this.setState({found : response.found, notFound : response.notFound, disableTCGButton : false, message : response.responseText});
        });
    }

    formatQty(cell, row){
        if(row.foil){
            return row.fQty;
        }
        return row.nQty;
    }

    replaceTotalHandler(){

    }

    addCollectionToUsersCollection(){
        Meteor.call("addCollectionToUsersCollectionMethod", {cards : this.state.found, replaceTotal : this.state.replaceTotal}, (err, response)=>{


        })
    }

    replaceTotalHandler(replaceTotal){
        this.state.replaceTotal = replaceTotal;
    }

    componentDidMount(){
        $('#selphoto').filestyle({
            // buttonName : 'btn-primary',
            buttonText : ' Upload an csv file',
            iconName : 'glyphicon glyphicon-upload'
        });
    }


    importFromCSV(){
        var file = this.refs["uploadedFile"].files[0];
        var reader = new FileReader();
        reader.onload = (fileLoadEvent)=>{
            console.log(this.state.selectedCSVOption);
            Meteor.call("updateCollectionFromCSVMethodFuture", {file : reader.result, type : this.state.selectedCSVOption}, (err, response)=>{
                this.setState({found : response.found, notFound : response.notFound, message : response.responseText});
            });
        }
        reader.readAsBinaryString(file);
    }

    onClickRadioChange(type){
        this.state.selectedCSVOption = type;
    }

    render(){

        const optionsFound = {
            options : {
                sizePerPage : 5,
            },
            data : this.state.found
        }

        const optionsNotFound = {
            options : {
                sizePerPage : 5,
            },
            data : this.state.notFound
        }

        return(
            <div className="ImportOptionsComponent">
                <h3>CSV Import</h3>
                <div className="radio">
                    <label><input type="radio" name="optCSVOptions" onClick={()=>{this.onClickRadioChange("CrowdMTG")}} defaultChecked={this.state.selectedCSVOption == "CrowdMTG" ? true : false}/>CrowdMTG (Headers: name, setCode, nQty, fQty)</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="optCSVOptions" onClick={()=>{this.onClickRadioChange("MTGO")}} defaultChecked={this.state.selectedCSVOption == "MTGO" ? true : false}/>MTGO (Headers: Card Name, Quantity, #ID, Rarity, Set, Collector #, Premium)</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="optCSVOptions" onClick={()=>{this.onClickRadioChange("TCGPlayer")}} defaultChecked={this.state.selectedCSVOption == "MTGO" ? true : false}/>TCGPlayer (Headers: HAVE, NAME, GAME)</label>
                </div>
                <div className="input-group"  style={{width : "100%"}}>
                    <input id="selphoto" ref="uploadedFile" type="file" className="filestyle" data-icon="false"/>
                    <span className="input-group-btn">
                        <button onClick={this.importFromCSV.bind(this)} className="btn btn-secondary" type="button" disabled={this.state.disableTCGButton}>Import</button>
                    </span>
                </div>

                <h3>Cards to be Imported</h3>
                <div className="checkbox">
                    <label><input type="radio" onClick={()=>{this.replaceTotalHandler(true)}} name="replaceTotal" value="replace" defaultChecked={true}/>Add new cards and replace found card quantity</label>
                </div>
                <div className="checkbox">
                    <label><input type="radio" onClick={()=>{this.replaceTotalHandler(false)}} name="replaceTotal" value="total"/>Add new cards and add quantity to the card total</label>
                </div>
                <button onClick={this.addCollectionToUsersCollection.bind(this)}>Add Cards Below to Your Collection</button>
                <h3>{this.state.message}</h3>
                <label htmlFor="basic-url">Cards not found yet added on our system or cards that our script could not recognize. Mostly Lands.</label>
                <BootstrapTable {...optionsNotFound}>
                    <TableHeaderColumn isKey dataField={"key"} dataSort hidden>_id</TableHeaderColumn>
                    <TableHeaderColumn dataField={"_id"} dataSort hidden>_id</TableHeaderColumn>
                    <TableHeaderColumn dataField={"name"} dataSort >Name</TableHeaderColumn>
                    <TableHeaderColumn dataField={"setName"} dataSort >Set Name</TableHeaderColumn>
                    <TableHeaderColumn dataField={"fQty"} dataSort >Foil</TableHeaderColumn>
                    <TableHeaderColumn dataField={"_id"} dataSort dataFormat={this.formatQty}>Quantity</TableHeaderColumn>
                </BootstrapTable>

                <label htmlFor="basic-url">Cards to be Added</label>
                <BootstrapTable {...optionsFound}>
                    <TableHeaderColumn isKey dataField={"key"} dataSort hidden>_id</TableHeaderColumn>
                    <TableHeaderColumn dataField={"_id"} dataSort hidden>_id</TableHeaderColumn>
                    <TableHeaderColumn dataField={"name"} dataSort >Name</TableHeaderColumn>
                    <TableHeaderColumn dataField={"setCode"} dataSort >Set</TableHeaderColumn>
                    <TableHeaderColumn dataField={"nQty"} dataSort >Normal</TableHeaderColumn>
                    <TableHeaderColumn dataField={"fQty"} dataSort >Foil</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}



{/*<table className="table table-sm">*/}
    {/*<thead>*/}
    {/*<tr>*/}
        {/*<td>Field Name</td>*/}
        {/*<td>Description</td>*/}
        {/*<td>Required?</td>*/}
    {/*</tr>*/}
    {/*</thead>*/}
    {/*<tbody>*/}
    {/*<tr>*/}
        {/*<td>cardName</td>*/}
        {/*<td>Name of the Card</td>*/}
        {/*<td>Required</td>*/}
    {/*</tr>*/}
    {/*<tr>*/}
        {/*<td>setCode</td>*/}
        {/*<td>Name of the Card</td>*/}
        {/*<td>Required</td>*/}
    {/*</tr>*/}
    {/*<tr>*/}
        {/*<td>nQty</td>*/}
        {/*<td>Non-foil Quantity. (Optional) If Doesn't Exists, it will use foil field.</td>*/}
        {/*<td>Optional</td>*/}
    {/*</tr>*/}
    {/*<tr>*/}
        {/*<td>fQty</td>*/}
        {/*<td>Foil Quantity. (Optional) If Doesn't Exists, it will use foil field.</td>*/}
        {/*<td>Optional</td>*/}
    {/*</tr>*/}
    {/*<tr>*/}
        {/*<td>Foil</td>*/}
        {/*<td>If card is foil or not. (Optional) If Doesn't Exist, it will accept all cards as not foil, If nQty or fQty field doesn't Exists</td>*/}
        {/*<td>Optional</td>*/}
    {/*</tr>*/}
    {/*<tr>*/}
        {/*<td>quantity</td>*/}
        {/*<td>Name of the Card. Will be used if foil field exists.</td>*/}
        {/*<td>Optional</td>*/}
    {/*</tr>*/}
    {/*</tbody>*/}
{/*</table>*/}