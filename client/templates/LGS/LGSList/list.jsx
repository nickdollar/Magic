import React from 'react';

export default class ListPage extends React.Component {
    constructor(){
        super();
        console.log(this)
    }
}

ListPage.propTypes = {
    list: React.PropTypes.object,
    todos: React.PropTypes.array,
    loading: React.PropTypes.bool,
    listExists: React.PropTypes.bool,
};

