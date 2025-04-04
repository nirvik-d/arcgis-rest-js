import "./App.css";
import Authentication from "../lib/Authentication";
import GetData from "../lib/DataEnrichment";
import GetElevation from "../lib/Elevation";
import GetDataServices from "../lib/DataServices";
import Geocoding from "../lib/Geocoding";
import Places from "../lib/Places";
import Routing from "../lib/Routing";

function App() {
  return (
    <div>
      <Authentication />
      <Geocoding type="geocode" />
      <Geocoding type="reverse-geocode" />
      <Routing type="route" />
      <Routing type="service-area" />
      <Places type="point" />
      <Places type="extent" />
      <GetData type="local" />
      <GetData type="global" />
      <GetElevation type="point" />
      {/* <GetElevation type="multiple-points" /> */}
      <GetDataServices type="get-meta-data" />
      <GetDataServices type="query-feature-layer-sql" />
      <GetDataServices type="query-feature-layer-spatial" />
    </div>
  );
}

export default App;
