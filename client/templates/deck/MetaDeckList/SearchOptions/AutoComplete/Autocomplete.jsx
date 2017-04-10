import React from "react";
import Autosuggest from 'react-autosuggest';

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion =>  <div>{suggestion.name}</div>;

export default class AutoComplete extends React.Component{
    constructor() {
        super();
        this.state = {
            value: '',
            suggestions: []
        };
    }

    componentDidUpdate(){
        cardPopover(".js-imagePopover", true);
    }

    onChange = (event, { newValue , method}) =>{
        // this.props.autoComplete(newValue, method);
        this.setState({
            value: newValue
        });
    };
    onSuggestionsFetchRequested = ({ value }) => {
        Meteor.call("getAutoComplete", value, (err, data)=>{
            var addFoils = [];
            data.forEach((card)=>{
                addFoils.push(card);
            })
            this.setState({
                suggestions: addFoils.length === 0 ? [] : addFoils
            });
        })
    };

    onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }){
        if(method == "click" || method == "enter"){
            this.props.autoComplete(suggestion);
            this.setState({value : ""});
        }

    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Type a Card Name',
            value,
            onChange: this.onChange
        };

        return (
            <div className="optionsGroupName">
                <div className="optionsHeader">Deck Contain</div>
                <Autosuggest
                    suggestions={suggestions}
                    theme={theme}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
                <ul className="list-group list-group-sm">
                    {this.props.state.cards.map((obj, index)=>{
                        return <li key={obj} className="list-group-item"><span className="js-imagePopover" data-name={obj}>{obj}</span><span onClick={()=>this.props.removeFromTheListMain(index)} data-name={obj} style={{float : "right"}}>X</span></li>
                    })}
                </ul>
            </div>
        )
    }
}


const theme = {
    container: {
        position: 'relative'
    },
    input: {
        width: "100%",
        height: 30,
        padding: '5px 5px',
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: 16,
        border: '1px solid #aaa',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    inputFocused: {
        outline: 'none'
    },
    inputOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    suggestionsContainer: {
        display: 'none'
    },
    suggestionsContainerOpen: {
        display: 'block',
        position: 'absolute',
        width: 400,
        border: '1px solid #aaa',
        backgroundColor: '#fff',
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: 16,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        zIndex: 2,
        maxHeight: "200px",
        overflow: "auto",
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    suggestion: {
        cursor: 'pointer',
        padding: '5px 5px'
    },
    suggestionHighlighted: {
        backgroundColor: '#ddd'
    }
};