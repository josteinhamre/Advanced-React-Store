import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $name: String!
        $email: String!
        $password: String!
    ) {
        signUp(
            name: $name
            email: $email
            password: $password
        ) {
            id
            email
            name
        }
    }
`;

class Signup extends Component {
    state = {
        name: '',
        email: '',
        password: ''
    }
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <Mutation 
                mutation={SIGNUP_MUTATION}
                variables={this.state}
            >
                {(signup, { error, loading }) => {
                    return (
                        <Form method="post" onSubmit={async e => {
                            e.preventDefault();
                            await signup();
                            this.setState({ name: '', email: '', password: ''});
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Sign up for an account</h2>
                                <Error error={error} />
                                <label htmlFor="email">
                                    Email
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email"
                                        placeholder="Email" 
                                        required 
                                        value={this.state.email}
                                        onChange={this.saveToState}    
                                        />

                                </label>
                                <label htmlFor="name">
                                    Name
                                    <input 
                                        type="text" 
                                        id="name"
                                        name="name"
                                        placeholder="Name" 
                                        required 
                                        value={this.state.name}
                                        onChange={this.saveToState}    
                                        />

                                </label>
                                <label htmlFor="password">
                                    Password
                                    <input 
                                        type="password" 
                                        id="password"
                                        name="password"
                                        placeholder="Password" 
                                        required 
                                        value={this.state.password}
                                        onChange={this.saveToState}    
                                        />

                                </label>
                                <button type="submit">submit</button>
                            </fieldset>
                        </Form>
                        )
                }}
            </Mutation>
        )
    }
}

export default Signup;