import React from 'react' ;

class ImportByUrl extends React.Component{


    constructor(){
        super();

    }

    onClick(e){
        Meteor.call("getDeckFromURL", $(".js-urlInput").val(), (err, value)=>{
            this.props.callParent(value);
        });
    }

    render(){
        return (
            <div className="form-group row">
                <label htmlFor="example-text-input" className="col-xs-2 col-form-label">Import From URL</label>
                <div className="col-xs-10">
                    <div className="input-group">
                        <input ref={"input"} type="text" className="form-control js-urlInput" placeholder="Search for..."/>
                  <span className="input-group-btn">
                    <button className="btn btn-default js-importFromAlink" onClick={this.onClick.bind(this)}type="button">Import!</button>
                  </span>
                    </div>
                    <p className="help-block">Options: tappedout</p>
                </div>
            </div>
        )
    }
}

export default ImportByUrl;