import "./App.css";
import Authentication from "../lib/Authentication";
import PerformGeocoding from "../lib/Geocoding";
import PerformRouting from "../lib/Routing";
import FindPlaces from "../lib/Places";
import GetLayerMetaData from "../lib/DataServices";
import GetData from "../lib/DataEnrichment";
import GetElevation from "../lib/Elevation";
import GetDataServices from "../lib/DataServices";

function App() {
  return (
    <div>
      {/* <GetLayerMetaData /> */}
      {/* <Authentication /> */}
      {/* <Geocoding type="geocode" /> */}
      {/* <Geocoding type="reverse-geocode" /> */}
      {/* <Routing type="route" /> */}
      {/* <Routing type="service-area" /> */}
      {/* <Places type="point" /> */}
      {/* <Places type="extent" /> */}
      {/* <GetData type="local" /> */}
      {/* <GetData type="global" /> */}
      {/* <GetElevation type="point" /> */}
      {/* <GetElevation type="multiple-points" /> */}
      <GetDataServices type="get-meta-data" />
      <GetDataServices type="query-feature-layer-sql" />
      <GetDataServices type="query-feature-layer-spatial" />
    </div>
  );
}

export default App;
