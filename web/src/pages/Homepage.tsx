import styles from "./HomePage.module.css";
import { Map } from "../components/Map";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Header } from "../components/Header";
import { MapLegend } from "../components/MapLegend";

export function HomePage() {
  const { user } = useUser();

  return (
    <>
      <Header />
      <SignedOut>
        <h1>Welcome to Zusch!</h1>
        <h3>
          Zusch! (from the German "zu verschenken") <br />
          is an app that makes giving unwanted items away, or finding new
          treasures for your home, easier than ever!
        </h3>
        <img className={styles.gratis} src="gratis.jpg" alt="gratis" />
        <h3>
          Want to give your old or unused items a chance to make someone else
          happy? <br />
          Pack your items in a box and leave it outside, then click on the map
          to let other users know where to find it, and what's inside!
        </h3>
        <h3>
          Looking for used items? <br />
          Find boxes on the map and click on them to see what's inside! <br />
          Once you take an item from a box, or notice that item is already gone,
          please check it off the list.
        </h3>
        <h3>Sign Up or Sign In now to get started!</h3>
        <p>
          Always keep safety in mind when using this app. <br />
          Look up unfamiliar routes and areas beforehand. <br />
          Be aware of your surroundings. <br />
          Consider going as a group instead of alone. <br />
          Aim to go during daylight rather than when it's dark.
        </p>
        <MapLegend />
      </SignedOut>
      <SignedIn>
        <h3 className={styles.welcomeText}>
          Welcome {user?.username}! <br />
          Click on a box to see what's in it, or click on the map where you want
          others to find your box! <br /> If you take something from a box, or
          notice something is already gone, please check it off the list! <br />
        </h3>
        <MapLegend />
        <Map />
        <h3>Tips!</h3>
        <h3>Try searching for items in different languages.</h3>
        <h3>Don't see any boxes? Try zooming out!</h3>
      </SignedIn>
    </>
  );
}
