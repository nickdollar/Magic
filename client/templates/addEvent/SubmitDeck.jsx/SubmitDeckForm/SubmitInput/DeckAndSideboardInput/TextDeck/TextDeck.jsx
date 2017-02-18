import React from 'react' ;

class TextDeck extends React.Component{


    constructor(props){
        super();
        this.state = {inputValue : this.text(props.deck)};
    }

    componentDidMount(){

    }

    componentWillUnmount(){
        this.convertTextToDeck();
    }
    
    convertTextToDeck(){
        var linePatt = /(sb:+)?\s*(\d+)?x?\s*(?:\s\[.*\])? *((?:[a-zA-Z',-])+(?:\s(?:\/\/)?[a-zA-Z',-]*)*)(?:\r|\n|$)/i;
        var sideboardPatt = /sideboard/i;
        var lines = this.refs["textInput"].value.split('\n');
        var main = [];
        var sideboard = [];
        var sideboardBoolean = false;
        for(var i = 0; i < lines.length; i++){
            var line = lines[i].match(linePatt);
            if(!line) continue;
            if(line[0] == "") continue;


            var sideboardCheck =  lines[i].match(sideboardPatt);
            if(sideboardCheck){
                sideboardBoolean = true;
                continue
            }
            var quantity = line[2] ? parseInt(line[2]) : 1;

            if(sideboardBoolean){
                sideboard.push({name : line[3].toTitleCase(), quantity : quantity});
            }else{
                if(line[1]){
                    sideboard.push({name : line[3].toTitleCase(), quantity : quantity});
                }else{
                    main.push({name : line[3].toTitleCase(), quantity : quantity});
                }
            }
        }
        this.props.setDeck({main : main, sideboard : sideboard});
    }

    text(deck){
        if(deck.main.length == 0 || deck.sideboard.length == 0) return "";
        var deck = deck;
        if(deck == null) return [];
        var text = "";
        for(var i = 0; i <deck.main.length; i++){
            text += Math.round(deck.main[i].quantity);
            text += " ";
            text += deck.main[i].name;
            text += "\n";
        }

        text += "sideboard\n";
        for(var i = 0; i <deck.sideboard.length; i++){
            text += Math.round(deck.sideboard[i].quantity);
            text += " ";
            text += deck.sideboard[i].name;
            text += "\n";
        }
        return text;
    }

    onChangeOnArea(e){
        this.setState({inputValue : e.target.value})
    }

    componentWillReceiveProps(nextProps){
        this.setState({inputValue : this.text(nextProps.deck)});
    }
    
    render(){

        return (
            <div className="TextDeckComponent">
                <div>add "sb:" in front of sideboard card </div>
                <textarea onChange={this.onChangeOnArea.bind(this)}
                          value={this.state.inputValue}
                          ref="textInput"
                          type="text"
                          cols="10" 
                          rows="20"
                          className="form-control js-deckArea"></textarea>
            </div>
        )
    }
}

export default TextDeck;