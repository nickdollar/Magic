import React from 'react' ;
import DeckListContainer from "./DeckListContainer.jsx";
import TextDeck from "./TextDeck.jsx";



class DeckAndSideboardInput extends React.Component{
    constructor(){
        super();
        this.state = {
            textOrList : "text"
        }

    }

    componentDidMount(){

    }

    onChange(e){

    }

    onChangeTextOrList(e){
        this.setState({textOrList : e.target.value});
    }
    
    render(){
        var textOrList;
        if(this.state.textOrList == "text"){
            textOrList = <div>
                            <TextDeck setDeck={this.props.setDeck} deck={this.props.deck} />
                        </div>
        }else{
            textOrList = <DeckListContainer  addCardDeck={this.props.addCardDeck} removeCardDeck={this.props.removeCardDeck} changeCardDeck={this.props.changeCardDeck} deck={this.props.deck}/>
        }

        return (
            <div className="form-group row">
                <div onChange={this.onChangeTextOrList.bind(this)}>
                    <label className="form-check-inline">
                        <input className="form-check-input" type="radio" name="listOrText" id="inlineRadio1" value="text" defaultChecked/> Text
                    </label>
                    <label className="form-check-inline">
                        <input className="form-check-input" type="radio" name="listOrText" id="inlineRadio2" value="list"/> List
                    </label>
                </div>
                {textOrList}
            </div>
        )
    }
}

export default DeckAndSideboardInput;
