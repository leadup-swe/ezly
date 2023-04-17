import { styled } from "@mui/material/styles";
import { InputBase, InputBaseProps } from "@mui/material";

export const TitleInput = styled(InputBase)<InputBaseProps>(({ theme }) => ({
  "& .MuiInputBase-input": {
    ...theme.typography.h3,
  },
}));
