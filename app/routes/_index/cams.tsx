import { useEffect, useState } from "react";
import Hls from "hls.js";
import camsData from "./cams_data";
import { LS_API_KEY } from "./route";
import OpenRouteServiceClient from "./open_route_service_client";
import { getDistance } from "geolib";

const coordinateIsWithinBoundingBox = (
  coordinate: string[],
  boundingBox: string[]
) => {
  const [lat, lng] = coordinate;
  const [minLng, minLat, maxLng, maxLat] = boundingBox;
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

export default function Cams({
  fromLocation,
  toLocation,
}: {
  fromLocation: string;
  toLocation: string;
}) {
  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    setApiKey(window.localStorage.getItem(LS_API_KEY) ?? "");
  }, []);

  const [camsAlongRoute, setCamsAlongRoute] = useState([]);
  useEffect(() => {
    const openRouteServiceClient = new OpenRouteServiceClient(apiKey);
    async function findCams() {
      const fromCoords = await openRouteServiceClient.getCoordinates(
        fromLocation
      );
      const toCoords = await openRouteServiceClient.getCoordinates(toLocation);

      const routeCoords = await openRouteServiceClient.getDirections(
        fromCoords,
        toCoords
      );

      const { coordinates, bbox } = routeCoords;
      const coordIsWithinHalfMileOfOtherCoord = (coord1, coord2) => {
        const distance = getDistance(coord1, coord2);
        return distance < 804.672 / 8; // ont half mile`
      };
      const camsWithinBounds = camsData
        .filter(({ lat_lng }) =>
          coordinateIsWithinBoundingBox(
            [lat_lng.split(",")[0], lat_lng.split(",")[1]],
            bbox
          )
        )
        .filter(({ lat_lng }) => {
          const coord = {
            latitude: lat_lng.split(",")[0],
            longitude: lat_lng.split(",")[1],
          };
          return coordinates.some((routeCoord) =>
            coordIsWithinHalfMileOfOtherCoord(coord, routeCoord)
          );
        })
        .sort((a, b) => {
          const coordA = coordinates.find((coord) => {
            const camCoord = {
              latitude: a.lat_lng.split(",")[0],
              longitude: a.lat_lng.split(",")[1],
            };
            return coordIsWithinHalfMileOfOtherCoord(camCoord, coord);
          });
          const coordB = coordinates.find((coord) => {
            const camCoord = {
              latitude: b.lat_lng.split(",")[0],
              longitude: b.lat_lng.split(",")[1],
            };
            return coordIsWithinHalfMileOfOtherCoord(camCoord, coord);
          });
          return coordinates.indexOf(coordA) - coordinates.indexOf(coordB);
        })
        .map(({ name, highway, video_url, lat_lng }) => ({
          highway,
          name,
          video_url,
          lat_lng,
        }));

      setCamsAlongRoute(camsWithinBounds);
    }
    findCams();
  }, [apiKey, fromLocation, toLocation]);

  return (
    <div id="videos" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {camsAlongRoute.map((cam: any, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label style={{ fontSize: "18px", fontWeight: "700" }}>
            {cam.highway} {cam.name} (
            <a
              href={`https://www.google.com/maps/search/${cam.lat_lng}`}
              target="_blank"
              rel="noreferrer"
            >
              ?
            </a>
            )
          </label>
          <video
            id={`video${index}`}
            controls
            autoPlay
            muted
            style={{ width: 350 }}
            ref={(video) => {
              if (Hls.isSupported() && video) {
                const hls = new Hls();
                hls.loadSource(cam.video_url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                  video.play();
                });
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
