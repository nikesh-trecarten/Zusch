import "./UserSettingsPage.css";
import { Header } from "../components/Header";
import countries from "world-countries";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

const API_HOST = import.meta.env.VITE_API_HOST;

const countryList = countries.map((country) => ({
  name: country.name.common,
}));

export function UserSettingsPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const clerk_id = user ? user.id : null;
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!clerk_id) {
        alert("User ID not found. Please try again.");
        return;
      }
      try {
        const token = await getToken();
        const response = await axios.get(`${API_HOST}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        setStreet(user.street);
        setHouseNumber(user.house_number);
        setPostalCode(user.postal_code);
        setCity(user.city);
        setCountry(user.country);
      } catch (error) {
        console.error("There was a problem fetching user info:", error);
        alert("There was an error fetching user info, please try again.");
      }
    };
    if (user) {
      fetchUserInfo();
    }
  }, [clerk_id, getToken]);

  const handleUpdateStreet = async () => {
    if (!clerk_id) {
      alert("User ID not found. Please try again.");
      return;
    }
    try {
      await axios.patch(`${API_HOST}/users/${clerk_id}`, {
        street: street,
      });
    } catch (error) {
      console.error("There was a problem updating the street:", error);
      alert("There was an error updating the street. Please try again.");
    }
  };

  const handleUpdateHouseNumber = async () => {
    if (!clerk_id) {
      alert("User ID not found. Please try again.");
      return;
    }
    try {
      await axios.patch(`${API_HOST}/users/${clerk_id}`, {
        house_number: houseNumber,
      });
    } catch (error) {
      console.error("There was a problem updating the house number:", error);
      alert("There was an error updating the house number. Please try again.");
    }
  };

  const handleUpdatePostalCode = async () => {
    if (!clerk_id) {
      alert("User ID not found. Please try again.");
      return;
    }
    try {
      await axios.patch(`${API_HOST}/users/${clerk_id}`, {
        postal_code: postalCode,
      });
    } catch (error) {
      console.error("There was a problem updating the postal code:", error);
      alert("There was an error updating the postal code. Please try again.");
    }
  };

  const handleUpdateCity = async () => {
    if (!clerk_id) {
      alert("User ID not found. Please try again.");
      return;
    }
    try {
      await axios.patch(`${API_HOST}/users/${clerk_id}`, {
        city: city,
      });
    } catch (error) {
      console.error("There was a problem updating the city:", error);
      alert("There was an error updating the city. Please try again.");
    }
  };

  const handleChangeCountry = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setCountry(value);
    if (!clerk_id) {
      alert("User ID not found. Please try again.");
      return;
    }
    try {
      await axios.patch(`${API_HOST}/users/${clerk_id}`, {
        country: country,
      });
    } catch (error) {
      console.error("There was a problem updating the country:", error);
      alert("There was an error updating the country. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <h1>Settings</h1>
      <h2>User Address</h2>
      <p>
        Please note that a valid address is required for Zusch! to run properly.
      </p>
      <form className="user-settings-form">
        <div>
          <label htmlFor="street">Street: {street} </label>
          <input type="text" placeholder="New Street" />
          <button onSubmit={handleUpdateStreet}>Update Street</button>
        </div>
        <div>
          <label htmlFor="house_number">House Number: {houseNumber} </label>
          <input type="text" placeholder="New House Number" />
          <button onSubmit={handleUpdateHouseNumber}>
            Update House Number
          </button>
        </div>
        <div>
          <label htmlFor="postal_code">Postal Code: {postalCode} </label>
          <input type="text" placeholder="New Postal Code" />
          <button onSubmit={handleUpdatePostalCode}>Update Postal Code</button>
        </div>
        <div>
          <label htmlFor="city">City: {city} </label>
          <input type="text" placeholder="New City" />
          <button onSubmit={handleUpdateCity}>Update City</button>
        </div>
        <div>
          <label htmlFor="country">Country: </label>
          <select
            name="country"
            id="country"
            value={country}
            onChange={handleChangeCountry}
          >
            <option value="">Select your country</option>
            {countryList.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </>
  );
}
