import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode
  title?: string
}

export const AuthLayout = ({ children, title }: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flex: "1 1 auto",
        flexDirection: {
          xs: "column-reverse",
          md: "row",
        },
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "neutral.800",
          backgroundImage: 'url("/assets/gradient-bg.svg")',
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          color: "common.white",
          display: "flex",
          flex: {
            xs: "0 0 auto",
            md: "1 1 auto",
          },
          justifyContent: "center",
          p: {
            xs: 4,
            md: 8,
          },
        }}
      >
        <Box maxWidth="md">
          <Typography sx={{ mb: 1 }} variant="h4">
            {"Welcome to Devias Kit PRO"}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {"A professional kit that comes with ready-to-use MUI components"}
            {"developed with one common goal in mind, help you build faster &"}
            {"beautiful applications."}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {"Join 6,000+ forward-thinking companies:"}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          flex: {
            xs: "1 1 auto",
            md: "0 0 auto",
          },
          flexDirection: "column",
          justifyContent: {
            md: "center",
          },
          maxWidth: "100%",
          p: {
            xs: 4,
            md: 8,
          },
          width: {
            md: 600,
          },
        }}
      >
        <div>
          <Box sx={{ mb: 4 }}>
            <Stack
              alignItems="center"
              direction="row"
              display="inline-flex"
              spacing={1}
              sx={{ textDecoration: "none" }}
            >
              <Typography variant="h4">{title}</Typography>
            </Stack>
          </Box>
          {children}
        </div>
      </Box>
    </Box>
  );
};
