import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type IdentityDraft = {
  storeId: string;
  producerId: string;
};

type LoginCardProps = {
  identityDraft: IdentityDraft;
  onStoreIdChange: (value: string) => void;
  onProducerIdChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function LoginCard({
  identityDraft,
  onStoreIdChange,
  onProducerIdChange,
  onSubmit,
}: LoginCardProps) {
  return (
    <Card
      sx={{
        maxWidth: 460,
        mx: "auto",
        mt: { xs: 3, sm: 6 },
        borderRadius: 4,
        boxShadow: 6,
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={2.5}>
          <Box
            sx={{
              width: 76,
              height: 76,
              mx: "auto",
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(140deg, rgba(22,163,74,0.18), rgba(16,185,129,0.25))",
              color: "primary.main",
            }}
          >
            <MenuBookRoundedIcon fontSize="large" />
          </Box>

          <Box textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Jangbu Producer Portal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Sign in once to use your sales dashboard.
            </Typography>
          </Box>

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={1.5}>
              <TextField
                required
                label="Store code"
                placeholder="Enter your store code"
                value={identityDraft.storeId}
                onChange={(event) => onStoreIdChange(event.target.value)}
              />
              <TextField
                required
                label="Account ID"
                placeholder="Enter your account ID"
                value={identityDraft.producerId}
                onChange={(event) => onProducerIdChange(event.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Log in
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
