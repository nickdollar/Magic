import React from 'react' ;

class ImportByFile extends React.Component{


    constructor(){
        super();

    }

    componentWillUnmount(){

    }

    componentDidMount(){

    }

    onChange(e){

        var fr = new FileReader();
        var linePatt = /(sb:+)?\s*(\d+)?x?\s*(?:\s\[.*\])? *((?:[a-zA-Z',-])+(?:\s[a-zA-Z',-]*)*)(?:\r|\n|$)/i;
        var sideboardPatt = /sideboard/i;
        var that = this;
        fr.onload = function(){
            var lines = this.result.split('\n');
            var main = [];
            var sideboard = [];
            var sideboardBoolean = false;
            for(var i = 0; i < lines.length; i++){
                var line = lines[i].match(linePatt);
                if(!line) continue;
                if(line[0] == "") continue;


                var sideboardCheck =  lines[i].match(sideboardPatt);
                if(sideboardCheck){
                    sideboardBoolean = true;
                }
                var quantity = line[2] ? parseInt(line[2]) : 1;

                if(sideboardBoolean){
                    sideboard.push({name : line[3].toTitleCase(), quantity : quantity});
                }else{
                    if(line[1]){
                        sideboard.push({name : line[3].toTitleCase(), quantity : quantity});
                    }else{
                        main.push({name : line[3].toTitleCase(), quantity : quantity});
                    }
                }
            }


            that.props.callParent({main : main, sideboard : sideboard});
        }
        fr.readAsText(e.currentTarget.files[0]);

    }

    render(){
        return (
            <div className="form-group row">
                <label htmlFor="example-search-input" className="col-xs-2 col-form-label">import from file</label>
                <div className="col-xs-10">
                    <input onChange={this.onChange.bind(this)} type="file" className="js-submitADeck" id="file" name="file" encType="multipart/form-data"/>
                    <p className="help-block">Most files works</p>
                </div>
            </div>
        )
    }
}

export default ImportByFile;