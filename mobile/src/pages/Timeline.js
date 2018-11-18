import React, { Component } from 'react'
import api from '../services/api';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import Tweet from '../components/Tweet';
import socket from 'socket.io-client';


import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Timeline extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Início",
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('New')}
      >
        <Icon
          style={{ marginRight: 20 }}
          name="add-circle-outline"
          size={24}
          color="#4BB0EE"
        />
      </TouchableOpacity>
      
    )
  })

  state = {
    tweets: [],
  };

  async componentDidMount() {
    this.subscribeToEvents();

    const responde = await api.get('tweets');

    this.setState({ tweets: responde.data });
  }

  subscribeToEvents = () => {
    const io = socket('https://twitter-mongo.glitch.me/');

    io.on('tweet', data => {
      this.setState({ tweets: [data, ...this.state.tweets]});
    });

    io.on('like', data => {
      this.setState({ tweets: this.state.tweets.map( tweet =>
        tweet._id === data._id ? data : tweet
        ) });
    });
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <FlatList 
          data={this.state.tweets}
          keyExtractor={tweet => tweet._id}
          renderItem={({ item }) => <Tweet tweet={item} />}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }
});