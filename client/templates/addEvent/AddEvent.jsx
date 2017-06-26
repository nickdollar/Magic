import React from 'react' ;
import SubmitDeck from './SubmitDeck/SubmitDeck.jsx';
import CreateEvent from './CreateEvent/CreateEvent.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.less';

export default class AddEvent extends React.Component{


    constructor(props){
        super();
        this.state = {};
    }

    componentDidMount(){

    }

    render(){

        return (
            <div >
                <SubmitDeck />
            </div>
        )
    }
}