'use strict';

import React, {Component} from 'react';
import {Text, TextInput, View, ActivityIndicator, Image, Button, StyleSheet} from 'react-native';

import logo from "./Resources/house.png";
import SearchResults from "./SearchResults";

export default class SearchPage extends Component {

    constructor(props) {
         super(props);
         this.state =  {
             searchString: 'london',
             isLoading: false,
             message: ''
         }
    }

    _searchInputTextChanged = (event) => {
        console.log('current text ', this.state.searchString, 'New Text ', event.nativeEvent.text);
       this.setState({searchString: event.nativeEvent.text});
    };

    _executeQuery = (query) => {
        console.log('query ', query);
        this.setState({isLoading: true});
        fetch(query).then(response => response.json()).then(json => this._handleResponse(json.response)).catch(err => this.setState({
            isLoading: false,
            message: 'Something bad happened ' + err
        }))
    };

    _onSearchPressed = () => {
      const query = buildQueryUrl(this.state.searchString, 1);
      this._executeQuery(query);
    };

    _handleResponse = (response) => {
        this.setState({message: '', isLoading: false });
        if (response.application_response_code.substr(0, 1) === '1') {
            console.log('Properties found: ' + response.listings.length);
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {listings: response.listings}
            })
        } else {
            this.setState({ message: 'Location not recognized; please try again.', isLoading: false});
        }
    };

    render() {
        const spinner = this.state.isLoading ?
            <ActivityIndicator size='large'/> : null;
        return (
            <View style={styles.container}>
                <Image
                    source={logo}
                    style={styles.image} />
                <Text style={styles.description}>
                    Search for houses to buy!
                </Text>
                <Text style={styles.description}>
                    search by place-name or postcode
                </Text>
                <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder='Search Via name or postcode'
                        value={this.state.searchString}
                        onChange={this._searchInputTextChanged}
                    />
                    <Button
                        onPress={this._onSearchPressed}
                        color='#48BBEC'
                        title='Go'
                    />
                </View>
                {spinner}
            </View>
        );
    }
}

function buildQueryUrl(value, pageNumber) {
    const data = {
        country: 'uk',
        pretty: 1,
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber,
        place_name: value
    };
    const queryString = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
    return 'https://api.nestoria.co.uk/api?' + queryString;
}

const styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flexGrow: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: '#48BBEC',
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        color: '#48BBEC'
    },
    image: {
        width: 217,
        height: 138,
    },
});
