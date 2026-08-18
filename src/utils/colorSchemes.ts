/**
 * Accent schemes. All values are raw HSL triplets so they can be dropped into
 * the design-system CSS variables (`hsl(var(--primary))`) without breaking
 * gradients, glows or opacity modifiers.
 */
export type ColorScheme = {
  name: string;
  id: string;
  /** hsl triplet, e.g. "215 100% 65%" */
  primary: string;
  /** secondary accent used for gradient ends */
  glow: string;
  /** complementary accent */
  accent: string;
};

export const colorSchemes: ColorScheme[] = [
  { name: "Sky", id: "blue", primary: "215 100% 65%", glow: "199 95% 74%", accent: "159 66% 54%" },
  { name: "Mint", id: "green", primary: "159 66% 48%", glow: "168 76% 62%", accent: "199 95% 68%" },
  { name: "Violet", id: "purple", primary: "265 85% 68%", glow: "290 80% 74%", accent: "199 95% 70%" },
  { name: "Amber", id: "orange", primary: "28 92% 58%", glow: "42 96% 64%", accent: "159 60% 52%" },
  { name: "Coral", id: "red", primary: "352 84% 62%", glow: "12 90% 68%", accent: "199 90% 66%" },
  { name: "Slate", id: "slate", primary: "215 25% 52%", glow: "210 30% 66%", accent: "159 40% 55%" },
];

export const getColorScheme = (id: string): ColorScheme =>
  colorSchemes.find((scheme) => scheme.id === id) || colorSchemes[0];
