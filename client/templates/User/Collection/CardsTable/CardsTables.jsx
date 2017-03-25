import React from 'react' ;
import Pagination from "react-js-pagination";

export default class CardsTables extends React.Component {
    constructor(){
        super();

    }

    // _id : 1,
    // setCode : 1,
    // foil : 1,
    // qty : 1,
    // colors : "$card.colorIdentity"


    render(){

        const header = [{text : "Card", value : "_id"}, {text :"Set", value : "setCode"}, {text : "Qty", value : "qty"},{text : "", value : "remove"}];
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
                        {this.props.cards.map((card, index)=>  <tr key={`${card._id}${card.set}${card.foil}`}>
                                                            <td>{card._id} {card.foil ? " (F)" : ""}</td>
                                                            <td>{card.setCode}</td>
                                                            <td>{card.qty}</td>
                                                            <td onClick={()=>this.props.removeCard({name : card._id, setCode : card.setCode, foil : card.foil}, index)} className="glyphicon glyphicon-remove"></td>

                                                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}