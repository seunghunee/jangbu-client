import type { ReactNode } from "react";
import { Box, Container } from "@mui/material";

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
        background: theme.palette.background.default,
      })}
    >
      <Container maxWidth="md" disableGutters>
        {children}
      </Container>
    </Box>
  );
}
