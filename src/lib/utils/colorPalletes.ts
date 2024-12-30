/**
 * Color palettes by Arne Niklas Jansson
 * Source: http://androidarts.com/palette/16pal.htm
 */

// Base type for color palettes
export type ColorPalette = readonly string[];

// Type to get colors from a palette
export type ColorFromPalette<T extends ColorPalette> = T[number];

// Palette metadata type
type PaletteInfo = {
  name: string;
  colors: ColorPalette;
};

// Basic preset colors
export const PRESET_PALETTE = [
  "transparent",
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
] satisfies ColorPalette;

// Generated from GPL palette
export const A64_PALETTE = [
  "#000000",
  "#313A91",
  "#4C3435",
  "#B14863",
  "#485454",
  "#7655A2",
  "#92562B",
  "#8385CF",
  "#808078",
  "#509450",
  "#CD9373",
  "#8FBFD5",
  "#9CABB1",
  "#BBC840",
  "#9CCC47",
  "#EDE6C8",
] satisfies ColorPalette;

// Generated from GPL palette
export const ARNE16_PALETTE = [
  "#000000",
  "#9D9D9D",
  "#FFFFFF",
  "#BE2633",
  "#E06F8B",
  "#493C2B",
  "#A46422",
  "#EB8931",
  "#F7E26B",
  "#2F484E",
  "#44891A",
  "#A3CE27",
  "#1B2632",
  "#005784",
  "#31A2F2",
  "#B2DCEF",
] satisfies ColorPalette;

// Generated from GPL palette
export const ARNE32_PALETTE = [
  "#000000",
  "#9D9D9D",
  "#FFFFFF",
  "#BE2633",
  "#E06F8B",
  "#493C2B",
  "#A46422",
  "#EB8931",
  "#F7E26B",
  "#2F484E",
  "#44891A",
  "#A3CE27",
  "#1B2632",
  "#005784",
  "#31A2F2",
  "#B2DCEF",
  "#342A97",
  "#656D71",
  "#CCCCCC",
  "#732930",
  "#CB43A7",
  "#524F40",
  "#AD9D33",
  "#EC4700",
  "#FAB40B",
  "#115E33",
  "#14807E",
  "#15C2A5",
  "#225AF6",
  "#9964F9",
  "#F78ED6",
  "#F4B990",
] satisfies ColorPalette;

// Generated from GPL palette
export const CG_ARNE_PALETTE = [
  "#000000",
  "#2234D1",
  "#0C7E45",
  "#44AACC",
  "#8A3622",
  "#5C2E78",
  "#AA5C3D",
  "#B5B5B5",
  "#5E606E",
  "#4C81FB",
  "#6CD947",
  "#7BE2F9",
  "#EB8A60",
  "#E23D69",
  "#FFD93F",
  "#FFFFFF",
] satisfies ColorPalette;

// Generated from GPL palette
export const COPPER_TECH_PALETTE = [
  "#262144",
  "#1651DD",
  "#898989",
  "#355278",
  "#60748A",
  "#91D9F3",
  "#5AA8B2",
  "#6EA92C",
  "#BFB588",
  "#F4CD72",
  "#C58843",
  "#9E5B47",
  "#DC392D",
  "#5F4351",
  "#FFFFFF",
  "#000000",
] satisfies ColorPalette;

// Generated from GPL palette
export const CPC_BOY_PALETTE = [
  "#000000",
  "#1B1B76",
  "#3636D8",
  "#761F28",
  "#623870",
  "#953EA7",
  "#CC3636",
  "#CE4B7A",
  "#E3669A",
  "#1B761B",
  "#197F96",
  "#1986F2",
  "#8C6E1A",
  "#8E8E8E",
  "#9C9EE7",
  "#E48E2A",
  "#EAA597",
  "#FE80FE",
  "#54BF47",
  "#37C79F",
  "#35CFE4",
  "#8DD836",
  "#B8D1B5",
  "#97E9D1",
  "#EDD446",
  "#EBE4A4",
  "#FFFFFF",
  "#F2EFE7",
  "#BAC375",
  "#859550",
  "#485D48",
  "#293941",
] satisfies ColorPalette;

// Generated from GPL palette
export const EROGE_COPPER_PALETTE = [
  "#7D3840",
  "#0D080D",
  "#2A2349",
  "#4180A0",
  "#32535F",
  "#74ADBB",
  "#7BB24E",
  "#FFF9E4",
  "#BEBBB2",
  "#FBDF9B",
  "#F0BD77",
  "#C59154",
  "#825B31",
  "#E89973",
  "#C16C5B",
  "#4F2B24",
] satisfies ColorPalette;

// Generated from GPL palette
export const JMP_PALETTE = [
  "#000000",
  "#191028",
  "#46AF45",
  "#A1D685",
  "#453E78",
  "#7664FE",
  "#833129",
  "#9EC2E8",
  "#DC534B",
  "#E18D79",
  "#D6B97B",
  "#E9D8A1",
  "#216C4B",
  "#D365C8",
  "#AFAAB9",
  "#F5F4EB",
] satisfies ColorPalette;

// Generated from GPL palette
export const PSYGNOSIA_PALETTE = [
  "#A2324E",
  "#443F41",
  "#1B1E29",
  "#362747",
  "#64647C",
  "#516CBF",
  "#CBE8F7",
  "#9EA4A7",
  "#003308",
  "#084A3C",
  "#546A00",
  "#52524C",
  "#736150",
  "#77785B",
  "#E08B79",
  "#000000",
] satisfies ColorPalette;

// Type aliases for specific palettes
export type Arne16PaletteColor = ColorFromPalette<typeof ARNE16_PALETTE>;
export type Arne32PaletteColor = ColorFromPalette<typeof ARNE32_PALETTE>;
export type A64PaletteColor = ColorFromPalette<typeof A64_PALETTE>;
export type CGArnePaletteColor = ColorFromPalette<typeof CG_ARNE_PALETTE>;
export type JMPPaletteColor = ColorFromPalette<typeof JMP_PALETTE>;
export type PsygnosiaPaletteColor = ColorFromPalette<typeof PSYGNOSIA_PALETTE>;

// Palette metadata with human-readable names
export const PALETTE_INFO: Record<string, PaletteInfo> = {
  PRESET_PALETTE: {
    name: "Basic Colors",
    colors: PRESET_PALETTE,
  },
  ARNE16_PALETTE: {
    name: "Arne 16",
    colors: ARNE16_PALETTE,
  },
  ARNE32_PALETTE: {
    name: "Arne 32",
    colors: ARNE32_PALETTE,
  },
  A64_PALETTE: {
    name: "A64",
    colors: A64_PALETTE,
  },
  CG_ARNE_PALETTE: {
    name: "CG Arne",
    colors: CG_ARNE_PALETTE,
  },
  COPPER_TECH_PALETTE: {
    name: "Copper Tech",
    colors: COPPER_TECH_PALETTE,
  },
  CPC_BOY_PALETTE: {
    name: "CPC Boy",
    colors: CPC_BOY_PALETTE,
  },
  EROGE_COPPER_PALETTE: {
    name: "Eroge Copper",
    colors: EROGE_COPPER_PALETTE,
  },
  JMP_PALETTE: {
    name: "JMP",
    colors: JMP_PALETTE,
  },
  PSYGNOSIA_PALETTE: {
    name: "Psygnosia",
    colors: PSYGNOSIA_PALETTE,
  },
};

// For backwards compatibility
export const COLOR_PALETTES = Object.fromEntries(
  Object.entries(PALETTE_INFO).map(([key, value]) => [key, value.colors]),
);
