import { useAuthHeader } from "@/hooks";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import countries from "world-countries";
import { Header } from "../components/Header";
import styles from "./UserSettingsPage.module.css";
import { useNavigate } from "react-router";

const API_HOST = import.meta.env.VITE_API_HOST;

const countryList = countries.map((country) => ({
  name: country.name.common,
}));

export function UserSettingsPage() {
  const { user } = useUser();
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const { getAuthHeader } = useAuthHeader();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        alert("User not found. Please try again.");
        return;
      }
      try {
        const headers = await getAuthHeader();
        const response = await axios.get(`${API_HOST}/user`, { headers });
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
  }, [user]);

  const handleUpdateAddress = async () => {
    if (!user) {
      alert("User not found. Please try again.");
      return;
    }
    if (!street || !houseNumber || !postalCode || !city || !country) {
      alert("Please fill in all fields to update your address.");
      return;
    }
    try {
      const headers = await getAuthHeader();
      await axios.patch(
        `${API_HOST}/user`,
        {
          street: street,
          house_number: houseNumber,
          postal_code: postalCode,
          city: city,
          country: country,
        },
        { headers }
      );
      navigate("/");
    } catch (error) {
      console.error("There was a problem updating the address:", error);
      alert("There was an error updating the address. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <h1>Address</h1>
      <p>
        Please note that a valid address is required for Zusch! to run properly.
        <br />
        Please fill in the form completely to proceed.
      </p>
      <form className={styles.userSettingsForm}>
        <label htmlFor="street">Street: </label>
        <input
          type="text"
          placeholder="New Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <label htmlFor="house_number">House Number: </label>
        <input
          type="text"
          placeholder="New House Number"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
        />
        <label htmlFor="postal_code">Postal Code: </label>
        <input
          type="text"
          placeholder="New Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <label htmlFor="city">City: </label>
        <input
          type="text"
          placeholder="New City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <label htmlFor="country">Country: </label>
        <select
          name="country"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Select your country</option>
          {countryList.map((country) => (
            <option key={country.name} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        <button
          className={styles.updateAddressButton}
          type="button"
          onClick={handleUpdateAddress}
          disabled={!street || !houseNumber || !postalCode || !city || !country}
        >
          Update Address
        </button>
      </form>
    </>
  );
}
