export const theme = {
  colors: {
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    accent: "var(--color-accent)",
    surface: "var(--color-surface)",
    border: "var(--color-border)",
    text: "var(--color-text)",
    muted: "var(--color-muted)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
  },
  spacing: {
    grid: "8px",
  },
  borderRadius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
} as const