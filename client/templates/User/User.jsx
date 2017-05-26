import React from 'react' ;
import Collection from './Collection/Collection';
import UsersDecks from './UsersDecks/UsersDecks';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.less';



export default class User extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <div className="UserComponent">
                <Tabs>
                    <TabList>
                        <Tab><h4>Collection</h4></Tab>
                        <Tab><h4>Decks</h4></Tab>
                    </TabList>
                <TabPanel>
                    <Collection/>
                </TabPanel>
                <TabPanel>
                    <UsersDecks/>
                </TabPanel>
                </Tabs>

            </div>
        );
    }
}