import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  ListView,
  StyleSheet,
  LayoutAnimation,
  Dimensions
} from 'react-native';

const {height,width} =Dimensions.get('window');

export default class MessageDisplay extends Component {
  constructor(props){
    super(props);
    this.state= {
        w:250,
        h:100
    }
  }
  setInitialState(){
    this.state.w = 0;
    this.state.h = 0;
  }

  componentWillMount() {
    // initialize variables for last message focus
    this._content_height = 0;
    this._view_height = 0;
    this._offset = 0;
    this._last_message_focus = true;
    this._messageSize = 0;
    console.warn('height ' +height);
    console.warn('width is '+width);
  //x  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }
  render() {
    return (

      <ListView
        dataSource = {this.props.dataSource}
        renderRow = {this._renderMessage.bind(this)}
        enableEmptySections = {true}
        onLayout = {ev => this._view_height = ev.nativeEvent.layout.height}
        onContentSizeChange = {(width, height)=>{
          this._content_height = height;
          this._focusOnLastMessage();
        }}
        onScroll = {(event)=>{
          if (event.nativeEvent.contentOffset.y < this._offset)
            this._last_message_focus = false;
          const scrollBottomOffsetY = this._content_height - this._view_height;
          if (event.nativeEvent.contentOffset.y - scrollBottomOffsetY > -2)
            this._last_message_focus = true;
          this._offset = event.nativeEvent.contentOffset.y;
          // console.warn(this._last_message_focus);
        }}
        renderScrollComponent = {(props) =>
          <ScrollView
            ref = {component => this._scroll_view = component}
            style = {{alignSelf:'stretch'}}
            onLayout = {props.onLayout}
            onContentSizeChange = {props.onContentSizeChange}
            onScroll = {props.onScroll}
            showsVerticalScrollIndicator = {false} />
        } />

    );
  }


  _focusOnLastMessage() {
    const bottom_offset = this._content_height - this._view_height;
    if (bottom_offset > 0 && this._last_message_focus)
      this._scroll_view.scrollTo({x:0, y:bottom_offset, false});
  }
  forceFocusOnLastMessage() {
    this._last_message_focus = true;
    this._focusOnLastMessage();
  }
  _renderMessage(msg) {
    var size =msg.content.length;

    if (msg.sender_user == this.props.userID)
      return this._renderOwnMessage(msg);
    else
      return this._renderOthersMessage(msg);


  }
  _renderOthersMessage(msg) {
    return (
      <View  style = {styles.receiverContainer}>
          <Text>{msg.content}</Text>
      </View>
    );
  }
  _renderOwnMessage(msg) {
    return (
    <View style = {styles.senderContainer}>
      <Text style={styles.inputText}>{msg.content}</Text>
    </View>
    );
  }

}


var styles= StyleSheet.create({
  header:{
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C1C1C1'
  },
  senderContainer:{
    borderWidth:1,
    borderColor: '#808080',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 8,
    margin:10,
    width: 0.7*width,
  },
  inputText: {
    alignSelf: 'center',
    alignItems: 'center',
    marginLeft:10

  },
  receiverContainer:{
    flex:1,
    borderWidth:2,
    backgroundColor: '#808080',
    borderRadius: 8,
    marginRight: 30,
    marginLeft: 240,
    margin: 10,
  },

  seperator:{
      flex:1,

  }

})
