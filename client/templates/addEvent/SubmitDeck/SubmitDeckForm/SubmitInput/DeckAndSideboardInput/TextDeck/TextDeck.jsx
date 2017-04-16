import React from 'react' ;

class TextDeck extends React.Component{


    constructor(props){
        super();
        this.state = {inputValue : this.convertDeckToText(props.UsersDeckData)};
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
            var qty = line[2] ? parseInt(line[2]) : 1;

            if(sideboardBoolean){
                sideboard.push({name : line[3].toTitleCase(), qty : qty});
            }else{
                if(line[1]){
                    sideboard.push({name : line[3].toTitleCase(), qty : qty});
                }else{
                    main.push({name : line[3].toTitleCase(), qty : qty});
                }
            }
        }
        this.props.setDeckFromText({main : main, sideboard : sideboard});
    }

    convertDeckToText(deck){
        var deck = deck;
        var text = "";
        if(deck == null) return [];
        var options = ["main", "sideboard"];
        for(var i = 0; i < options.length; i++){
            for(var j = 0; j < deck[options[i]].length; j++){
                text += Math.round(deck[options[i]][j].qty);
                text += " ";
                text += deck[options[i]][j].name;
                text += "\n";
            }
            if(i == options.length - 2){
                text += "sideboard\n";
            }
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
                <div>add "sb:" in front of sideboard card. Or a line with sideboard, and write your sideboard below </div>
                <textarea onChange={this.onChangeOnArea.bind(this)}
                          value={this.state.inputValue}
                          ref="textInput"
                          type="text"
                          cols="10" 
                          rows="20"
                          className="form-control js-deckArea">

                </textarea>
            </div>
        )
    }
}

export default TextDeck;