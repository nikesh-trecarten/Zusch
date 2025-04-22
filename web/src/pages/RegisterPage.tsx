import "./RegisterPage.css";
import { useState } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import countries from "world-countries";

const countryList = countries.map((country) => ({
  name: country.name.common,
}));

const API_HOST = import.meta.env.VITE_API_HOST;

export function RegisterPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    const newUserInfo = {
      user_id: user?.id,
      ...formData,
    };
    try {
      const token = await getToken();
      const response = await axios.post(`${API_HOST}/register`, newUserInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Form submitted successfully:", response.data);
      navigate("/");
    } catch (error) {
      console.error("There was a problem submitting the form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <>
      <h1>You're almost ready!</h1>
      <h3>
        A valid address is required for Zusch! to work properly. <br />
        Please provide your address below to start using Zusch!
      </h3>
      <form className="address-form" onSubmit={handleSubmit}>
        <label htmlFor="street">Street</label>
        <input
          type="text"
          name="street"
          id="street"
          value={formData.street}
          onChange={handleChange}
        />
        <label htmlFor="house_number">House Number</label>
        <input
          type="text"
          name="house_number"
          id="house_number"
          value={formData.house_number}
          onChange={handleChange}
        />
        <label htmlFor="postal_code">Postal Code</label>
        <input
          type="text"
          name="postal_code"
          id="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
        />
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          id="city"
          value={formData.city}
          onChange={handleChange}
        />
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
        <button
          className="signup-button"
          type="submit"
          disabled={
            !formData.street ||
            !formData.house_number ||
            !formData.postal_code ||
            !formData.city ||
            !formData.country
          }
        >
          Sign up!
        </button>
      </form>
    </>
  );
}
