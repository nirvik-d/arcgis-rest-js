import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect } from "vitest";
import GetUserData from "../../lib/GetUserData";

const userName = "John";

vi.mock("@esri/arcgis-rest-request", () => ({
  request: vi.fn(() =>
    Promise.resolve({ userName: "Null", fullName: "Null Doe" })
  ),
  ApiKeyManager: { fromKey: vi.fn(() => "mock-auth") },
}));

describe("GetUserData component", () => {
  it("renders and shows fetched user data", async () => {
    render(
      <GetUserData
        nameQuery={userName}
        format="json"
        url="https://www.arcgis.com/sharing/rest/community/users"
      />
    );

    await waitFor(() =>
      expect(
        screen.getByText("Authentication with ArcGIS REST JS")
      ).toBeInTheDocument()
    );
  });

  it("handles API key missing error", async () => {
    import.meta.env.VITE_ARCGIS_API_KEY = "";

    render(
      <GetUserData
        nameQuery={userName}
        format="json"
        url="https://www.arcgis.com/sharing/rest/community/users"
      />
    );

    await waitFor(() =>
      expect(screen.getByText(/API key is missing/i)).toBeInTheDocument()
    );
  });
});
