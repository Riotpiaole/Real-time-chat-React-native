/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  ListView
} from 'react-native';
import * as firebase from 'firebase';
import MessageDisplay from './message_display';

class chat extends Component {

  componentWillMount() {
    // initialize firebase
    var firebaseConfig = {
      apiKey: "AIzaSyCCAzKHa91bXtHLVAwLBmULcBZjlTqCGwk",
      authDomain: "chat-62e4a.firebaseapp.com",
      databaseURL: "https://chat-62e4a.firebaseio.com",
      storageBucket: "chat-62e4a.appspot.com",
    };
    firebase.initializeApp(firebaseConfig);

    // initialize identity constants
    this.user_id = 1;
    this.conversation_id = "1_2";

    // constants for messaging
    this.INIT_NUM_OF_MESSAGES = 12;

    // initialize the message list ivew
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({messages:ds.cloneWithRows([])});

    // initialize the dynamic list of the messages
    // the list view has to clone with this list everytime a new message comes
    this.messages = [];

    // add listener for new messages
    this._listenForChildAddedEvent();
  }

  _listenForChildAddedEvent() {
    var messagesRef = firebase.database().ref('messages/' + this.conversation_id);
    messagesRef.limitToLast(this.INIT_NUM_OF_MESSAGES).on('child_added', (message) => {
      this.messages.push({
        content: message.val().content,
        sender_user: message.val().sender_user
      });
      // Calling setState for every message will make the listview render all messages in one frame
      // Does anyone knows why?
      this.setState({messages:this.state.messages.cloneWithRows(this.messages)});
    });
  }

  _sendMessage(event) {
    firebase.database().ref('messages/' + this.conversation_id).push(JSON.parse(JSON.stringify({
      type: "text",
      content: event.nativeEvent.text,
      timestamp_utc: new Date().getTime(),
      sender_user: this.user_id
    })));
    // Fix bug of onSubmitEditing on Android
    // Blur the TextInput mannually
    this._input.blur();
  }

  render() {
    return (
      <View style={styles.container}>
        <MessageDisplay
          dataSource = {this.state.messages}
          userID = {this.user_id} />
        <View style={styles.input_area}>
          <TextInput
            ref = {component => this._input = component}
            style = {styles.input}
            returnKeyType = "send"
            onSubmitEditing = {this._sendMessage.bind(this)}
            blurOnSubmit = {false}
            enablesReturnKeyAutomatically = {true}
            onFocus = {() => {
              this._bottomFocus = true;
              this._focusOnLastMessage();
            }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  message_area: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'green'
  },
  message_container: {

  },
  input_area: {
    alignSelf: 'stretch',
    height: 50,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'gray'
  },
  input: {
    height: 35,
    backgroundColor: 'white'
  }
});

AppRegistry.registerComponent('chat', () => chat);
