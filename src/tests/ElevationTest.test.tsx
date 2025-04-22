import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GetElevation from "../../lib/Elevation";

vi.mock("@esri/arcgis-rest-request", () => ({
  ApiKeyManager: { fromKey: vi.fn(() => "mock-key") },
  spy: true,
}));

vi.mock("@esri/arcgis-rest-elevation", () => ({
  findElevationAtPoint: vi.fn().mockResolvedValueOnce({ data: "mocked-data" }),
  spy: "true",
}));

describe("Elevation component", () => {
  it("should render Elevation with ArcGIS REST JS and get the elevation of a point.", async () => {
    render(<GetElevation type="point" />);
    await waitFor(() =>
      expect(screen.getByText(/Search Results:/i)).toBeInTheDocument()
    );
  });

  it("should render API Key is missing", async () => {
    import.meta.env.VITE_ARCGIS_API_KEY = "";
    render(<GetElevation type="point" />);
    await waitFor(() => {
      expect(screen.getByText(/API Key is missing/i)).toBeInTheDocument();
    });
  });
});
