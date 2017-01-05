import React from "react";
class MyInput extends React.Component{

    constructor() {
        super();
        this.state = {
            GoogleAutoValue : ""
        }
    }

    resetState (){
        this.setState({location : null, GoogleAutoValue : ""});
    }

    handleChange (e) {
        this.props.onChange(e.target.value);
        var isValidField = this.isValid(e.target);
        if(this.props.type == "GoogleAuto"){
            this.setState({GoogleAutoValue : e.target.value});
        }
    }


    isValid(input) {
        if (input.getAttribute('required') != null && input.value ==="") {
            input.classList.add('error'); //add class error
            input.nextSibling.textContent = this.props.messageRequired; // show error message
            return false;
        }
        else {
            input.classList.remove('error');
            input.nextSibling.textContent = "";
        }
        //check data type // here I will show you email validation // we can add more and will later
        if (input.getAttribute('type') == "email" && input.value != "") {
            if (!this.validateEmail(input.value)) {
                input.classList.add('error');
                input.nextSibling.textContent = this.props.messageRequired;
                return false;
            }
            else {
                input.classList.remove('error');
                input.nextSibling.textContent = "";
            }
        }

        if (input.getAttribute('name') == "URL" && input.value != "") {
            if (!this.validateURL(input.value)) {
                input.classList.add('error');
                input.nextSibling.textContent = this.props.messageRequired;
                return false;
            }
            else {
                input.classList.remove('error');
                input.nextSibling.textContent = "";
            }
        }


        if (input.getAttribute('type') == "GoogleAuto" && input.value != "") {
            if (!this.state.location) {
                input.classList.add('error');
                input.nextSibling.textContent = this.props.messageRequired;
                return false;
            }
            else {
                input.classList.remove('error');
                input.nextSibling.textContent = "";
            }
        }
        return true;
    }

    validateEmail (value){
        var r = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return r.test(value);
    }

    validateURL(value){
        return /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test( value );

        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
    }

    componentDidMount() {
        if (this.props.onComponentMounted) {
            this.props.onComponentMounted(this);
        }

        if(this.props.type == "GoogleAuto"){

                var input = this.refs["GoogleAuto"];
                this.state.autocomplete = new google.maps.places.Autocomplete(input);
                this.state.autocomplete.addListener('place_changed', ()=> {
                    var place = this.state.autocomplete.getPlace();
                    if (!place) {
                        return
                    }

                    var componentForm = {
                        street_number: 'short_name',
                        route: 'long_name',
                        locality: 'long_name',
                        administrative_area_level_1: 'short_name',
                        country: 'long_name',
                        postal_code: 'short_name'
                    };

                    var location = {};

                    for (var i = 0; i < place.address_components.length; i++) {
                        var addressType = place.address_components[i].types[0];
                        if (componentForm[addressType]) {
                            if (addressType == "street_number") {
                                location.streetNumber = place.address_components[i][componentForm[addressType]];
                            } else if (addressType == "route") {
                                location.street = place.address_components[i][componentForm[addressType]];
                            } else if (addressType == "locality") {
                                location.city = place.address_components[i][componentForm[addressType]];
                            } else if (addressType == "administrative_area_level_1") {
                                location.state = place.address_components[i][componentForm[addressType]];
                            } else if (addressType == "country") {
                                location.country = place.address_components[i][componentForm[addressType]];
                            } else if (addressType == "postal_code") {
                                location.postalCode = place.address_components[i][componentForm[addressType]];
                            }
                        }
                    }

                    location.coords = [place.geometry.location.lat(), place.geometry.location.lng()];
                    location.formatedAddress = place.formatted_address;
                    input.classList.remove('error');
                    input.nextSibling.textContent = "";
                    this.setState({location : location, GoogleAutoValue : location.formatedAddress});
                });
        }

    }

    render() {
        var inputFiled;
        if(this.props.type == "textArea"){
            inputField = <textarea value={this.props.value} 
                                   ref={this.props.name} 
                                   name={this.props.name} 
                                   className="form-control" 
                                   required={this.props.isRequired} 
                                   onChange={this.handleChange.bind(this)}/>
        }else if(this.props.type == 'GoogleAuto'){
            inputField = <input type={this.props.type}
                                ref={this.props.name}
                                value={this.state.GoogleAutoValue}
                                name={this.props.name}
                                className='form-control'
                                required={this.props.isRequired}
                                onChange={this.handleChange.bind(this)}
                                />
            formatedAddress = <span></span> ;
            if(this.state.location){
                formatedAddress = <div>{this.state.location.formatedAddress}</div>
            }
            return (
                <div className="form-group">
                    <label htmlFor={this.props.htmlFor}> {this.props.label}: </label>
                    {inputField}
                    <span className="error"></span>
                    {formatedAddress}
                </div>
            )

        } else{
            inputField = <input value={this.props.value}
                                type={this.props.type}
                                ref={this.props.name}
                                name={this.props.name}
                                className='form-control'
                                required={this.props.isRequired}
                                onChange={this.handleChange.bind(this)} />
        }

        return (
            <div className="form-group">
                <label htmlFor={this.props.htmlFor}> {this.props.label}: </label>
                {inputField}
                <span className="error"></span>
            </div>
        )
    }
}

export default MyInput;