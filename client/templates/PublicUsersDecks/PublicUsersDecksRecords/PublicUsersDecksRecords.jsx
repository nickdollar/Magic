import React from 'react' ;
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var timer = {};

export default class DeckRecords extends React.Component {
    constructor(){
        super();
    }

    getTotal(cell, row){
        var allOptions = ["w20", "w21", "w10", "l20", "l21", "l10", "w02", "w12", "w01", "l02", "l12", "l01","w00", "w11","l00", "l11"];
        var allQty = 0;
        allOptions.forEach((winOption)=>{
            var value = row[winOption];
            value ? allQty += value : null;
        })
        return <div data-name={row.name} data-type={"allQty"} >{allQty}</div>;
    }

    wins(cell, row){
        var winsOptions = ["w20", "w21", "w10", "l20", "l21", "l10"];
        var winQty = 0;
        winsOptions.forEach((winOption)=>{
            var value = row[winOption];
            value ? winQty += value : null;
        })
        return <div data-name={row.name} data-type={"wins"}>{winQty}</div>;
    }

    loses(cell, row){
        var lossesOptions = ["w02", "w12", "w01", "l02", "l12", "l01"];
        var lossesQty = 0;
        lossesOptions.forEach((winOption)=>{
            var value = row[winOption];
            value ? lossesQty += value : null;
        })
        return <div data-name={row.name} data-type={"losses"}>{lossesQty}</div>;
    }

    draws(cell, row){
        var drawsOptions = ["w00", "w11","l00", "l11"];
        var drawsQty = 0;

        drawsOptions.forEach((winOption)=>{
            var value = row[winOption];
            value ? drawsQty += value : null;
        })
        return <div data-name={row.name} data-type={"draws"}>{drawsQty}</div>;
    }

    updateVictories({target, name, value, index, upDown, winLoss}){
        var valueQty = parseInt($(target).closest(".topLevel").find(`.js-quantity`).text());
        var howMuchChange = 0;
        upDown == "down" ? valueQty += -1 : valueQty += 1;
        upDown == "down" ? howMuchChange = -1 : howMuchChange = 1;
        if(valueQty != -1){

            if(value != "wNonSide" && value != "wSide" && value != "lNonSide" && value != "lSide"){
                var totalQty = parseInt($(`[data-name="${name}"][data-type="allQty"]`).text()) + howMuchChange;
                var changeQuantity = parseInt($(`[data-name="${name}"][data-type="${winLoss}"]`).text()) + howMuchChange;
                $(`[data-name="${name}"][data-type="allQty"]`).text(totalQty);
                $(`[data-name="${name}"][data-type="${winLoss}"]`).text(changeQuantity);
            }

            $(target).closest(".topLevel").find(`.js-quantity`).text(valueQty);

            var timerId = `${name}${value}`;
            window.clearTimeout(timer[timerId]);
            timer[timerId] = window.setTimeout(()=>{
                Meteor.call("updateUsersDecksVictoriesLosses", {UsersDecks_id : this.props.UsersDeck._id, value : value, name : name, valueQty : valueQty});
            }, 3000)
        }
    }

    expandComponent(row){

        var winningOptions = [
            {value : "wNonSide", text : "nonSide"},
            {value : "wSide", text : "side"},
            {value : "w20", text : "2-0", winLoss : "wins"},
            {value : "w21", text : "2-1", winLoss : "wins"},
            {value : "w10", text : "1-0", winLoss : "wins"},
            {value : "w11", text : "1-1", winLoss : "draws"},
            {value : "w00", text : "0-0", winLoss : "draws"},
            {value : "w01", text : "0-1", winLoss : "losses"},
            {value : "w12", text : "1-2", winLoss : "losses"},
            {value : "w02", text : "0-2", winLoss : "losses"},
        ]

        var losingOptions = [
            {value : "lNonSide", text : "nonSide"},
            {value : "lSide", text : "side"},
            {value : "l20", text : "2-0", winLoss : "wins"},
            {value : "l21", text : "2-1", winLoss : "wins"},
            {value : "l10", text : "1-0", winLoss : "wins"},
            {value : "l11", text : "1-1", winLoss : "draws"},
            {value : "l00", text : "0-0", winLoss : "draws"},
            {value : "l01", text : "0-1", winLoss : "losses"},
            {value : "l12", text : "1-2", winLoss : "losses"},
            {value : "l02", text : "0-2", winLoss : "losses"},
        ]

        return <div>
            <table className={`table`}>
                <thead>
                <tr>
                    <th>Die</th>
                    {winningOptions.map((option)=>{
                        return <th key={option.value}><div className="headerValues">{option.text}</div></th>
                    })}
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Won</td>
                    {winningOptions.map((option, index)=>{
                        return  <td key={option.value}>
                            <div className="topLevel">
                                <div className="js-quantity">{row[option.value] ? row[option.value] : 0}</div>
                            </div>
                        </td>
                    })}
                </tr>
                <tr>
                    <td>Loss</td>
                    {losingOptions.map((option, index)=>{
                        return  <td key={option.value}><div className="topLevel">
                            <div className="js-quantity">{row[option.value] ? row[option.value] : 0}</div>
                        </div>
                        </td>
                    })}
                </tr>
                </tbody>
            </table>
        </div>
    }

    getWins(){
        var wins = ["w20", "w21", "w10", "l20", "l21", "l10"];



    }

    getLosses(){
        var wins = ["w01", "w12", "w10", "l01", "l12", "l01"];
    }

    formatRemove(cell, row){
        return <button className="btn" onClick={()=>this.removeDeck(cell)}>X</button>
    }

    removeDeck(name){
        Meteor.call("removeDeckMethod", {name : name, UsersDecks_id : this.props.UsersDeck._id},()=>{
            this.props.getSelectedDeck();
        })
    }

    render(){
        var decks = this.props.UsersDeck.decks
        if(!decks){
            decks = [];
        }
        const options =
            {
                options : {
                    pagination : true,
                    sizePerPage : 10,
                    paginationSize : 2,
                    expandBy : 'column',

                },
                expandColumnOptions : {
                    expandColumnVisible : true,
                },
                expandableRow: ()=>{return true},
                expandComponent : this.expandComponent.bind(this),
                data : decks,
                pagination : true
            }

        return(
            <div className="DeckRecordsComponent">
                <div className="resultsTable">
                    <BootstrapTable {...options}>
                        <TableHeaderColumn isKey dataField="name" width={"200px"} expandable={false}>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="win" dataFormat={this.wins} expandable={false}>Wins</TableHeaderColumn>
                        <TableHeaderColumn dataField="lose" dataFormat={this.loses} expandable={false}>Loses</TableHeaderColumn>
                        <TableHeaderColumn dataField="draw" dataFormat={this.draws} expandable={false}>Draws</TableHeaderColumn>
                        <TableHeaderColumn dataField="name" dataFormat={this.getTotal} expandable={false}>Total</TableHeaderColumn>
                        <TableHeaderColumn dataField="name" dataFormat={this.formatRemove.bind(this)} expandable={false}>Remove</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}