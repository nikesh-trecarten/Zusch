import "./Home.css";

export function Home() {
  return (
    <div className="home">
      <h3>
        Looking for something specific? <br /> Type what you're looking for
        below, to only see boxes containing that item!
      </h3>
      <form action="search">
        <input type="text" name="items" id="items" />
        <button>Search</button>
      </form>
      <h3>
        Want to give something away? <br /> Click the button below to make your
        own box for others to find!
      </h3>
      <button>Create New Box</button>
    </div>
  );
}
