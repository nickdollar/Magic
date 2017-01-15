import React from 'react' ;
import ObjectsTable from './ObjectsTable' ;

export default class Problem extends React.Component{
    constructor(props){
        super();
        this.state = {showObjects : false,
                      showFixComponent : false};
    }

    fixThis(){
        Meteor.call(this.props.fixMethod, this.props.format)
    }

    showObjects(){
        if(this.state.showObjects){
            this.setState({showObjects : false});
        }else{
            this.setState({showObjects : true});
        }
    }

    showFixComponent(){
        if(this.state.showFixComponent){
            this.setState({showFixComponent : false});
        }else{
            this.setState({showFixComponent : true});
        }
    }

    findProblem(){
        Meteor.call(this.props.findProblem.name, this.props.findProblem.data);
    }



    render(){
        return (
            <tbody>
                <tr>
                    <td>
                        <button onClick={this.showObjects.bind(this)}>Show</button>
                    </td>
                    <td>
                        {this.props.fixComponent ? <button onClick={this.showFixComponent.bind(this)}>Fix</button> : null}
                    </td>
                    <td>
                        {this.props.title}
                    </td>
                    <td>
                        {this.props.ObjectsWithProblems.length}
                    </td>
                    <td>
                        {this.props.fixMethod ? <button onClick={this.fixThis.bind(this)}>Fix Problems</button> : null}
                    </td>
                    <td>
                        {this.props.findProblem ? <button onClick={this.findProblem.bind(this)}>Find Problems</button> : null}
                    </td>
                </tr>
                {
                    this.state.showObjects ? <tr>
                        <td colSpan="6">
                            <ObjectsTable ObjectsWithProblems={this.props.ObjectsWithProblems}/>
                        </td>
                    </tr> : null
                }
                {
                    this.state.showFixComponent ? <tr>
                            <td colSpan="6">
                                {this.props.fixComponent}
                            </td>
                        </tr> : null
                }

            </tbody>
        )
    }
}
