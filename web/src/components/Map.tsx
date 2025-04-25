import styles from "./Map.module.css";
import L from "leaflet";
import {
  MapContainer,
  Popup,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { useAuthHeader } from "@/hooks";

const API_HOST = import.meta.env.VITE_API_HOST;

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

export function Map() {
  const { user } = useUser();
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { getAuthHeader } = useAuthHeader();

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`${API_HOST}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
          setMapCenter([parseFloat(lat), parseFloat(lon)]);
        } else {
          console.warn(
            "No geocode data for this address, using default map center."
          );
        }
      } catch (error) {
        const err = error as AxiosError;
        const response = err.response as AxiosResponse;
        if (response.status === 404) {
          console.log("redirecting to register page");
          navigate("/register");
        }
        console.log(response);
        console.error("There was a problem fetching the user location:", error);
      }
    };

    fetchUserLocation();
  }, [user]);

  useEffect(() => {
    async function fetchBoxes() {
      try {
        const response = await axios.get(`${API_HOST}/boxes`);
        setBoxes(response.data);
      } catch (error) {
        console.error("There was a problem fetching the boxes: ", error);
      }
    }
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

  async function addBox(latlng: L.LatLng) {
    const { lat, lng } = latlng;
    const newBox = {
      location: `SRID=4326;POINT(${lng} ${lat})`,
    };
    const headers = await getAuthHeader();
    await axios.post(`${API_HOST}/boxes`, newBox, {
      headers,
    });
    const response = await axios.get(`${API_HOST}/boxes`);
    setBoxes(response.data);
  }

  function AddBoxOnClick() {
    useMapEvents({
      click(e) {
        if (!user) {
          console.error("User is not authenticated");
          alert("Please log in to add a box.");
          return;
        }

        addBox(e.latlng)
          .then(() => {
            console.debug("then");
          })
          .catch((error) => {
            console.error("There was a problem adding the new box:", error);
          });
      },
    });
    return null;
  }

  const handleAddItem = async (e: React.FormEvent, box_id: number) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    if (!newItemName.trim()) {
      return;
    }

    try {
      const newItem = {
        box_id,
        item_name: newItemName,
      };
      const headers = await getAuthHeader();
      const response = await axios.post(
        `${API_HOST}/boxes/${box_id}/items`,
        newItem,
        { headers }
      );

      const itemToBeAdded: Item = response.data;

      setItems((prevItems) => [itemToBeAdded, ...prevItems]);
      setNewItemName("");
    } catch (error) {
      console.error("There was a problem adding the new item:", error);
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
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const headers = await getAuthHeader();
      await axios.delete(`${API_HOST}/boxes/${box.box_id}`, {
        headers,
      });
      setBoxes((prevBoxes) => prevBoxes.filter((b) => b.box_id !== box.box_id));
      setItems((prevItems) =>
        prevItems.filter((item) => item.box_id !== box.box_id)
      );
    } catch (error) {
      console.error("There was a problem deleting the box:", error);
    }
  };

  const getIconColor = (box: Box) => {
    const itemsByBox = items.filter((item) => item.box_id === box.box_id);
    const isOwner = box.user_id === user?.id;
    const isEmptyOrAllChecked =
      itemsByBox.length === 0 || itemsByBox.every((item) => item.is_checked);

    let iconColor = "";

    if (isOwner && isEmptyOrAllChecked) {
      iconColor = "gold";
    } else if (isOwner) {
      iconColor = "blue";
    } else if (isEmptyOrAllChecked) {
      iconColor = "grey";
    } else {
      iconColor = "green";
    }

    const iconUrl = `/marker-icon-${iconColor}.png`;

    return L.icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -40],
    });
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

  if (!mapCenter) {
    return (
      <div>
        Loading Map... <br />
        By the time you finish reading this, you should see the map. If you are
        still reading this message, it means we are having trouble getting your
        location. If you can still read this, please click on the blue house
        icon in the top right corner to go to reset your address.
      </div>
    );
  }

  return (
    <>
      <MapContainer
        center={mapCenter}
        zoom={16}
        style={{ height: "400px", width: "100%" }} // height must always be defined
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredBoxes.map((box) => {
          const itemsByBox = items.filter((item) => item.box_id === box.box_id);
          const isOwner = box.user_id === user?.id;
          const icon = getIconColor(box);
          let zIndexOffset = 0;

          if (icon.options.iconUrl.includes("green")) {
            zIndexOffset = 1000;
          } else if (icon.options.iconUrl.includes("gold")) {
            zIndexOffset = 750;
          } else if (icon.options.iconUrl.includes("blue")) {
            zIndexOffset = 500;
          } else if (icon.options.iconUrl.includes("grey")) {
            zIndexOffset = 250;
          }

          return (
            <Marker
              key={box.box_id}
              position={[box.latitude, box.longitude]}
              icon={icon}
              zIndexOffset={zIndexOffset}
            >
              <Popup key={box.box_id}>
                <ul>
                  {itemsByBox.every((item) => item.is_checked) &&
                  itemsByBox.length > 0 ? (
                    isOwner ? (
                      <li className={styles.listMessage}>
                        It looks like all your items have found a new home!
                        Please remove this box when you can, or add new items!
                      </li>
                    ) : (
                      <li className={styles.listMessage}>
                        It looks like all these items have already found a new
                        home!
                      </li>
                    )
                  ) : null}
                  {itemsByBox.length > 0 ? (
                    itemsByBox.map((item) => (
                      <li className={styles.listItem} key={item.item_id}>
                        <input
                          className={styles.checkbox}
                          type="checkbox"
                          checked={item.is_checked}
                          onChange={() => handleCheckItem(box, item)}
                        />
                        <label
                          style={{
                            textDecoration: item.is_checked
                              ? "line-through"
                              : "none",
                            color: item.is_checked ? "grey" : "inherit",
                          }}
                        >
                          {item.item_name}
                        </label>
                      </li>
                    ))
                  ) : (
                    <li className={styles.listMessage}>
                      This box is empty, add items for other users to find!
                    </li>
                  )}
                </ul>
                {isOwner && (
                  <>
                    <form
                      className={styles.addItemForm}
                      onSubmit={(e) => handleAddItem(e, box.box_id)}
                    >
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Enter a new item"
                        required
                      />
                      <button type="submit">Add Item</button>
                    </form>
                    <button
                      className={styles.deleteBoxButton}
                      onClick={() => handleDeleteBox(box)}
                    >
                      Delete Box
                    </button>
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}
        <AddBoxOnClick />
      </MapContainer>
      <div className={styles.search}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            name="items"
            id="items"
            placeholder="See only boxes with this item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" onClick={() => setSearchTerm("")}>
            Clear Filter
          </button>
        </form>
      </div>
    </>
  );
}
