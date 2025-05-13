import { useAppContext } from '../context/AppContext';

export default function Counter() {
  const { count, increment, decrement } = useAppContext();

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
}