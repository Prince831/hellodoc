
type ColorScheme = {
  name: string;
  id: string;
  primary: string;
  secondary: string;
  accent: string;
};

export const colorSchemes: ColorScheme[] = [
  {
    name: "Blue",
    id: "blue",
    primary: "#8B9FE8",
    secondary: "rgba(20, 20, 25, 0.9)",
    accent: "rgba(25, 25, 30, 0.85)",
  },
  {
    name: "Green",
    id: "green",
    primary: "#6FCF97",
    secondary: "rgba(20, 25, 20, 0.9)",
    accent: "rgba(25, 30, 25, 0.85)",
  },
  {
    name: "Purple",
    id: "purple",
    primary: "#BB6BD9",
    secondary: "rgba(25, 20, 25, 0.9)",
    accent: "rgba(30, 25, 30, 0.85)",
  },
  {
    name: "Orange",
    id: "orange",
    primary: "#F2994A",
    secondary: "rgba(25, 22, 20, 0.9)",
    accent: "rgba(30, 27, 25, 0.85)",
  },
  {
    name: "Red",
    id: "red",
    primary: "#EB5757",
    secondary: "rgba(25, 20, 20, 0.9)",
    accent: "rgba(30, 25, 25, 0.85)",
  },
  {
    name: "Slate",
    id: "slate",
    primary: "#718096",
    secondary: "rgba(20, 22, 25, 0.9)",
    accent: "rgba(25, 27, 30, 0.85)",
  },
];

export const getColorScheme = (id: string): ColorScheme => {
  return colorSchemes.find((scheme) => scheme.id === id) || colorSchemes[0];
};
