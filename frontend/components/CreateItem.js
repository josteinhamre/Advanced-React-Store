import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage'
import Router from 'next/router'

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $price: Int!
        $description: String!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            price: $price
            description: $description
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;


class CreateItem extends Component {
    state = {
        title: 'Norrøna lofoten Gore-Tex Pro Jacket',
        description: 'The Perfect activity jacket',
        image: '',
        largeImage: '',
        price: 14999,
    };

    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val })
    }

    upploadFile = async e => {
        console.log('Uploading file...');
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits')

        const res = await fetch('https://api.cloudinary.com/v1_1/lightglance/image/upload', {
            method: 'POST',
            body: data
        });
        const file = await res.json();
        console.log(file);
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        })
    };

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error }) => (
                    <Form onSubmit={async e => {
                        // Stop the form from submitting
                        e.preventDefault();
                        // call the mutation
                        const res = await createItem();
                        // redirect to created item page.
                        Router.push({
                            pathname: '/item',
                            query: { id: res.data.createItem.id },
                        })
                    }}>
                        <Error error={error}/>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="file">
                                Imagge
                                <input 
                                    type="file" 
                                    id="file"
                                    name="file"
                                    placeholder="Upload an image" 
                                    required 
                                    onChange={this.upploadFile}    
                                    />
                                {this.state.image && <img src={this.state.image} alt={this.state.title} />}
                            </label>
                            <label htmlFor="title">
                                Title
                                <input 
                                    type="text" 
                                    id="title"
                                    name="title"
                                    placeholder="Title" 
                                    required 
                                    value={this.state.title}
                                    onChange={this.handleChange}    
                                    />

                            </label>
                            <label htmlFor="price">
                                Price
                                <input 
                                    type="number" 
                                    id="price"
                                    name="price"
                                    placeholder="Price" 
                                    required 
                                    value={this.state.price}
                                    onChange={this.handleChange}    
                                    />

                            </label>
                            <label htmlFor="description">
                                Description
                                <textarea 
                                    id="description"
                                    name="description"
                                    placeholder="Enter A Description" 
                                    required 
                                    value={this.state.description}
                                    onChange={this.handleChange}    
                                    />

                            </label>
                            <button type="submit">submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        )
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };