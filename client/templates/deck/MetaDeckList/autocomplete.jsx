import React from "react";

class AutoComplete extends React.Component{
    constructor() {
        super();
        this.state = {
            inputValue : false,
            cardList : []
        }
    }
    
    componentDidMount(){
        $( this.refs["input"] ).autocomplete({
            source: (request, response)=>{
                Meteor.call("getAutoComplete", request, (err, data)=>{
                    response(data.map((obj)=>{
                        return obj.name;
                    }));
                });
            }
        });
    }

    addToTheListMain(){
        var card = this.refs["input"].value.toTitleCase();
        var index = this.state.cardList.findIndex((obj)=>{
           return card == obj;
        });

        if(index == -1){
            var cardList = this.state.cardList.concat([card]);
            this.props.updateCards(cardList);
            this.setState({cardList : cardList})
        }

    }

    removeFromTheListMain(e){
        var card = e.target.getAttribute("data-name");

        var index = this.state.cardList.findIndex((obj)=>{
            return card == obj;
        });

        var cardList = this.state.cardList.concat();
        cardList.splice(index, 1);
        this.props.updateCards(cardList);
        this.setState({cardList : cardList})
    }
    
    render() {
        return (
            <div className="optionsGroupName">
                <div className="optionsHeader">Deck Contain</div>
                <div className="input-group input-group-sm">
                    <input ref="input" type="text" className="form-control"/>
                      <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.addToTheListMain.bind(this)}>Add</button>
                      </span>
                </div>
                <ul className="list-group list-group-sm">
                    {this.state.cardList.map((obj)=>{
                        return <li key={obj} className="list-group-item"><span>{obj}</span><span onClick={this.removeFromTheListMain.bind(this)} data-name={obj} style={{float : "right"}}>X</span></li>
                    })}
                </ul>
            </div>
        )
    }
}

export default AutoComplete;