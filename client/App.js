
import React,{useEffect,useState} from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Scan from './screens/Scan';
const Stack = createStackNavigator();

const App= () => {
   const [isloggedin,setLogged] = useState(null)

   const detectLogin= async ()=>{
      const token = await AsyncStorage.getItem('username')
      if(token){
          setLogged(true)
      }else{
          setLogged(false)
      }
   }
  useEffect(()=>{
     detectLogin()
  },[])


  return (
    <NavigationContainer>
      <Stack.Navigator
      >   
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="scan" component={Scan} /> 
      </Stack.Navigator>
    </NavigationContainer>

  );
};


export default App;
