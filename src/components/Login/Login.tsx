import React, {Component} from 'react';
import {Redirect, RouteComponentProps} from "react-router";

export interface LoginProps extends RouteComponentProps {
    loginSuccess: Function
}

class Login extends Component<LoginProps> {
    state = { redirectToReferrer: false };

    login = () => {
        this.setState({
            redirectToReferrer: true
        });
        this.props.loginSuccess();
    };

    render() {
        const { from } = this.props.location.state || { from: { pathname: "/" } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }
        return (
                <button onClick={this.login}>Log in</button>
        );
    }
}

export default Login;
