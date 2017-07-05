import React from "react";



export default class DumbSelect2 extends React.Component{
    constructor() {
        super();
    }

    componentDidMount(){
        $('.js-select2').off("select2");
        $('.js-select2').select2({
            ajax : {
                transport : (params, sucess, failure)=>{
                    Meteor.call(this.props.call, {term : params.data.q}, (err, data)=>{
                        sucess(data.map((obj)=>{
                            return obj.Cards_id;
                        }));
                    });
                },
                processResults : function(data){
                    return {
                        results: data.map((cardsName)=>{
                            return {id : cardsName, text : cardsName}
                        })
                    };
                }
            }
        });

        $('.js-select2').off("select2:select");
        $('.js-select2').on("select2:select", (evt)=> {
            this.props.returnHandler(evt.params.data.text);
            $('.js-select2').val("");
        });
    }



    render() {
        return (
            <div className="ContainerDumbSelect2">
                <select className="js-select2" style={{width : "100%"}}>
                </select>
            </div>
        )
    }
}