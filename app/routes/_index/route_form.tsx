import { Form } from "@remix-run/react";
import { useRef } from "react";
import { LS_HOME_ADDRESS, LS_WORK_ADDRESS } from "./route";

export default function RouteForm({
  onSubmit,
}: {
  onSubmit: (fromLocation: string, toLocation: string) => void;
}) {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  return (
    <Form
      id="api-key-form"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const fromLocation = formData.get("from-loc")?.toString() ?? "";
        const toLocation = formData.get("to-loc")?.toString() ?? "";
        onSubmit(fromLocation, toLocation);
      }}
    >
      <fieldset>
        <legend>Route</legend>
        <label>
          From:
          <input ref={fromRef} type="text" name="from-loc" />
        </label>
        <button
          type="button"
          onClick={() => {
            if (fromRef.current)
              fromRef.current.value =
                window.localStorage.getItem(LS_HOME_ADDRESS) ?? "";
          }}
        >
          Use Home
        </button>
        <button
          type="button"
          onClick={() => {
            if (fromRef.current)
              fromRef.current.value =
                window.localStorage.getItem(LS_WORK_ADDRESS) ?? "";
          }}
        >
          Use Work
        </button>
        <br />
        <label>
          To:
          <input ref={toRef} type="text" name="to-loc" />
        </label>
        <button
          type="button"
          onClick={() => {
            if (toRef.current)
              toRef.current.value =
                window.localStorage.getItem(LS_HOME_ADDRESS) ?? "";
          }}
        >
          Use Home
        </button>
        <button
          type="button"
          onClick={() => {
            if (toRef.current)
              toRef.current.value =
                window.localStorage.getItem(LS_WORK_ADDRESS) ?? "";
          }}
        >
          Use Work
        </button>
        <br />
        <button type="submit">Find Cams</button>
      </fieldset>
    </Form>
  );
}
