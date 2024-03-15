import type { MetaFunction } from "@vercel/remix";
import SettingsForm from "./settings_form";
import RouteForm from "./route_form";
import Cams from "./cams";
import { useState } from "react";

export const LS_API_KEY = "openrouteservice-api-key";
export const LS_HOME_ADDRESS = "home-address";
export const LS_WORK_ADDRESS = "work-address";

export const meta: MetaFunction = () => {
  return [
    { title: "RI Cams" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [{ fromLocation, toLocation }, setRoute] = useState({
    fromLocation: "",
    toLocation: "",
  });

  return (
    <>
      <SettingsForm />
      <br />
      <RouteForm
        onSubmit={(fromLocation, toLocation) => {
          setRoute({ fromLocation, toLocation });
        }}
      />
      <br />
      <Cams fromLocation={fromLocation} toLocation={toLocation} />
    </>
  );
}
