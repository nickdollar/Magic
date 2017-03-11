import React from "react";
import Autosuggest from 'react-autosuggest';

const theme = {
    container: {
        position: 'relative'
    },
    input: {
        width: 240,
        height: 30,
        padding: '10px 20px',
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
        width: 280,
        border: '1px solid #aaa',
        backgroundColor: '#fff',
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: 16,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        zIndex: 2,
        "max-height": "200px",
        overflow: "auto",
        position: "absolute",
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    suggestion: {
        cursor: 'pointer',
        padding: '10px 20px'
    },
    suggestionHighlighted: {
        backgroundColor: '#ddd'
    }
};

const getSuggestionValue = (suggestion) => {
    return suggestion.name
};

const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}
    </div>
);

export default class CardNamesCall extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
            suggestions: []
        };
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };
    onSuggestionsFetchRequested = ({ value }) => {


        Meteor.call("getAutoCompleteComplete", value, (err, data)=>{

            var addFoils = [];
            data.forEach((card)=>{
                addFoils.push(card);
                addFoils.push(Object.assign(card, {foil : true}));
            })

            this.setState({
                suggestions: addFoils.length === 0 ? [] : addFoils
            });
        })

    };

    onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }){
        console.log(suggestion, suggestionValue, suggestionIndex, sectionIndex, method );
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input element.
        const inputProps = {
            placeholder: 'Type a Card Name',
            value,
            onChange: this.onChange
        };

        // Finally, render it!
        return (
            <div className="CardNamesCallComponent">
                <Autosuggest
                    suggestions={suggestions}
                    theme={theme}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
                fasdfasfd
            </div>
        );
    }
}