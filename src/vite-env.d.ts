/// <reference types="vite/client" />

import type { ItemIconConfig } from "./components/itemIcons";

type JangbuRuntimeConfig = {
  itemIconConfig?: ItemIconConfig;
};

declare global {
  interface Window {
    __JANGBU_RUNTIME_CONFIG__?: JangbuRuntimeConfig;
  }
}

export {};
