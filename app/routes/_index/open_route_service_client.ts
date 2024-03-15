import Openrouteservice from "openrouteservice-js";

export class OpenRouteServiceClient {
  apiKey: string;
  client: any;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCoordinates(location: string) {
    const Geocode = new Openrouteservice.Geocode({ api_key: this.apiKey });
    const data = await Geocode.geocode({ text: location });
    const coords = data?.features?.[0]?.geometry?.coordinates;
    if (!coords) throw new Error("coordinate not found " + location);
    return coords;
  }

  async getDirections(fromCoord: string, toCoord: string) {
    const orsDirections = new Openrouteservice.Directions({
      api_key: this.apiKey,
    });
    const data = await orsDirections.calculate({
      coordinates: [fromCoord, toCoord],
      profile: "driving-car",
      format: "geojson",
    });
    const { coordinates } = data.features[0].geometry;
    const { bbox } = data;
    return { coordinates, bbox };
  }
}

export default OpenRouteServiceClient;
