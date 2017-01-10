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
  ListView,
  Dimensions,
  TouchableHightlight,

} from 'react-native';
import * as firebase from 'firebase';
const {height,width}= Dimnsions.get('window');
var ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>  r1 != r2});


export default class baseTester extends Component {
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({
      sectionHeaderHasChanged:(r1,r2)=> r1!==r2,
      rowHasChanged:(r1,r2) => r1!==r2
    });
    this.state={
      dataSource:ds.cloneWithRows([]),
    };
    this.contact = {};
    this.nameContact=[];
  };

  componentWillMount(){
    var config = {
        apiKey: "AIzaSyAybf1tUlfoimJSJ_Mr1FEYUGbBXkPKlrM",
        authDomain: "basetester-1165a.firebaseapp.com",
        databaseURL: "https://basetester-1165a.firebaseio.com",
        storageBucket: "",
        messagingSenderId: "962292988674"
              };
    firebase.initializeApp(config);
    this._listenForChildAddedEvent();
  };

  _listenForChildAddedEvent(){
      var personRef= firebase.database().ref('/users/1/ss_conversations');
      personRef.on('child_added',(snapshot)=>{
          var key=snapshot.key;
          this.contact[key]=
            {
              conversationType:"ss_conversations",
              conversationId:snapshot.key,
              Fname:'',
              Lname:'',
            };

          var nameRef=firebase.database().ref('/users/'+key+'/');
          nameRef.once('value',(snapshot)=>{
            this.contact[snapshot.key].Fname=snapshot.val().first_name;
            this.contact[snapshot.key].Lname=snapshot.val().last_name;
            this.nameContact.push(this.contact[snapshot.key]);
            console.warn(JSON.stringify(this.nameContact));
            this.setState({dataSource:this.state.dataSource.cloneWithRows(this.nameContact)
            })
          });
      });

    };






 _renderRow(rowData){
  return(
    <View style={styles.rowContainer}>
      <View>
        <Text style={styles.text}>
          {rowData.Fname} {rowData.Lname}
          </Text>
      </View>
    </View>
  );
 };


  render() {
    return (
      <View style={styles.container}>
          <ListView
            style={styles.ListView}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            enableEmptySections={true}

            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  ListView:{
    backgroundColor:'#F5FCFF',
    marginTop: 40,
  },

  rowContainer:{
    width:width*0.8,
    flexDirection:'row',
    backgroundColor:'#FFFFFF',
    justifyContent:'space-between',
    paddingRight:10,
    borderBottomWidth:1,
    borderBottomColor:'#E8E8E8',
  },

  tempRow: {
    height: 60,
    backgroundColor:'#EFEFEF',
    borderBottomWidth:1,
    borderBottomColor: '#E8E8E8',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },


  rowText:{

  }

});

AppRegistry.registerComponent('baseTester', () => baseTester);
