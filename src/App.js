import { useState } from "react";
import { Canvas } from "./canvas/Canvas";
import { ConfigurationScreen } from "./configuration_screen/ConfigurationScreen";
import { useSelector, useDispatch } from 'react-redux';
import { addQuote, addArt, addArtFragment, addConfiguration } from './actions';

function App() {
  // let [pages, setPages] = useState([
  //   {
  //     height: 400,
  //     width: 600,
  //     clusters: [
  //       {
  //         highlighted: false,
  //         selected: false,
  //         attachedCliche: null,
  //         artFragments: [
  //           {
  //             height: 40,
  //             width: 120,
  //             xOffset: 100,
  //             yOffset: 100,
  //           }
  //         ]
  //       },
  //       {
  //         highlighted: false,
  //         selected: false,
  //         attachedCliche: null,
  //         artFragments: [
  //           {
  //             height: 40,
  //             width: 40,
  //             xOffset: 240,
  //             yOffset: 20,
  //           }
  //         ]
  //       },
  //       {
  //         highlighted: false,
  //         selected: false,
  //         attachedCliche: null,
  //         artFragments: [
  //           {
  //             height: 40,
  //             width: 70,
  //             xOffset: 300,
  //             yOffset: 200,
  //           }
  //         ]
  //       },
  //     ],
  //     cliches: []
  //   }
  // ]);

  // let [resources, setResources] = useState({
  //   cliches: []
  // });

  // let unselectAll = () => {
  //   let newPages = pages.map(page => ({
  //     ...page,
  //     clusters: page.clusters.map(cluster => ({
  //       ...cluster,
  //       selected: false,
  //     }))
  //   }));
  //   setPages(newPages);
  // };

  // let selectOnly = (pageIndex, clusterIndex) => {
  //   let newPages = pages.map((page, pi) => ({
  //     ...page,
  //     clusters: page.clusters.map((cluster, ci) => ({
  //       ...cluster,
  //       selected: (pi === pageIndex && ci === clusterIndex),
  //     }))
  //   }));
  //   setPages(newPages);
  // };

  // let select = (pageIndex, clusterIndex) => {
  //   let newPages = pages.map((page, pi) => ({
  //     ...page,
  //     clusters: page.clusters.map((cluster, ci) => ({
  //       ...cluster,
  //       selected: (pi === pageIndex && ci === clusterIndex ? true : cluster.selected),
  //     }))
  //   }));
  //   setPages(newPages);
  // };

  // let unselect = (pageIndex, clusterIndex) => {
  //   let newPages = pages.map((page, pi) => ({
  //     ...page,
  //     clusters: page.clusters.map((cluster, ci) => ({
  //       ...cluster,
  //       selected: (pi === pageIndex && ci === clusterIndex ? false : cluster.selected),
  //     }))
  //   }));
  //   setPages(newPages);
  // };

  // let highlight = (pageIndex, clusterIndex) => {
  //   let newPages = pages.map((page, pi) => ({
  //     ...page,
  //     clusters: page.clusters.map((cluster, ci) => ({
  //       ...cluster,
  //       highlighted: (pi === pageIndex && ci === clusterIndex),
  //     }))
  //   }));
  //   setPages(newPages);
  // };

  // let unhighlightAll = () => {
  //   let newPages = pages.map(page => ({
  //     ...page,
  //     clusters: page.clusters.map(cluster => ({
  //       ...cluster,
  //       highlighted: false,
  //     }))
  //   }));
  //   setPages(newPages);
  // };

  // let getAllSelectedClusters = () => {
  //   let selectedClusters = [];
  //   pages.forEach(page => {
  //     selectedClusters = [...selectedClusters, ...page.clusters.filter(c => c.selected)];
  //   });
  //   return selectedClusters;
  // };

  // let createCliche = () => {
  //   let selectedClusters = getAllSelectedClusters();
  //   let clichePosition = {top: 9999, right: 0, bottom: 0, left: 9999};

  //   selectedClusters.forEach(cluster => {
  //     clichePosition.top = Math.min(clichePosition.top, cluster.artFragments[0].yOffset - 10);
  //     clichePosition.right = Math.max(clichePosition.right, cluster.artFragments[0].xOffset + cluster.artFragments[0].width + 10);
  //     clichePosition.bottom = Math.max(clichePosition.bottom, cluster.artFragments[0].yOffset + cluster.artFragments[0].height + 10);
  //     clichePosition.left = Math.min(clichePosition.left, cluster.artFragments[0].xOffset - 10);
  //   });

  //   let newResources = {
  //     ...resources,
  //     cliches: [
  //       ...resources.cliches,
  //       {
  //         id: resources.cliches.length + 1,
  //         height: clichePosition.bottom - clichePosition.top,
  //         width: clichePosition.right - clichePosition.left,
  //       }
  //     ]
  //   };

  //   let newPages = pages.map(page => ({
  //     ...page,
  //     cliches: [
  //       ...page.cliches,
  //       {
  //         id: resources.cliches.length + 1,
  //         xOffset: clichePosition.left,
  //         yOffset: clichePosition.top,
  //       }
  //     ],
  //     clusters: page.clusters.map(cluster => ({
  //       ...cluster,
  //       selected: false,
  //       attachedCliche: (selectedClusters.includes(cluster) ? resources.cliches.length + 1 : cluster.attachedCliche)
  //     }))
  //   }));

  //   setResources(newResources);
  //   setPages(newPages);
  // };

  // let deleteCliche = (id) => {
  //   let newResources = {
  //     ...resources,
  //     cliches: resources.cliches.filter(c => c.id !== id)
  //   };

  //   let newPages = pages.map(page => ({
  //     ...page,
  //     cliches: page.cliches.filter(c => c.id !== id),
  //     clusters: page.clusters.map(cluster => ({
  //       ...cluster,
  //       attachedCliche: (cluster.attachedCliche === id ? null : cluster.attachedCliche)
  //     }))
  //   }));

  //   setResources(newResources);
  //   setPages(newPages);
  // };

  // return (
  //   <div>
  //     <Canvas 
  //       height={600}
  //       pages={pages}
  //       resources={resources}
  //       unselectAll={unselectAll}
  //       selectOnly={selectOnly}
  //       select={select}
  //       unselect={unselect}
  //       highlight={highlight}
  //       unhighlightAll={unhighlightAll}
  //       createCliche={createCliche}
  //       deleteCliche={deleteCliche} />
  //   </div>
  // );

  // const quotes = useSelector(state => state.quotes);
  // const arts = useSelector(state => state.arts);
  // const artFragments = useSelector(state => state.art_fragments);
  const configurations = useSelector(state => state.configurations);

  // const dispatch = useDispatch();

  return (
    <>
      {/* <div>{JSON.stringify(quotes)}</div>
      <button onClick={() => dispatch(addQuote(1, 'First quote', '2021-12-18 14:27'))}>Add</button>
      <div>{JSON.stringify(arts)}</div>
      <button onClick={() => dispatch(addArt(1, 300, 123, 456))}>Add</button>
      <div>{JSON.stringify(artFragments)}</div>
      <button onClick={() => dispatch(addArtFragment(1, 0, 0, 12, 34, [[]]))}>Add</button>
      <div>{JSON.stringify(configurations)}</div>
      <button onClick={() => dispatch(addConfigurations(1, 'Aha', [1]))}>Add</button> */}
      <ConfigurationScreen configuration={configurations.data[1]} />
    </>
  );
}

export default App;
