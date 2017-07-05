import React from 'react' ;

export default class DecksArchetypesCards extends React.Component {
    constructor(){
        super();
        this.state = {showCards : false};
    }

    showCards(){
        this.setState({showCards : !this.state.showCards});
    }

    render(){
        var percent = 100/Object.keys(this.props.typesSeparated.typesSeparated).length;
        var result = [];
        for(var key in this.props.typesSeparated.typesSeparated){
            result.push(<ul className="list-group" style={{width : `${percent}%`}} key={key} >
                    <li className="list-group-item">{this.props.typesSeparated.typesSeparated[key].text}</li>
                    {this.props.typesSeparated.typesSeparated[key].array.map((card, index)=>{
                        return  <li onClick={()=>this.props.checkCard(card.index)} className={`list-group-item ${card.checked ? "checked" : ""}`} key={card.Cards_id}>
                            {card.qty} {card.Cards_id}
                        </li>
                    })}
                </ul>
            )
        }

        return(
            <div className="DecksArchetypesCardsComponent">
                <div><button className="btn btn-default" onClick={this.showCards.bind(this)}>{this.state.showCards ? "Hide Cards" : "Show Cards"}</button></div>
                {this.state.showCards ? <div>
                        <h4>Click on a Card to Filter: </h4>
                        <div>
                            {result.map((result)=>{
                                return result;
                            })}
                        </div>
                    </div> : null}

            </div>
        );
    }
}

