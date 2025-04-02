import "./Header.css";

export function Header() {
  return (
    <>
      <div className="header">
        <div>
          <h1>Zusch!</h1>
        </div>
        <div className="links">
          <h2>Register</h2>
          <h2>Login</h2>
        </div>
      </div>
      <h3>
        There are X boxes near you, full of items looking for a new home!
        {/* Replace X with number of boxes visible on map or within defaul search parameters */}
        <br />
        Click on a box to see what's in it! <br /> If you take something from a
        box, or notice something is already gone, please check it off the list!
      </h3>
    </>
  );
}
