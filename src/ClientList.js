import Component from 'react';
import {
  Text,
  ListView,
  StyleSheet,
  View,
  Image
} from 'react-native';
import * as firebase  from 'firebase';
import NavigationBar from 'react-native-navigationbar';

export class ClientList extends React.Component {
  constructor (props){
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row1','row2']),
    }
  }

render(){
    return(
      <ListView
        styles= {styles.container}
        dataSource = {this.state.dataSource}
        renderRow = {(data) => <Row {...data}/>}
        renderSeparator = {(sectionId, rowId) =>
          <View key={rowId} style= {styles.separator}}/>
        renderHeader = {()=> <SearchBar /> }
        renderFooter = { () => <Footer /> }
        />
        )
      }
}//clientList brackets


const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 20,
  },
   text:{
     marginLeft: 12,
     fontSize: 12
  },
   pic: {
    height : 40,
    width: 40,
    borderRadius: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  //row view
  Rowcontainer: {
    flex:1,
    padding:12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  RowText: {
   marginLeft: 12,
   fontSize: 16
 },
 //header view
  headerContainer: {
    flex:1,
    padding: 8,
    flextDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C1C1C1',
  },

  input: {
    height: 30,
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2
  },

//Footer
  FooterContainer:{
    flex:1,
    padding: 8,
    alignItems: 'center'
  },

  LoadMorebutton: {
    borderColor: '#8E8E8E',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  }
});


 const Row = (props)=>(
   <View style = {styles.container}>
    <Image source = {{ url: } style = {styles.pic}}/>
      <Text style ={ styles.text}>
      "Name"
      </Text>
    </View>);
//object header search bar customable into data base
const SearchBar = (props) => (
  <View style= { styles.container }>
    <TextInput
      style= {styles.input}
      placeholder = "Search"
      onChangeText= {(text) => console.log('searching for ', text)}/>
  </View>
)
//loaderable  end footer for optimize the loading time
const Footer = (props) => (
  <View style={styles.FooterContainer}>
      <TouchableOpacity style={styles.button} onPress={() => console.log('load more')}>
        <Text style={styles.text}>Load More</Text>
      </TouchableOpacity>
    </View>
)

module.exports = ClientList;
