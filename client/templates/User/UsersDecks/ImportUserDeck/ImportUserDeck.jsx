import React from 'react' ;
import X2JS from "x2js";
import Textarea from 'react-textarea-autosize';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import papaparse from "papaparse";

export default class ImportUserDeck extends React.Component {
    constructor(){
        super();
        this.state = {selectedDeckFormat : "dekMTGO", main : [], sideboard : [], mainText : "", sideboardText : ""}
    }


    componentDidMount(){
        $('#uploadDeck').filestyle({
            // buttonName : 'btn-primary',
            buttonText : ' Upload an file',
            iconName : 'glyphicon glyphicon-upload'
        });
    }

    importFromFile(e){

        var file = this.refs["uploadedFile"].files[0];
        var reader = new FileReader();
        var message = "Success";

            reader.onload = (fileLoadEvent)=>{
                var main = [];
                var sideboard = [];
                var mainText = "";
                var sideboardText = "";

                if(this.state.selectedDeckFormat == "dekMTGO"){
                    var x2js = new X2JS();
                    var document = x2js.xml2js(fileLoadEvent.target.result);

                    if(document.Deck){
                        document.Deck.Cards.forEach((card)=>{
                            var card = {Cards_id : card._Name, qty : parseInt(card._Quantity)};
                            card._Sideboard == "true" ? sideboard.push(card) : main.push(card);
                        })
                    }else{
                        message = "Not a MTGO XML File"
                    }
                }else if(this.state.selectedDeckFormat == "txtMTGO"){
                    var lines = fileLoadEvent.target.result.split('\n');
                    var lineRegex = new RegExp(/(\d+) (.+)/);
                    var mainSideboard = "main";
                    for(var i = 0; i < lines.length; i++){
                        var cardMatch = lines[i].match(lineRegex);
                        if(!cardMatch){
                            mainSideboard = "sideboard";
                            continue;
                        };

                        var card = {Cards_id : cardMatch[2], qty : parseInt(cardMatch[1])};
                        mainSideboard=="main" ? main.push(card) : sideboard.push(card)
                    }
                }else if(this.state.selectedDeckFormat == "csvMTGO"){
                    var csvMTGOparsed = papaparse.parse(fileLoadEvent.target.result, {
                        header : true,
                        dynamicTyping: true,
                        skipEmptyLines : true
                    });

                    var findFields = ["Card Name", "Quantity", "Sideboarded"];
                    var foundFields = _.intersection(findFields, csvMTGOparsed.meta.fields);
                    if(findFields.length == foundFields.length){

                        var data =  csvMTGOparsed.data;
                        for(var i = 0; i < data.length; i++){

                            var card = {Cards_id : data[i]["Card Name"], qty : data[i].Quantity};

                            data[i].Sideboarded == "Yes" ? sideboard.push(card) : main.push(card);
                        }
                    }

                }else if(this.state.selectedDeckFormat == "dckXMAGE"){
                    var deckXMAGERegex = new RegExp(/(SB:)? ?(\d) \[.*] (.+)/);
                    var layoutRegex = new RegExp(/LAYOUT MAIN/);
                    var lines = fileLoadEvent.target.result.split('\n');
                    for(var i = 0; i < lines.length; i++){
                        if(lines[i].match(layoutRegex)){break;}

                        var lineMatch = lines[i].match(deckXMAGERegex);
                        var card = {Cards_id : lineMatch[3], qty : parseInt(lineMatch[2])};
                        lineMatch[1] ? sideboard.push(card) : main.push(card);
                    }
                }

                for(var i = 0; i < main.length; i++){
                    mainText += `${main[i].qty} ${main[i].Cards_id}\n`
                }

                for(var i = 0; i < sideboard.length; i++){
                    sideboardText += `${sideboard[i].qty} ${sideboard[i].Cards_id}\n`
                }

                this.setState({main : main, sideboard : sideboard, mainText : mainText, sideboardText : sideboardText});
            }

        reader.readAsBinaryString(file);
    }

    onClickRadioChange(fileType){
        this.setState({selectedDeckFormat : fileType})
    }

    changeTypeOfFile({event}){
        var fileRegex = new RegExp(/\.dek|\.txt|\.csv|\.dck/);

        var fileMatch = event.target.files[0].name.match(fileRegex);
        if(!fileMatch){
            return;
        }

        var fileType = "";
        if(fileMatch[0] == ".dek"){
            fileType = "dekMTGO";
        }else if(fileMatch[0] == ".txt"){
            fileType = "txtMTGO";
        }else if(fileMatch[0] == ".csv"){
            fileType = "csvMTGO";
        }else if(fileMatch[0] == ".dck"){
            fileType = "dckXMAGE";
        }
        this.setState({selectedDeckFormat : fileType})
    }

