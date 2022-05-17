import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import APIurl from "../apiURL.js/APIurl";
import { Alert } from "react-native";
const Scan = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");
  const [product, setProduct] = useState(null);
  const [pid, setPid] = useState("");

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleScanagain = () => {
    setProduct(null);
    setScanned(false);
    setText("Scanning, please wait");
  };
  const handleSold = async () => {
    const res = await APIurl.delete(`/delete/${pid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (dataResponse) => {
      if (dataResponse.data.message === "Item sold") {
        try {
          Alert.alert("Item sold");
        } catch (e) {
          console.log("error hai", e);
          Alert.alert(e);
        }
      } else {
        Alert.alert("Fake product");
        return;
      }
    });
    setText("");
    setProduct(null);
  };
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setText(data);
    var tmp = "";
    for (let i = 0; i < data.length; i++) {
      if (data[i] === "\n") break;
      tmp = tmp + data[i];
    }
    setPid(tmp);
    console.log(tmp, "hi");
    const res = await APIurl.post(
      "/getSingleProduct",
      { pid: tmp },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(async (dataResponse) => {
      if (dataResponse.data.message === "Product") {
        try {
          setProduct(
            "Product Name : " +
              dataResponse.data.data.name +
              "\n" +
              "Company : " +
              dataResponse.data.data.company +
              "\n" +
              "Category : " +
              dataResponse.data.data.category +
              "\n" +
              "Color : " +
              dataResponse.data.data.color +
              "\n" +
              "Manufacturing Date : " +
              dataResponse.data.data.mfg +
              "\n" +
              "Expiry Date : " +
              dataResponse.data.data.expiry
          );
        } catch (e) {
          console.log("error hai", e);
          Alert.alert(e);
        }
      } else {
        Alert.alert(dataResponse.data.message);
        return;
      }
    });

    console.log("Type: " + type + "\nData: " + data);
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  // Return the View
  return (
    <View style={styles.container}>
      {!product ? (
        <>
          <View style={styles.barcodebox}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: 400, width: 400 }}
            />
          </View>
          {/* <Text style={styles.maintext}>{text}</Text> */}
        </>
      ) : (
        <>
          <View
            style={{
              padding: 4,
              margin: 2,
              borderWidth: 2,
              borderRadius: 6,
              borderColor: "grey",
            }}
          >
            <View
              style={{
                padding: 5,
                backgroundColor: "green",
                width: "20%",
                alignSelf: "flex-end",
                margin: 2,
              }}
            >
              <Text style={{ color: "white" }}>Verified</Text>
            </View>
            <Text style={styles.maintext}>{product}</Text>
          </View>
          <View style={{ margin: 5 }}>
            <Button title={"Sold?"} onPress={handleSold} color="tomato" />
          </View>
        </>
      )}

      {scanned && (
        <View style={{ margin: 5 }}>
          <Button
            title={"Scan again?"}
            onPress={handleScanagain}
            color="tomato"
            style={{ margin: 5 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
  },
});

export default Scan;
