import React from 'react' ;

export default class PublicUsersDecksRecords extends React.Component {
    constructor(){
        super();
        this.state = {DeckData : {main : [], sideboard : []}}
    }




    render(){
        return(
            <div className="PublicUsersDecksRecordsComponent">
                {/*<DeckProps*/}
                    {/*DeckData={this.state.DeckData}*/}
                {/*/>*/}
            </div>
        );
    }
}