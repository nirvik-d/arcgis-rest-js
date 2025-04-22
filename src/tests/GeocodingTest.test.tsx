import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PerformGeocoding from "../../lib/Geocoding";

vi.mock("@esri/arcgis-rest-request", () => ({
  ApiKeyManager: { fromKey: vi.fn(() => "mock-key") },
  spy: true,
}));

vi.mock("@esri/arcgis-rest-geocode", () => ({
  geocode: vi.fn().mockResolvedValueOnce({ data: "mocked-data" }),
  spy: "true",
}));

describe("Geocoding component", () => {
  it("should render Geocoding with ArcGIS REST JS and get the latitude and longitude of an address.", async () => {
    render(<PerformGeocoding type="geocode" />);
    await waitFor(() =>
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument()
    );
  });

  it("should render Geocoding with ArcGIS REST JS and show the places, given the latitude and longitude, within a certain distance.", async () => {
    render(<PerformGeocoding type="reverse-geocode" />);
    await waitFor(() =>
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument()
    );
  });

  it("should render API Key is missing.", async () => {
    import.meta.env.VITE_ARCGIS_API_KEY = "";
    render(<PerformGeocoding type="geocode" />);
    await waitFor(() => {
      expect(screen.getByText(/API Key is missing/i)).toBeInTheDocument();
    });
  });
});
