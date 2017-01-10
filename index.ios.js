
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  ListView,
  Dimension
} from 'react-native';
import * as firebase from 'firebase';
import MessageDisplay from './message_display';
import NavigationBar from 'react-native-navigationbar';
import{KeyboardAwareView} from 'react-native-keyboard-aware-view';


class Chat extends Component {

  componentWillMount() {
    // initialize firebase
    var firebaseConfig = {
      apiKey: "AIzaSyAybf1tUlfoimJSJ_Mr1FEYUGbBXkPKlrM",
    authDomain: "basetester-1165a.firebaseapp.com",
    databaseURL: "https://basetester-1165a.firebaseio.com",
    storageBucket: "basetester-1165a.appspot.com",
    messagingSenderId: "962292988674"
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
    backToFriendList(){
      this.props.navigator.push({id:'Contacts'})
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
      sender_user: this.user_id,
    })));
    // Fix bug of onSubmitEditing on Android
    // Blur the TextInput mannually
    this._input.blur();
    this.setState({input: ''});
  }

  //Navigation methods
  _backToFriendlist(){
    this.props.navigator.push({id: 'FriendList'})
  }





  render() {
    return (
      <View style={styles.container}>
      <KeyboardAwareView
        animated = {true}>
      <NavigationBar title = { 'Name'}/>

        <MessageDisplay
          ref = {component => this.message_display = component}
          dataSource = {this.state.messages}
          userID = {this.user_id} />
        <View style={styles.input_area}>

          <TextInput
            ref = {component => this._input = component}
            style = {styles.input}
            returnKeyType = "send"
            onSubmitEditing = {this._sendMessage.bind(this)}
            onChangeText= { (text) => {this._input.isFocused() ? this.setState({input:text}):
                                          this.setState({input:''})}}
            value= {this.state.input}
            blurOnSubmit = {false}
            enablesReturnKeyAutomatically = {true}
            onFocus = {() => {
              this._bottomFocus = true;
              this.message_display.forceFocusOnLastMessage();
            }} />
        </View>
        </KeyboardAwareView>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF'
  },
  message_area: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'green'
  },

  input_area: {
    alignSelf: 'stretch',
    height: 50,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'gray',
  },
  input: {
    height: 35,
    backgroundColor: 'white',
    margin: 15,
    marginRight: 60,
    borderRadius: 10
  }
});

AppRegistry.registerComponent('chat', () => Chat);
