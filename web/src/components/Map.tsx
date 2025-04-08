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
  latitude: number;
  longitude: number;
}

interface Item {
  item_id: number;
  box_id: number;
  item_name: string;
}

export function Map() {
  const { user } = useUser();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [boxItems, setBoxItems] = useState<Record<number, Item[]>>({});
  const [newItemName, setNewItemName] = useState("");
  // const [newItemBoxId, setNewItemBoxId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBoxes() {
      try {
        const response = await axios.get(`${API_HOST}/boxes`);
        console.log("Boxes:", response.data);
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
        const boxItemsData: Record<number, Item[]> = {};
        for (const box of boxes) {
          const response = await axios.get(
            `${API_HOST}/boxes/${box.box_id}/items`
          );
          if (Array.isArray(response.data)) {
            boxItemsData[box.box_id] = response.data;
          } else {
            console.warn(
              `Unexpected data format for box ${box.box_id};`,
              response.data
            );
          }
        }
        console.log("Setting box items:", boxItemsData);
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

      setBoxItems((prevItems) => {
        const updatedItems = prevItems[box_id] ? [...prevItems[box_id]] : [];
        updatedItems.push(itemToBeAdded);
        return { ...prevItems, [box_id]: updatedItems };
      });
      setNewItemName("");
    } catch (error) {
      console.error("There was a problem adding the new item:", error);
    }
  };

  return (
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
        console.log("boxItems for", box.box_id, ":", boxItems[box.box_id]);

        return (
          <Marker key={box.box_id} position={[box.latitude, box.longitude]}>
            <Popup key={box.box_id}>
              <ul>
                {boxItems[box.box_id] && boxItems[box.box_id].length > 0 ? (
                  boxItems[box.box_id].map((item) => (
                    <li key={item.item_id}>{item.item_name}</li>
                  ))
                ) : (
                  <li>Box empty</li>
                )}
              </ul>
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
            </Popup>
          </Marker>
        );
      })}
      <AddUserBoxesOnClick />
    </MapContainer>
  );
}
