import { Fragment, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { themeChange } from "theme-change";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const DarkModeToggle = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    themeChange(false);
  }, []);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setEnabled(true);
    }
  }, []);

  return (
    <div className="flex space-x-2 items-center">
      <div>{enabled ? <MdDarkMode /> : <MdLightMode />}</div>
      <Switch checked={enabled} onChange={setEnabled} as={Fragment}>
        {({ checked }) => (
          <button
            className={`${
              checked ? "bg-gray-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
            data-set-theme={enabled ? "light" : "dark"}
            data-act-class="ACTIVECLASS"
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              className={`${
                checked ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </button>
        )}
      </Switch>
    </div>
  );
};

export default DarkModeToggle;
