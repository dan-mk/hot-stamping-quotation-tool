import { Canvas } from "./canvas/Canvas";

function App() {
  let pages = [
    {
      mmHeight: 200,
      mmWidth: 300,
      art: '',
    },
    {
      mmHeight: 100,
      mmWidth: 200,
      art: '',
    }
  ];

  return (
    <div>
      <Canvas height={400} pages={pages} />
    </div>
  );
}

export default App;
