import "./RegisterPage.css";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const API_HOST = import.meta.env.VITE_API_HOST;

export function RegisterPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: "",
    house_number: "",
    postal_code: "",
    city: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUserInfo = {
      clerk_id: user?.id,
      user_name: user?.username,
      email: user?.emailAddresses[0].emailAddress,
      ...formData,
    };
    try {
      const response = await axios.post(`${API_HOST}/register`, newUserInfo);
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
      <div className="address-form">
        <h3>Please provide your address below to start using Zusch!</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="street">Street</label>
            <input
              type="text"
              name="street"
              id="street"
              value={formData.street}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="house_number">House Number</label>
            <input
              type="text"
              name="house_number"
              id="house_number"
              value={formData.house_number}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="postal_code">Postal Code</label>
            <input
              type="text"
              name="postal_code"
              id="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="city">City</label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <input
              type="text"
              name="country"
              id="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
