import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { themeChange } from "theme-change";
import { MdDarkMode, MdLightMode } from "react-icons/md";

type ToggleProps = {};
const Toggle = () => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className="flex space-x-2 items-center">
      <div>{enabled ? <MdDarkMode /> : <MdLightMode />}</div>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? "bg-teal-900" : "bg-teal-600"}
          relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        data-toggle-theme="light,dark"
        data-act-class="ACTIVECLASS"
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-5" : "translate-x-0"}
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
};

export default Toggle;
