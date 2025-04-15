import "./UserSettingsPage.css";
import { Header } from "../components/Header";
import countries from "world-countries";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Editable, IconButton } from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";

const API_HOST = import.meta.env.VITE_API_HOST;

const countryList = countries.map((country) => ({
  name: country.name.common,
}));

export function UserSettingsPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const clerk_id = user ? user.id : null;
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
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
        const response = await axios.get(`${API_HOST}/users/${clerk_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        setUserName(user.user_name);
        setEmail(user.email);
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

  const handleUpdateUserName = async () => {
    if (!clerk_id) {
      alert("User ID not found. Please try again.");
      return;
    }
    try {
      const token = await getToken();
      if (userName !== user?.username) {
        await user?.update({ username: userName });
      }
      await axios.patch(
        `${API_HOST}/users/${clerk_id}`,
        {
          user_name: userName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("There was a problem updating the username:", error);
      alert("There was an error updating the username. Please try again.");
    }
  };

  const handleUpdateEmail = async () => {
    if (!user) {
      alert("User not loaded. Please try again.");
      return;
    }
    if (!clerk_id) {
      alert("User ID not found. Please try again.");
      return;
    }
    try {
      const token = await getToken();

      if (email === user.primaryEmailAddress?.emailAddress) {
        alert("This is already your email address.");
        return;
      }

      await user.update({ primaryEmailAddressId: email });
      alert("Please check your email to verify your new email address.");
      await axios.patch(
        `${API_HOST}/users/${clerk_id}`,
        {
          email: email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("There was a problem updating the email:", error);
      alert("There was an error updating the email. Please try again.");
    }
  };

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

  const handleDeleteAccount = async () => {
    if (!clerk_id) {
      alert("User ID not found. Please try again.");
      return;
    }
    try {
      const token = await getToken();
      await axios.delete(`${API_HOST}/users/${clerk_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!user) {
        alert("User not found.");
        return;
      }
      await user.delete();
      alert("Account deleted successfully.");
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
      <label htmlFor="userName">Username</label>
      <Editable.Root
        value={userName}
        onValueChange={(e) => setUserName(e.value)}
        onSubmit={handleUpdateUserName}
        placeholder="Enter new username"
      >
        <Editable.Preview />
        <Editable.Input />
        <Editable.Control>
          <Editable.EditTrigger asChild>
            <IconButton variant="ghost" size="xs">
              <LuPencilLine />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
      <label htmlFor="email">Email Address</label>
      <Editable.Root
        value={email}
        onValueChange={(e) => setEmail(e.value)}
        onSubmit={handleUpdateEmail}
        placeholder="Enter new email address"
      >
        <Editable.Preview />
        <Editable.Input />
        <Editable.Control>
          <Editable.EditTrigger asChild>
            <IconButton variant="ghost" size="xs">
              <LuPencilLine />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
      <label htmlFor="street">Street</label>
      <Editable.Root
        value={street}
        onValueChange={(e) => setStreet(e.value)}
        onSubmit={handleUpdateStreet}
        placeholder="Enter new street"
      >
        <Editable.Preview />
        <Editable.Input />
        <Editable.Control>
          <Editable.EditTrigger asChild>
            <IconButton variant="ghost" size="xs">
              <LuPencilLine />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
      <label htmlFor="houseNumber">House Number</label>
      <Editable.Root
        value={houseNumber}
        onValueChange={(e) => setHouseNumber(e.value)}
        onSubmit={handleUpdateHouseNumber}
        placeholder="Enter new house number"
      >
        <Editable.Preview />
        <Editable.Input />
        <Editable.Control>
          <Editable.EditTrigger asChild>
            <IconButton variant="ghost" size="xs">
              <LuPencilLine />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
      <label htmlFor="postalCode">Postal Code</label>
      <Editable.Root
        value={postalCode}
        onValueChange={(e) => setPostalCode(e.value)}
        onSubmit={handleUpdatePostalCode}
        placeholder="Enter new postal code"
      >
        <Editable.Preview />
        <Editable.Input />
        <Editable.Control>
          <Editable.EditTrigger asChild>
            <IconButton variant="ghost" size="xs">
              <LuPencilLine />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
      <label htmlFor="city">City</label>
      <Editable.Root
        value={city}
        onValueChange={(e) => setCity(e.value)}
        onSubmit={handleUpdateCity}
        placeholder="Enter new city"
      >
        <Editable.Preview />
        <Editable.Input />
        <Editable.Control>
          <Editable.EditTrigger asChild>
            <IconButton variant="ghost" size="xs">
              <LuPencilLine />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="outline" size="xs">
              <LuCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
      <label htmlFor="country">Country</label>
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

      <button onClick={handleDeleteAccount}>Delete Account</button>
    </>
  );
}
