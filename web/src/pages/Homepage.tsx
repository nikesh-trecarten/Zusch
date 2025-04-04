import "./HomePage.css";
import { Map } from "../components/Map";
import { useUser } from "@clerk/clerk-react";

export function HomePage() {
  const { user } = useUser();
  return (
    <>
      <h3>
        {user && "Welcome " + `${user.username!}` + "!"} <br />
        There are X boxes near you, full of items looking for a new home!
        {/* Replace X with number of boxes visible on map or within defaul search parameters */}
        <br />
        Click on a box to see what's in it! <br /> If you take something from a
        box, or notice something is already gone, please check it off the list!{" "}
        <br />
        {!user && "Sign in or sign up to get started!"}
      </h3>
      <Map />
      <div className="start">
        <h3>
          Looking for something specific? <br /> Type what you're looking for
          below, to only see boxes containing that item!
        </h3>
        <form action="search">
          <input type="text" name="items" id="items" />
          <button>Search</button>
        </form>
        <h3>
          Want to give something away? <br /> Click the button below to make
          your own box for others to find!
        </h3>
        <button>Create New Box</button>
      </div>
    </>
  );
}
