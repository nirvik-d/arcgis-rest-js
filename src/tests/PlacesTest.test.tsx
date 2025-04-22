import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FindPlaces from "../../lib/Places";

vi.mock("@esri/arcgis-rest-request", () => ({
  request: vi.fn(),
  ApiKeyManager: { fromKey: vi.fn(() => "mock-key") },
  spy: true,
}));

vi.mock("@esri/arcgis-rest-feature-service", () => ({
  findPlacesNearPoint: vi.fn().mockResolvedValueOnce({ data: "mock-data" }),
  findPlacesWithinExtent: vi.fn().mockResolvedValueOnce({ data: "mock-data" }),
  spy: true,
}));

describe("Places component", () => {
  it("should render Places with ArcGIS REST JS and display the places near a point", async () => {
    render(<FindPlaces type="point" />);
    await waitFor(() => {
      expect(
        screen.getByText(/Places with ArcGIS REST JS/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument();
    });
  });

  it("should render Places with ArcGIS REST JS and places within an extent", async () => {
    render(<FindPlaces type="extent" />);
    await waitFor(() => {
      expect(
        screen.getByText(/Places with ArcGIS REST JS/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument();
    });
  });

  it("should render API Key is missing", async () => {
    import.meta.env.VITE_ARCGIS_API_KEY = "";
    render(<FindPlaces type="point" />);
    await waitFor(() => {
      expect(screen.getByText(/API Key is missing/i)).toBeInTheDocument();
    });
  });
});
