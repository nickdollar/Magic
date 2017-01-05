import React from 'react' ;

class CreateEvent extends React.Component{


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
                <input />
            </div>
        )
    }
}

export default CreateEvent;