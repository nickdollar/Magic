import React from 'react' ;
import LGSPageMetaOptions from './LGSPageMetaOptions/LGSPageMetaOptions.jsx';
import LGSPageMetaArchetypes from './LGSPageMetaArchetypes/LGSPageMetaArchetypes.jsx';


export default class LGSPageMeta extends React.Component {
    constructor(props){
        super();
        this.state = {tableData : [], totalDecks : 0, Formats_id : "sta"};
    }

    updateValues(){
        Meteor.call("getLGSMetaAllArchetypesMethod", {Formats_id : this.state.Formats_id, options : this.state.options, LGS_id : this.props.LGS_id}, (err, response)=>{
            var totalDecks = response.reduce((a, b)=>{
                return  a + b.qty;
            },0);
            var table = [];
            table = table.concat(response);
            this.setState({tableData : table, totalDecks : totalDecks});
        });
    }

    registerOptions(options){
        this.state.options = options;
        this.updateValues();
    }

    handleFormatOptions(e){
        this.state.Formats_id = e.target.value;
        this.updateValues();
    }

    render(){
        return(
            <div className="LGSPageMetaComponent row-wrapper row-wrapper--white-bg">
                <div className="row-wrapper__title">Meta Breakdown</div>
                <LGSPageMetaOptions registerOptions={this.registerOptions.bind(this)}/>
                <div className="inline-radio-line">
                    {Formats.find({active : 1}).map((format)=>{
                        return <span className="inline-radio-line__radio" key={format._id}>
                            <input value={format._id}
                                   onChange={this.handleFormatOptions.bind(this)}
                                   name="formatsOptions"
                                   type="radio"
                                   checked={this.state.Formats_id == format._id ? true : false }/>{format.name}</span>
                    })}
                </div>
                <LGSPageMetaArchetypes  tableData={this.state.tableData}
                                        totalDecks={this.state.totalDecks}
                                        Formats_id={this.props.Formats_id}
                />
            </div>
        );
    }
}