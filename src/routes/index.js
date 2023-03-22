import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, useLocation } from "react-router-dom";

import Header from "pages/Header";
import Main from "pages/Main";
import Footer from "pages/Footer";
import { Explore } from "pages/Explore";
import Asset from "pages/Asset";
import MoralisNFTDetail from "pages/Asset/MoralisNFTDetail";
import Token from "pages/Token";
import Creators from "pages/Creators";
import Creator from "pages/Creator";
import {
  CreateCollection,
  CreateLaunchpadCollection,
  LaunchCollection,
  ShowImages,
  UploadImages,
} from "../pages";
import PublicCreator from "pages/Creator/PublicCreator";
import CollectionDetail from "pages/CollectionDetail";
import Collection from "pages/Collection";
import Create from "pages/Create";
import Error from "pages/404";
import Dashboard from "pages/Dashboard";
import { PublicRoutes, PublicRoutesOwner } from "./PublicRoute/publicRoute";
import { PrivateRoute, PrivateRouteOwner } from "./PrivateRoute/PrivateRoute";
import Collectionpage from "pages/CollectionPage";
import Team from "pages/Team";
import Launchpad from "pages/Launchpad";
import About from "pages/About AD/About";
import LaunchpadCollectinDetail from "pages/CollectionDetail/launchCollectionDetails";
import LaunchpadNFT from "pages/Asset/LaunchpadNFT";
import NotFound from "pages/PageNotFound";
import Sidebar from "components/Sidebar/sidebar";

const PrivateobjOwner = [
  { path: "/creator/:id", component: Creator },
  { path: "/creator/:id/collection/:data", component: CollectionDetail },
  { path: "/bleu-admin", component: Dashboard },
];

const PublicobjOwner = [
  { path: "/explore/:Data", component: Explore },
  // { path: "/explore", component: Explore },
  { path: "/item/:collectionAddress/:id", component: Asset },
  { path: "/externalitem/:tokenAddress/:tokenId", component: MoralisNFTDetail },
  { path: "/launchpadItem/:collectionAddress/:id", component: LaunchpadNFT },
  { path: "/token", component: Token },

  { path: "/creator-public/:id", component: PublicCreator },
  { path: "/creator/:id/collection/:data", component: CollectionDetail },
  { path: "/collection/:id/:collectionAddress/:type", component: LaunchpadCollectinDetail },
  { path: "/creators", component: Creators },
  // { path: "/collection", component: Collection },
  // { path: "/create", component: Create },
  { path: "/launchCollection", component: LaunchCollection },
  { path: "/upload-images", component: UploadImages },
  { path: "/upload-images/:img", component: ShowImages },
  // { path: "/CreateCollection", component: CreateCollection },
  { path: "/404", component: Error },
  { path: "/Collectionpage", component: Collectionpage },
  // { path: "/collections", component: Collectionpage },
  { path: "/launchpad", component: Launchpad },
  { path: "/launchpadCollection", component: CreateLaunchpadCollection },
  // { path: "/team", component: Team },
  { path: "/about", component: About },
  { path: "/", component: Main },
  // { path: "*", component: NotFound },
  
];

const Privateobj = [
  { path: "/creator/:id", component: Creator },
];

const Publicobj = [
  // { path: "/collection", component: Collection },
  { path: "/explore/:Data", component: Explore },
  // { path: "/explore", component: Explore },
  { path: "/item/:collectionAddress/:id", component: Asset },
  { path: "/externalitem/:tokenAddress/:tokenId", component: MoralisNFTDetail },
  { path: "/launchpadItem/:collectionAddress/:id", component: LaunchpadNFT },
  { path: "/token", component: Token },
  // { path: "/team", component: Team },
  { path: "/creator-public/:id", component: PublicCreator },
  { path: "/creator/:id/collection/:data", component: CollectionDetail },
  { path: "/collection/:id/:collectionAddress/:type", component: LaunchpadCollectinDetail },
  { path: "/creators", component: Creators },
  // { path: "/create", component: Create },
  { path: "/launchCollection", component: LaunchCollection },
  { path: "/upload-images", component: UploadImages },
  { path: "/upload-images/:img", component: ShowImages },
  // { path: "/CreateCollection", component: CreateCollection },
  { path: "/404", component: Error },
  // { path: "/collections", component: Collectionpage },
  { path: "/launchpadCollection", component: CreateLaunchpadCollection },
  { path: "/launchpad", component: Launchpad },
  { path: "/about", component: About },
  { path: "/", component: Main },
  // { path: "*", component: NotFound },
];

const RoutesHandler = () => {
  const [owneruser, setOwnerUser] = useState(localStorage.getItem("owner"));
  const [user, setUser] = useState(localStorage.getItem("isActive"));
  const [mobileUser, setMobileUser] = useState(
    localStorage.getItem("mobileAccount")
  );

  const location = useLocation();

  useEffect(() => {
    setOwnerUser(localStorage.getItem("owner"));
    setUser(localStorage.getItem("isActive"));
    setMobileUser(localStorage.getItem("mobileAccount"));
  }, [location]);

  return (
    <>
      <Header />
      <div class="sidebarCol">
          <Sidebar />
      </div>
      {owneruser === "true" || owneruser === true ? (
        <>
          {PublicobjOwner.map(({ path, component }, index) => (
            <PublicRoutesOwner
              owneruser={
                owneruser === "false" || owneruser === false ? false : true
              }
              key={"PUBLIC" + index}
              exact
              path={path}
              component={component}
            />
          ))}
          {PrivateobjOwner.map(({ path, component }, index) => (
            <PrivateRouteOwner
              owneruser={
                owneruser === "true" ||
                owneruser === true ||
                mobileUser === "user" ||
                mobileUser === user
                  ? true
                  : false
              }
              key={"PRIVATE" + index}
              exact
              path={path}
              component={component}
            />
          ))}
        </>
      ) : (
        <>
          {Publicobj.map(({ path, component }, index) => (
            <PublicRoutes
              user={
                user === "false" ||
                user === false ||
                mobileUser === "false" ||
                mobileUser === false
                  ? false
                  : true
              }
              key={"PUBLIC" + index}
              exact
              path={path}
              component={component}
            />
          ))}
          {Privateobj.map(({ path, component }, index) => (
            <PrivateRoute
              user={
                user === "true" ||
                user === true ||
                mobileUser === "true" ||
                mobileUser === true
                  ? true
                  : false
              }
              key={"PRIVATE--" + index}
              exact
              path={path}
              component={component}
            />
          ))}
        </>
      )}
      <Footer />
    </>
  );
};

function Routes(props) {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <RoutesHandler />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;
