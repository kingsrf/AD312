import { useState } from "react";
import "./Counter.css";

function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  function incrementAfterDelay() {
    setTimeout(() => {
      setCount((prevCount) => prevCount + 1);
    }, 2000);
  }

  function incrementTwice() {
    setCount(count + 1);
    setCount(count + 1);
  }

  function correctIncrementTwice() {
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
  }

  return (
    <div className="counter-container">
      <h1>React Counter</h1>

      <p className="count-display">Count: {count}</p>

      <div className="button-group">
        <button onClick={increment}>Increment</button>
        <button onClick={incrementAfterDelay}>Increment After Delay</button>
        <button onClick={incrementTwice}>Increment Twice</button>
        <button onClick={correctIncrementTwice}>Correct Increment Twice</button>
      </div>
    </div>
  );
}

export default Counter;
