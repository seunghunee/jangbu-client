import type { ReactNode } from "react";
import { Box, Container } from "@mui/material";
import { alpha } from "@mui/material/styles";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        py: { xs: 1.25, sm: 2 },
        px: { xs: 1, sm: 2 },
        background: `radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.14)}, transparent 32%), radial-gradient(circle at top right, ${alpha(theme.palette.secondary.main, 0.12)}, transparent 28%), linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
      })}
    >
      <Container maxWidth="md" disableGutters>
        {children}
      </Container>
    </Box>
  );
}
