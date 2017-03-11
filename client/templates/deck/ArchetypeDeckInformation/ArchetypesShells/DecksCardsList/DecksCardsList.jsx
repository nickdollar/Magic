import React from 'react' ;

export default class DecksCardsList extends React.Component {
    constructor(){
        super();

    }

    render(){
        console.log(this.props);

        var percent = 100/Object.keys(this.props.typesSeparated.typesSeparated).length;
        var result = [];
        for(var key in this.props.typesSeparated.typesSeparated){
            result.push(<ul className="list-group" style={{width : `${percent}%`}} key={key} >
                            <li className="list-group-item">{this.props.typesSeparated.typesSeparated[key].text}</li>
                            {this.props.typesSeparated.typesSeparated[key].array.map((card, index)=>{
                                var temp = key;
                            return  <li onClick={()=>this.props.checkCard(temp, index)} className={`list-group-item ${card.checked ? "checked" : ""}`} key={card.name}>
                                        {card.quantity} {card.name}
                                    </li>
                                    })}
                        </ul>
            )
        }

        return(
            <div className="DecksCardsListComponent">
                {result.map((result)=>{
                    return result;
                })}
            </div>
        );
    }
}