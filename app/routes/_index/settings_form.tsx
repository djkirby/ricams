import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { LS_API_KEY, LS_HOME_ADDRESS, LS_WORK_ADDRESS } from "./route";

export default function SettingsForm() {
  const [apiKey, setApiKey] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [workAddress, setWorkAddress] = useState("");

  useEffect(() => {
    setApiKey(window.localStorage.getItem(LS_API_KEY) ?? "");
    setHomeAddress(window.localStorage.getItem(LS_HOME_ADDRESS) ?? "");
    setWorkAddress(window.localStorage.getItem(LS_WORK_ADDRESS) ?? "");
  }, []);

  return (
    <Form
      id="api-key-form"
      onSubmit={(e) => {
        e.preventDefault();
        window.localStorage.setItem(LS_API_KEY, apiKey);
        window.localStorage.setItem(LS_HOME_ADDRESS, homeAddress);
        window.localStorage.setItem(LS_WORK_ADDRESS, workAddress);
        alert("Saved Settings");
      }}
    >
      <fieldset>
        <legend>Settings</legend>
        <label>
          OpenRouteService API Key (
          <a
            href="https://openrouteservice.org/dev/#/home"
            target="_new"
            rel="noopener"
          >
            ?
          </a>
          ):
          <input
            type="text"
            name="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>
        <br />
        <label>
          Home Address:
          <input
            type="text"
            name="home-address"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
          />
        </label>
        <br />
        <label>
          Work Address:
          <input
            type="text"
            name="work-address"
            value={workAddress}
            onChange={(e) => setWorkAddress(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Save</button>
      </fieldset>
    </Form>
  );
}
