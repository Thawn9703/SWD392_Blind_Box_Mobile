import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { Provider } from "react-redux";
import store from './src/redux/store';
import StackNavigation from './src/routes/navigate/stack.navigation';

export default function App() {
  return (
    <Provider store={store}>
        <NavigationContainer>
          <StackNavigation></StackNavigation>
        </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
