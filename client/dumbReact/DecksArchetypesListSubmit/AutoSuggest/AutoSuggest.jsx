import React from "react";
import Autosuggest from 'react-autosuggest';

const themeDeckEdit = {
    container: {
        position: 'relative'
    },
    input: {
        width: 180,
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
    return `${suggestion.name}`
};

const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}
    </div>
);

export default class CardNamesCall extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: "",
            suggestions: []
        };
    }

    onChange = (event, { newValue , method}) =>{
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        var suggestions = [];
        this.props.suggestions.forEach((suggestion)=>{
            var suggestionRegex = new RegExp(`${value}`, "i");
            if(suggestion.name.match(suggestionRegex)){
                suggestions.push(suggestion);
            }
        })

        this.setState({suggestions : suggestions});
    };

    onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }){
        this.props.selectedDeckArchetype({suggestion : suggestion})
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    shouldRenderSuggestions(value) {
        return true;
        // return value.trim().length > 1;
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.clear != this.props.clear){
            this.setState({value : ""})
        }
    }

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Choose a deck Archetype',
            value,
            onChange: this.onChange,
        };

        return (
            <div className="CardNamesCallComponent">
                <Autosuggest
                    suggestions={suggestions}
                    theme={themeDeckEdit}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    highlightFirstSuggestion={true}
                    shouldRenderSuggestions={this.shouldRenderSuggestions}
                />
            </div>
        );
    }
}