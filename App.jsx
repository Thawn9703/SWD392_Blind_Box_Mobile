import React from "react";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import store from "./src/domain/store/redux/store"; 
import StackNavigation from "@presentation/navigation/navigate/stack.navigation.jsx";
import { CartProvider } from "@presentation/context/CartContext";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <CartProvider>
          <StackNavigation />
        </CartProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
