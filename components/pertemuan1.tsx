import {Text, View, StyleSheet, Image} from 'react-native';

const App = () => {
  return(
    <View>
      <Text style={styles.teksPembuka}>Halo Semuanya!</Text>
      <Text style={styles.teksPembuka}>Horeeee</Text>
      <Image source = {require('@/assets/images/favicon.png')} />
    </View>
  )
}

export default App;

const styles = StyleSheet.create({
  teksPembuka:{
    paddingTop : 20
  }
})