    importText(){
        var mainArray = this.state.mainText.split("\n");
        var cardRegex = new RegExp(/(\d+) (.+)/g);
            console.log(mainArray)
        var mainCards = [];
        var sideboardCards = [];

        for(var i = 0; mainArray.length; i++){
            console.log(mainArray[i]);
            if(!mainArray[i]){
                console.log("continue");
                continue
            }

            // var cardMatch = mainArray[i].match(cardRegex);
            // if(cardMatch){
            //     mainCards.push({Cards_id : cardMatch[2], qty : cardMatch[3]})
            // }
        }

        // var sideboardArray = this.state.sideboardText.split("\n");
        //
        // for(var i = 0; sideboardArray.length; i++){
        //     if(sideboardArray[i]){
        //         var cardMatch = sideboardArray[i].match(cardRegex);
        //         if(cardMatch){
        //             sideboardCards.push({Cards_id : cardMatch[2], qty : cardMatch[3]})
        //         }
        //     }else{
        //         console.log("AAAAAAA")
        //     }
        // }
        // console.log(mainCards);
        // console.log(sideboardCards);
    }

    render(){
        return(
            <div className="ImportUserDeckComponent">
                <h3>Import From File</h3>
                <div className="input-group"  style={{width : "100%"}}>
                    <input onChange={(event)=>{console.log(event.target); this.changeTypeOfFile({event : event})}} id="uploadDeck" ref="uploadedFile" type="file" className="filestyle" data-icon="false"/>
                    <span className="input-group-btn">
                        <button onClick={this.importFromFile.bind(this)} className="btn btn-secondary" type="button" >Add to List Below</button>
                    </span>
                </div>
                <div className="radio">
                    <label><input type="radio" name="optCSVOptions" onChange={()=>{this.onClickRadioChange("dekMTGO")}} checked={this.state.selectedDeckFormat == "dekMTGO" ? true : false}/>.dek MTGO XML File</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="optCSVOptions" onChange={()=>{this.onClickRadioChange("txtMTGO")}} checked={this.state.selectedDeckFormat == "txtMTGO" ? true : false}/>.txt MTGO TXT File</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="optCSVOptions" onChange={()=>{this.onClickRadioChange("csvMTGO")}} checked={this.state.selectedDeckFormat == "csvMTGO" ? true : false}/>.csv MTGO CSV File</label>
                </div>
                <div className="radio">
                    <label><input type="radio" name="optCSVOptions" onChange={()=>{this.onClickRadioChange("dckXMAGE")}} checked={this.state.selectedDeckFormat == "dckXMAGE" ? true : false}/>.dck XMAGE DCK File</label>
                </div>
                <div className="row">
                    <Tabs>
                        <TabList>
                            <Tab>
                                List
                            </Tab>
                            <Tab>
                                Text
                            </Tab>
                        </TabList>
                        <TabPanel>
                            <div className="row">
                                <div className="col-xs-6">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Deck</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.main.map((card, index)=> {
                                            return <tr key={index}>
                                                <td>{card.Cards_id}</td>
                                                <td>{card.qty}</td>
                                            </tr>
                                        })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-xs-6">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.sideboard.map((card, index)=> {
                                                return <tr key={index}>
                                                    <td>{card.Cards_id}</td>
                                                    <td>{card.qty}</td>
                                                </tr>
                                            })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <button className="btn">
                                Import From This List
                            </button>
                        </TabPanel>
                        <TabPanel>
                            <div className="row">
                                <div className="col-xs-6">
                                    <h4>
                                        Main
                                    </h4>
                                    <Textarea style={{width : "100%"}}
                                              value={this.state.mainText}
                                              minRows={3}
                                              onChange={e => this.setState({value: e.target.value, mainSideboard : "main"})}
                                    />
                                </div>
                                <div className="col-xs-6">
                                    <h4>
                                        Sideboard
                                    </h4>
                                    <Textarea
                                        style={{width : "100%"}}
                                        value={this.state.sideboardText}
                                        minRows={3}
                                        onChange={e => this.setState({value: e.target.value, mainSideboard : "sideboard"})}
                                    />
                                </div>
                            </div>
                            <button onClick={this.importText.bind(this)} className="btn">
                                Import this Text
                            </button>
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        );
    }
}