import type { ReactNode } from "react";
import { Box, Container } from "@mui/material";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 2, sm: 3 },
        px: { xs: 1.5, sm: 2.5 },
        background:
          "radial-gradient(circle at top left, rgba(22,163,74,0.14), transparent 32%), radial-gradient(circle at top right, rgba(249,115,22,0.10), transparent 28%), linear-gradient(180deg, #f5f7fb 0%, #edf1f7 100%)",
      }}
    >
      <Container maxWidth="md" disableGutters>
        {children}
      </Container>
    </Box>
  );
}
