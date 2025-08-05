"use client";

import { useEffect } from "react";
import {
  detectBrowser,
  isMobileDevice,
  openInDefaultBrowser,
} from "./browserDetector";

export const BrowserRedirect: React.FC = () => {
  useEffect(() => {
    if (isMobileDevice() && detectBrowser().isInAppBrowser) {
      openInDefaultBrowser();
    }
  }, []);

  return null;
};
