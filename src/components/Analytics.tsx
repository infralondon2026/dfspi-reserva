import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "../analytics";
import { useLocale } from "../context/AppContext";

export default function Analytics() {
  const location = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    track("page_view", { locale });
  }, [locale, location.pathname, location.search]);

  return null;
}
