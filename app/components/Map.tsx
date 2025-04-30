import React, { useEffect, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { CheckBox } from "react-native-elements";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { globalStyles } from "@/styles/globalStyles";

const API_HOST = process.env.EXPO_PUBLIC_API_HOST;

interface Box {
  box_id: number;
  user_id: string;
  latitude: number;
  longitude: number;
}

interface Item {
  item_id: number;
  box_id: number;
  item_name: string;
  is_checked: boolean;
}

export default function Map() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserLocation = async () => {
      const token = getToken();
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        try {
          //   console.error("Permission to access location was denied");
          const response = await axios.get(`${API_HOST}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          const address = `${userData.street} ${userData.house_number}, ${userData.postal_code} ${userData.city}, ${userData.country}`;
          const geoCodeRes = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
              params: {
                q: address,
                format: "json",
                limit: 1,
              },
              headers: {
                "Accept-Language": "en",
              },
            }
          );
          if (geoCodeRes.data.length > 0) {
            const { lat, lon } = geoCodeRes.data[0];
            setUserLocation({ latitude: lat, longitude: lon });
          } else {
            console.warn(
              "No geocode data for this address, please check your address in the settings page."
            );
          }
        } catch (error) {
          console.error("Error fetching user address: ", error);
        }
      } else {
        try {
          const location = await Location.getCurrentPositionAsync({});

          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (error) {}
      }
    };
    fetchUserLocation;
  }, []);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`${API_HOST}/boxes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBoxes(response.data);
      } catch (error) {
        console.error("Error fetching boxes:", error);
      }
    };

    fetchBoxes();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      try {
        const itemsData: Item[] = [];
        for (const box of boxes) {
          const response = await axios.get(
            `${API_HOST}/boxes/${box.box_id}/items`
          );
          itemsData.push(...response.data);
        }
        setItems(itemsData);
      } catch (error) {
        console.error("Error preloading box items:", error);
      }
    }
    if (boxes.length > 0) {
      fetchItems();
    }
  }, [boxes]);

  const handleAddItem = async (box_id: number) => {
    if (!newItemName.trim()) return;
    try {
      const token = await getToken();
      const newItem = { box_id, item_name: newItemName };
      const response = await axios.post(
        `${API_HOST}/boxes/${box_id}/items`,
        newItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems((prevItems) => [response.data, ...prevItems]);
      setNewItemName("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleCheckItem = async (box: Box, item: Item) => {
    try {
      const updated = {
        is_checked: !item.is_checked,
      };
      const response = await axios.patch(
        `${API_HOST}/boxes/${box.box_id}/items/${item.item_id}`,
        updated
      );
      const filteredItems = items.filter((item) => {
        return item.item_id !== response.data.item_id;
      });
      const updatedItems = [...filteredItems, response.data];
      setItems(updatedItems);
      const sortedItems = updatedItems.sort((a, b) => {
        if (a.is_checked === b.is_checked) {
          return 0;
        } else if (a.is_checked && !b.is_checked) {
          return 1;
        } else {
          return -1;
        }
      });
      setItems(sortedItems);
    } catch (error) {
      console.error("There was a problem updating the item:", error);
    }
  };

  const handleDeleteBox = async (box: Box) => {
    try {
      const token = await getToken();
      await axios.delete(`${API_HOST}/boxes/${box.box_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBoxes((prevBoxes) => prevBoxes.filter((b) => b.box_id !== box.box_id));
      setItems((prevItems) =>
        prevItems.filter((item) => item.box_id !== box.box_id)
      );
    } catch (error) {
      console.error("There was a problem deleting the box:", error);
    }
  };

  const markerIcon: Record<"gold" | "blue" | "grey" | "green", JSX.Element> = {
    gold: (
      <Image
        source={require("../assets/icons/marker-icon-gold.png")}
        style={{ width: 25, height: 41 }}
      />
    ),
    blue: (
      <Image
        source={require("../assets/icons/marker-icon-blue.png")}
        style={{ width: 25, height: 41 }}
      />
    ),
    grey: (
      <Image
        source={require("../assets/icons/marker-icon-grey.png")}
        style={{ width: 25, height: 41 }}
      />
    ),
    green: (
      <Image
        source={require("../assets/icons/marker-icon-green.png")}
        style={{ width: 25, height: 41 }}
      />
    ),
  };

  const getIconColorAndZIndex = (box: Box) => {
    const itemsByBox = items.filter((item) => item.box_id === box.box_id);
    const isOwner = box.user_id === user?.id;
    const isEmptyOrAllChecked =
      itemsByBox.length === 0 || itemsByBox.every((item) => item.is_checked);

    let iconColor: "gold" | "blue" | "grey" | "green";
    let zIndex = 0;

    if (!isOwner && !isEmptyOrAllChecked) {
      iconColor = "green";
      zIndex = 1000;
    } else if (isOwner && isEmptyOrAllChecked) {
      iconColor = "gold";
      zIndex = 750;
    } else if (isOwner) {
      iconColor = "blue";
      zIndex = 500;
    } else {
      iconColor = "grey";
      zIndex = 250;
    }

    return markerIcon[iconColor];
  };

  const filteredBoxes = boxes.filter((box) => {
    const itemsByBox = items.filter((item) => item.box_id === box.box_id);
    if (!searchTerm.trim()) return true;
    return itemsByBox.some(
      (item) =>
        !item.is_checked &&
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={
            userLocation
              ? {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : {
                  latitude: 50.73288,
                  longitude: 7.090452,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
          }
          showsUserLocation={true}
          pointerEvents="box-none"
        >
          {filteredBoxes.map((box) => {
            const itemsByBox = items.filter(
              (item) => item.box_id === box.box_id
            );
            const isOwner = box.user_id === user?.id;

            return (
              <Marker
                key={box.box_id}
                coordinate={{
                  latitude: box.latitude,
                  longitude: box.longitude,
                }}
                onPress={() =>
                  console.log(`Marker pressed for box: ${box.box_id}`)
                }
              >
                {getIconColorAndZIndex(box)}
                <Callout>
                  <View style={styles.callout}>
                    {itemsByBox.every((item) => item.is_checked) &&
                    itemsByBox.length > 0 ? (
                      isOwner ? (
                        <Text style={styles.calloutTitle}>
                          It looks like all your items have found a new home!
                          Please remove this box when you can, or add new items!
                        </Text>
                      ) : (
                        <Text style={styles.calloutTitle}>
                          It looks like all these items have already found a new
                          home!
                        </Text>
                      )
                    ) : null}
                    {itemsByBox.length > 0 ? (
                      <FlatList
                        data={itemsByBox}
                        keyExtractor={(item) => item.item_id.toString()}
                        renderItem={({ item }) => (
                          <View style={styles.item}>
                            <CheckBox
                              checked={item.is_checked}
                              onPress={() => handleCheckItem(box, item)}
                            />
                            <Text
                              style={[
                                styles.itemText,
                                item.is_checked && styles.itemChecked,
                              ]}
                            >
                              {item.item_name}
                            </Text>
                          </View>
                        )}
                      />
                    ) : (
                      <Text style={styles.calloutTitle}>
                        This box is empty, add items for other users to find!
                      </Text>
                    )}
                    {isOwner && (
                      <View>
                        <TextInput
                          style={styles.input}
                          placeholder="Add an item"
                          value={newItemName}
                          onChangeText={(text) => {
                            setNewItemName(text);
                          }}
                        />
                        <Pressable
                          style={({ pressed }) => {
                            return [
                              globalStyles.button,
                              pressed && globalStyles.buttonPressed,
                            ];
                          }}
                          onPress={() => handleAddItem(box.box_id)}
                        >
                          <Text style={[globalStyles.buttonText]}>
                            Add Item
                          </Text>
                        </Pressable>
                        <Pressable
                          style={({ pressed }) => {
                            return [
                              globalStyles.button,
                              pressed && globalStyles.buttonPressed,
                            ];
                          }}
                          onPress={() => handleDeleteBox(box)}
                        >
                          <Text style={[globalStyles.buttonText]}>
                            Delete Box
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      </View>
      <TextInput
        style={styles.input}
        placeholder="See only boxes with this item..."
        value={searchTerm}
        onChangeText={(text) => {
          setSearchTerm(text);
        }}
      />
      <Pressable
        style={({ pressed }) => {
          return [globalStyles.button, pressed && globalStyles.buttonPressed];
        }}
        onPress={() => {
          setSearchTerm("");
        }}
      >
        <Text style={[globalStyles.buttonText]}>Clear Filter</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  callout: {
    width: 200,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  itemText: {
    flex: 1,
  },
  itemChecked: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
});
