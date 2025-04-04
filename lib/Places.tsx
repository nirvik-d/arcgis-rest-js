import { ApiKeyManager } from "@esri/arcgis-rest-request";
import {
  IFindPlacesNearPointResponse,
  findPlacesNearPoint,
  IFindPlacesWithinExtentResponse,
  findPlacesWithinExtent,
} from "@esri/arcgis-rest-places";
import { useEffect, useState } from "react";

interface PlacesProps {
  type: "point" | "extent";
}

const accessToken = import.meta.env.VITE_ARCGIS_API_KEY ?? "";

function FindPlaces({ type }: PlacesProps) {
  const [data, setData] = useState<
    IFindPlacesNearPointResponse | IFindPlacesWithinExtentResponse | null
  >(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError(new Error("API key is missing."));
      return;
    }
    const authentication = ApiKeyManager.fromKey(accessToken);
    let requestPromise: Promise<any>;

    switch (type) {
      case "point":
        requestPromise = findPlacesNearPoint({
          x: -118.46651, // Venice Beach, CA
          y: 33.98621,
          categoryIds: ["4d4b7105d754a06377d81259"], // Arts and Outdoors category
          radius: 750,
          authentication,
        });
        break;

      case "extent":
        requestPromise = findPlacesWithinExtent({
          xmin: -115.2, // Coordinates around the Las Vegas Strip
          ymin: 36.09,
          xmax: -115.1,
          ymax: 36.161,
          searchText: "Night Clubs", // Search for "Night Clubs"
          authentication,
        });
        break;

      default:
        setError(new Error("An unknown error has occurred."));
        return;
    }

    requestPromise
      .then((response) => setData(response))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      });
  }, [type]);

  return (
    <>
      <h1>Places with ArcGIS REST JS</h1>
      <div className="result">
        <h2>Search Results:</h2>
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
      </div>
    </>
  );
}

export default FindPlaces;
