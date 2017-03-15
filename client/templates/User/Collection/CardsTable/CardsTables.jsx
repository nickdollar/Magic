import React from 'react' ;
import Pagination from "react-js-pagination";

export default class CardsTables extends React.Component {
    constructor(){
        super();

    }

    render(){
        const header = [{text : "Card", value : "card"}, {text :"Set", value : "set"}, {text : "Qty", value : "qty"}];
        return(
            <div className="CardsTablesComponent">
                <Pagination
                    activePage={this.props.activePage}
                    itemsCountPerPage={this.props.itemsCountPerPage}
                    totalItemsCount={this.props.qty}
                    pageRangeDisplayed={5}
                    onChange={this.props.paginationOnChangeHandler}
                />
                <table className="table">
                    <thead>
                        <tr>
                            {header.map((obj)=> <th key={obj.text} onClick={()=>this.props.sortByHeader(obj.value)}>{obj.text}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.cards.map((card)=> <tr key={`${card._id}${card.set}${card.foil}`}>
                                                            <td>{card._id} {card.foil ? " (F)" : ""}</td>
                                                            <td>{card.setCode}</td>
                                                            <td>{card.qty}</td>
                                                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}