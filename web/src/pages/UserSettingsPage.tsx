import "./UserSettingsPage.css";
import { Header } from "../components/Header";
import countries from "world-countries";
import React, { useState } from "react";
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
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    street: "",
    house_number: "",
    postal_code: "",
    city: "",
    country: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedUserInfo = {
      user_name: formData.user_name,
      email: formData.email,
      street: formData.street,
      house_number: formData.house_number,
      postal_code: formData.postal_code,
      city: formData.city,
      country: formData.country,
    };
    console.log("Updated User Info:", updatedUserInfo);
    try {
      const token = await getToken();
      const response = await axios.patch(
        `${API_HOST}/users/${clerk_id}`,
        updatedUserInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("There was a problem submitting the form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await getToken();
      const response = await axios.delete(`${API_HOST}/users/${clerk_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Account deleted successfully:", response.data);
    } catch (error) {
      console.error("There was a problem deleting the account:", error);
      alert("There was an error deleting the account. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <h1>Settings</h1>
      <h2>User Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Change Username</label>
          <input
            type="text"
            placeholder="New Username"
            id="username"
            value={formData.user_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Change Email</label>
          <input
            type="text"
            placeholder="New Email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <p>this will have to be connected to Clerk somehow</p>

        <div>
          <label htmlFor="street">Street</label>
          <input
            type="text"
            name="street"
            id="street"
            placeholder="New Street"
            value={formData.street}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="house_number">House Number</label>
          <input
            type="text"
            placeholder="New House Number"
            id="house_number"
            value={formData.house_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="postal_code">Postal Code</label>
          <input
            type="text"
            placeholder="New Postal Code"
            id="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            placeholder="New City"
            id="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <select
            name="country"
            id="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select your country</option>
            {countryList.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Update User Info</button>
      </form>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </>
  );
}
