import React from 'react';
import AutoSuggest from '/client/dumbReact/AutoSuggest';

export default class DecksDataByMethod extends React.Component {
    constructor(){
        super();

    }

    handleAutosuggest(event, {seggestion, suggestionValue, sugestionIndex, sectionIndex, method}){
        console.log(arguments);
    }

    render(){
        return(
            <div className="DecksDataByMethodComponent">
                <AutoSuggest
                    getSuggestionMethod={AutoComplete}
                    AutoCompleteCallBack={this.handleAutosuggest.bind(this)}
                />

            </div>
        );
    }
}