import React from "react";
import Autosuggest from 'react-autosuggest';

const theme = {
    container: {
        position: 'relative'
    },
    input: {
        width: 240,
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

const getSuggestionValue = (suggestion) => {
    return `${suggestion.name} - ${suggestion.setName}`
};

const renderSuggestion = suggestion => (
    <div>
        {suggestion.name} - {suggestion.setName}
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

    onChange = (event, { newValue , method}) =>{
        console.log(method);
        this.props.typedCard(newValue, method);
        this.setState({
            value: newValue
        });
    };
    onSuggestionsFetchRequested = ({ value }) => {
        Meteor.call("getAutoCompleteComplete", value, (err, data)=>{
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
        this.props.typedCard(suggestion, method);
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

        // Finally, render it!
        return (
            <div className="CardNamesCallComponent">
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
            </div>
        );
    }
}