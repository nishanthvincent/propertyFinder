import React, {Component} from 'react';
import {View,StyleSheet, Button, Text} from 'react-native';

export default class FlexPlayground extends Component<{}> {

    render() {
        return (
            <View>
                <Text>Hello world!</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    textContainer: {
        flex: 1
    },
});