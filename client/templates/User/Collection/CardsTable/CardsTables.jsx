import React from 'react' ;
import Pagination from "react-js-pagination";

var foilTimes = {};
var normalTimes = {};

export default class CardsTables extends React.Component {
    constructor(){
        super();

    }
    // _id : 1,
    // setCode : 1,
    // foil : 1,
    // qty : 1,
    // colors : "$card.colorIdentity"


    changeValue({CardsUniques_id, upDown, foilNormal}){
        var value = parseInt($(this.refs[CardsUniques_id]).find(`.${foilNormal}`).text());
        upDown == "down" ? value += -1 : value += 1;
        if(value != -1){
            $(this.refs[CardsUniques_id]).find(`.${foilNormal}`).text(value);
            if(foilNormal == "nQty"){
                window.clearTimeout(foilTimes[CardsUniques_id]);
                foilTimes[CardsUniques_id] = window.setTimeout(()=>{
                    Meteor.call("updateCollectionCardQty", {CardsUniques_id : CardsUniques_id, foilNormal : foilNormal, value})
                }, 3000)

            }else{
                window.clearTimeout(normalTimes[CardsUniques_id]);
                normalTimes[CardsUniques_id] = window.setTimeout(()=>{
                    Meteor.call("updateCollectionCardQty", {CardsUniques_id : CardsUniques_id, foilNormal : foilNormal, value})
                }, 3000)
            }
        }
    }

    render(){
        const header = [{text : "Card", value : "name"}, {text :"Set", value : "setCode"}, {text : "Normal", value : "nQty"}, {text : "Foil", value : "fQty"},{text : "", value : "remove"}];
        return(
            <div className="CardsTablesComponent">
                <Pagination
                    activePage={this.props.activePage}
                    itemsCountPerPage={this.props.itemsCountPerPage}
                    totalItemsCount={this.props.qty}
                    pageRangeDisplayed={5}
                    onChange={this.props.paginationOnChangeHandler}
                />
                <table className="table table-striped">
                    <thead>
                        <tr>
                            {header.map((obj)=> <th key={obj.text} onClick={()=>this.props.sortByHeader(obj.value)}>{obj.text}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.cards.map((card, index)=>{
                            return  <tr key={card._id} ref={card._id}>
                                        <td>{card.name}</td>
                                        <td>{card.setCode}</td>
                                        <td>
                                            <div className="topLevel">
                                                <div className="quantity">
                                                    <span className="nQty">{card.nQty ? card.nQty : 0}</span> ({card.avgprice})
                                                </div>
                                                <div className="changeButtons">
                                                    <div onClick={()=>{this.changeValue({CardsUniques_id : card._id, upDown : "up", foilNormal : "nQty", index : index})}} className="arrow-up"></div>
                                                    <div onClick={()=>{this.changeValue({CardsUniques_id : card._id, upDown : "down", foilNormal : "nQty", index : index})}} className="arrow-down"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="topLevel">
                                                <div className="quantity">
                                                    <span className="fQty">{card.fQty ? card.fQty : 0}</span> ({card.foilavgprice})
                                                </div>
                                                <div className="changeButtons">
                                                    <div onClick={()=>{this.changeValue({CardsUniques_id : card._id, upDown : "up", foilNormal : "fQty",  qty : card.fQty, index : index})}} className="arrow-up"></div>
                                                    <div onClick={()=>{this.changeValue({CardsUniques_id : card._id, upDown : "down", foilNormal : "fQty", qty : card.fQty, index : index})}} className="arrow-down"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span onClick={()=>this.props.removeCard({CardsUnique_id : card._id}, index)} className="glyphicon glyphicon-remove"></span></td>
                                    </tr>
                        }
                    )}
                    </tbody>
                </table>
            </div>
        );
    }
}