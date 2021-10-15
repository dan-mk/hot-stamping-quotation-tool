import { useState } from "react";
import { Canvas } from "./canvas/Canvas";

function App() {
  let [pages, setPages] = useState([
    {
      height: 200,
      width: 300,
      clusters: [
        {
          selected: true,
          artFragments: [
            {
              height: 20,
              width: 60,
              xOffset: 50,
              yOffset: 50,
            }
          ]
        },
        {
          selected: false,
          artFragments: [
            {
              height: 20,
              width: 20,
              xOffset: 120,
              yOffset: 10,
            }
          ]
        },
      ],
    },
    {
      height: 100,
      width: 200,
      clusters: [
        {
          selected: false,
          artFragments: [
            {
              height: 20,
              width: 40,
              xOffset: 120,
              yOffset: 10,
            }
          ]
        },
      ],
    }
  ]);

  let unselectAll = () => {
    let newPages = pages.map(page => ({
      ...page,
      clusters: page.clusters.map(cluster => ({
        ...cluster,
        select: false,
      }))
    }));
    setPages(newPages);
  };

  let selectOnly = (pageIndex, clusterIndex) => {
    let newPages = pages.map((page, pi) => ({
      ...page,
      clusters: page.clusters.map((cluster, ci) => ({
        ...cluster,
        select: (pi === pageIndex && ci === clusterIndex),
      }))
    }));
    setPages(newPages);
  };

  let select = (pageIndex, clusterIndex) => {
    let newPages = pages.map((page, pi) => ({
      ...page,
      clusters: page.clusters.map((cluster, ci) => ({
        ...cluster,
        select: (pi === pageIndex && ci === clusterIndex ? true : cluster.select),
      }))
    }));
    setPages(newPages);
  };

  let unselect = (pageIndex, clusterIndex) => {
    let newPages = pages.map((page, pi) => ({
      ...page,
      clusters: page.clusters.map((cluster, ci) => ({
        ...cluster,
        select: (pi === pageIndex && ci === clusterIndex ? false : cluster.select),
      }))
    }));
    setPages(newPages);
  };

  return (
    <div>
      <Canvas 
        height={400}
        pages={pages}
        unselectAll={unselectAll}
        selectOnly={selectOnly}
        select={select}
        unselect={unselect} />
    </div>
  );
}

export default App;
