import { useState } from "react";
import { Canvas } from "./canvas/Canvas";

function App() {
  let [pages, setPages] = useState([
    {
      height: 400,
      width: 600,
      clusters: [
        {
          highlighted: false,
          selected: false,
          artFragments: [
            {
              height: 40,
              width: 120,
              xOffset: 100,
              yOffset: 100,
            }
          ]
        },
        {
          highlighted: false,
          selected: false,
          artFragments: [
            {
              height: 40,
              width: 40,
              xOffset: 240,
              yOffset: 20,
            }
          ]
        },
      ],
    },
    {
      height: 200,
      width: 400,
      clusters: [
        {
          highlighted: false,
          selected: false,
          artFragments: [
            {
              height: 40,
              width: 80,
              xOffset: 240,
              yOffset: 20,
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
        selected: false,
      }))
    }));
    setPages(newPages);
  };

  let selectOnly = (pageIndex, clusterIndex) => {
    let newPages = pages.map((page, pi) => ({
      ...page,
      clusters: page.clusters.map((cluster, ci) => ({
        ...cluster,
        selected: (pi === pageIndex && ci === clusterIndex),
      }))
    }));
    setPages(newPages);
  };

  let select = (pageIndex, clusterIndex) => {
    let newPages = pages.map((page, pi) => ({
      ...page,
      clusters: page.clusters.map((cluster, ci) => ({
        ...cluster,
        selected: (pi === pageIndex && ci === clusterIndex ? true : cluster.selected),
      }))
    }));
    setPages(newPages);
  };

  let unselect = (pageIndex, clusterIndex) => {
    let newPages = pages.map((page, pi) => ({
      ...page,
      clusters: page.clusters.map((cluster, ci) => ({
        ...cluster,
        selected: (pi === pageIndex && ci === clusterIndex ? false : cluster.selected),
      }))
    }));
    setPages(newPages);
  };

  let highlight = (pageIndex, clusterIndex) => {
    let newPages = pages.map((page, pi) => ({
      ...page,
      clusters: page.clusters.map((cluster, ci) => ({
        ...cluster,
        highlighted: (pi === pageIndex && ci === clusterIndex),
      }))
    }));
    setPages(newPages);
  };

  let unhighlightAll = () => {
    let newPages = pages.map(page => ({
      ...page,
      clusters: page.clusters.map(cluster => ({
        ...cluster,
        highlighted: false,
      }))
    }));
    setPages(newPages);
  };

  return (
    <div>
      <Canvas 
        height={600}
        pages={pages}
        unselectAll={unselectAll}
        selectOnly={selectOnly}
        select={select}
        unselect={unselect}
        highlight={highlight}
        unhighlightAll={unhighlightAll} />
    </div>
  );
}

export default App;
