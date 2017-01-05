import React from 'react' ;
import SubmitDeck from './submitDeck/SubmitDeck.jsx';

class SubmitDeckFP extends React.Component{


    constructor(props){
        super();
        this.state = {inputValue : this.text(props.deck)};
    }

    componentDidMount(){

    }

    componentWillUnmount(){
        this.convertTextToDeck();
    }

    onChangeOnArea(e){
        this.setState({inputValue : e.target.value})
    }

    componentWillReceiveProps(nextProps){
        this.setState({inputValue : this.text(nextProps.deck)});
    }

    render(){

        return (
            <div >
                <SubmitDeck />
            </div>
        )
    }
}

export default SubmitDeckFP;