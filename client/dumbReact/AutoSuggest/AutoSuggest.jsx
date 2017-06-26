import React from "react";
import Autosuggest from 'react-autosuggest';

const getSuggestionValue = suggestion => suggestion.text;

const renderSuggestion = suggestion =>  <div>{suggestion.text}</div>;

export default class AutoComplete extends React.Component{
    constructor() {
        super();
        this.state = {
            value: '',
            suggestions: []
        };
    }

    onChange = (event, { newValue , method}) =>{
        // this.props.autoComplete(newValue, method);
        this.setState({
            value: newValue
        });
    };

    getSuggestion(){
        Meteor.call(this.props.getSuggestionsMethod, this.props.getSuggestionMethodVariables, (err, response)=>{
            this.setState({suggestions : response.map((object)=>{
                return {value : object[this.props.value], text : object[this.props.text]};
            })})
        })
    }

    componentDidMount(){
        this.getSuggestion();
    }

    onSuggestionsFetchRequested = ({ value }) => {
        return this.state.suggestions;
    };

    onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }){
            this.props.AutoCompleteCallBack(event, { suggestion : suggestion, suggestionValue : suggestionValue, suggestionIndex : suggestionIndex, sectionIndex : sectionIndex, method : method });
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    shouldRenderSuggestions() {
        return true
    }


    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Select One of Yours Deck',
            value,
            onChange: this.onChange
        };

        return (
            <div className="optionsGroupName">
                <Autosuggest
                    suggestions={suggestions}
                    theme={theme}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                    getSuggestionValue={getSuggestionValue}
                    shouldRenderSuggestions={this.shouldRenderSuggestions}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
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