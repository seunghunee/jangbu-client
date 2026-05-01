import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";
import AppleIcon from "@mui/icons-material/Apple";
import EggRoundedIcon from "@mui/icons-material/EggRounded";
import GrassRoundedIcon from "@mui/icons-material/GrassRounded";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import NatureRoundedIcon from "@mui/icons-material/NatureRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";

const ICON_CATALOG = {
  AgricultureRounded: AgricultureRoundedIcon,
  Apple: AppleIcon,
  EggRounded: EggRoundedIcon,
  GrassRounded: GrassRoundedIcon,
  LocalFloristRounded: LocalFloristRoundedIcon,
  NatureRounded: NatureRoundedIcon,
  RestaurantRounded: RestaurantRoundedIcon,
  SpaRounded: SpaRoundedIcon,
} as const;

export type ItemIconCatalogName = keyof typeof ICON_CATALOG;
export type ItemIconConfig = {
  defaultIconName?: ItemIconCatalogName;
  iconMap?: Record<string, ItemIconCatalogName>;
};

const DEFAULT_ITEM_ICON_NAME: ItemIconCatalogName = "LocalFloristRounded";
let runtimeItemIconConfig: ItemIconConfig = {};

export function setItemIconConfig(config?: ItemIconConfig | null) {
  runtimeItemIconConfig = config ?? {};
}

function resolveIconName(iconKey?: string): ItemIconCatalogName {
  if (!iconKey) {
    return runtimeItemIconConfig.defaultIconName ?? DEFAULT_ITEM_ICON_NAME;
  }

  const normalizedKey = iconKey.trim();
  return (
    runtimeItemIconConfig.iconMap?.[normalizedKey] ??
    runtimeItemIconConfig.defaultIconName ??
    DEFAULT_ITEM_ICON_NAME
  );
}

export function getItemIcon(iconKey?: string) {
  return ICON_CATALOG[resolveIconName(iconKey)] ?? LocalFloristRoundedIcon;
}
