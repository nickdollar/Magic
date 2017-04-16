import Formsy from 'formsy-react';

export default class MyAppForm extends React.Component {
    constructor() {
        super();
        this.state = {canSubmit: false}
    }

    enableButton() {
        this.setState({
            canSubmit: true
        });
    }

    disableButton() {
        this.setState({
            canSubmit: false
        });
    }

    submit(model) {
        someDep.saveEmail(model.email);
    }

    render() {
        return (
            <Formsy.Form onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
                <MyOwnInput name="email" validations="isEmail" validationError="This is not a valid email" required/>
                <button type="submit" disabled={!this.state.canSubmit}>Submit</button>
            </Formsy.Form>
        );
    }
}