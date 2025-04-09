import "./Map.css";
import {
  MapContainer,
  Popup,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const API_HOST = import.meta.env.VITE_API_HOST;

interface Box {
  box_id: number;
  user_id: number;
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
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [boxItems, setBoxItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [zuschUserId, setZuschUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get(`${API_HOST}/users/${user.id}`, {
          params: { clerk_id: user?.id },
        });
        if (response.data && response.data.user_id) {
          setZuschUserId(response.data.user_id);
        } else {
          console.warn("User not found or invalid clerk_id");
        }
      } catch (error) {
        console.error("There was a problem fetching the user ID:", error);
      }
    };
    if (user) {
      fetchUserId();
    }
  }, [user]);

  useEffect(() => {
    async function fetchBoxes() {
      try {
        const response = await axios.get(`${API_HOST}/boxes`);
        setBoxes(response.data);
      } catch (error) {
        console.error("There was a problem fetching the boxes");
      }
    }
    fetchBoxes();
  }, []);

  useEffect(() => {
    async function fetchBoxItems() {
      try {
        const boxItemsData: Item[] = [];
        for (const box of boxes) {
          const response = await axios.get(
            `${API_HOST}/boxes/${box.box_id}/items`
          );
          boxItemsData.push(...response.data);
        }
        setBoxItems(boxItemsData);
      } catch (error) {
        console.error("Error preloading box items:", error);
      }
    }
    if (boxes.length > 0) {
      fetchBoxItems();
    }
  }, [boxes]);

  function AddUserBoxesOnClick() {
    useMapEvents({
      click(e) {
        if (!user) {
          console.error("User is not authenticated");
          alert("Please log in to add a box.");
          return;
        }

        const { lat, lng } = e.latlng;

        const newBox = {
          location: `SRID=4326;POINT(${lng} ${lat})`,
        };

        axios
          .post(`${API_HOST}/boxes`, newBox, {
            headers: {
              Authorization: user.id,
            },
          })
          .then(() => {
            axios.get(`${API_HOST}/boxes`).then((response) => {
              setBoxes(response.data);
            });
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
      const response = await axios.post(
        `${API_HOST}/boxes/${box_id}/items`,
        newItem,
        {
          headers: {
            Authorization: user.id,
          },
        }
      );

      const itemToBeAdded: Item = response.data;

      setBoxItems((prevItems) => [itemToBeAdded, ...prevItems]);
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
      const filteredItems = boxItems.filter((item) => {
        return item.item_id !== response.data.item_id;
      });
      const updatedItems = [...filteredItems, response.data];
      setBoxItems(updatedItems);
      const sortedItems = updatedItems.sort((a, b) => {
        if (a.is_checked === b.is_checked) {
          return 0;
        } else if (a.is_checked && !b.is_checked) {
          return 1;
        } else {
          return -1;
        }
      });
      setBoxItems(sortedItems);
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
      await axios.delete(`${API_HOST}/boxes/${box.box_id}`, {
        headers: {
          Authorization: user.id,
        },
      });
      setBoxes((prevBoxes) => prevBoxes.filter((b) => b.box_id !== box.box_id));
      setBoxItems((prevItems) =>
        prevItems.filter((item) => item.box_id !== box.box_id)
      );
    } catch (error) {
      console.error("There was a problem deleting the box:", error);
    }
  };

  return (
    <>
      <MapContainer
        center={[50.73288, 7.090452]}
        zoom={16}
        style={{ height: "400px", width: "100%" }} // height must always be defined
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {boxes.map((box) => {
          return (
            <Marker key={box.box_id} position={[box.latitude, box.longitude]}>
              <Popup key={box.box_id}>
                <ul>
                  {boxItems
                    .filter((item) => item.box_id === box.box_id)
                    .map((item) => (
                      <li key={item.item_id}>
                        <label
                          style={{
                            textDecoration: item.is_checked
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {item.item_name}
                        </label>
                        <input
                          type="checkbox"
                          checked={item.is_checked}
                          onChange={() => handleCheckItem(box, item)}
                        />
                      </li>
                    ))}
                </ul>
                {box.user_id === zuschUserId && (
                  <>
                    <form onSubmit={(e) => handleAddItem(e, box.box_id)}>
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Enter a new item"
                        required
                      />
                      <button type="submit">Add Item</button>
                    </form>
                    <button onClick={() => handleDeleteBox(box)}>
                      Delete Box
                    </button>
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}
        <AddUserBoxesOnClick />
      </MapContainer>
    </>
  );
}
