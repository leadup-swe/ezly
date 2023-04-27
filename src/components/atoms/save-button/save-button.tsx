import { Button, ButtonProps, Typography } from "@mui/material";
import { useEffect } from "react";
import { getOS } from "src/utils/get-os";

export const SaveButton = (
  props: Omit<ButtonProps, `onClick`> & { onClick: () => void }
) => {
  const os = getOS();
  const saveSuffix =
    os === "macos" ? "⌘+S" : os === "windows" ? "Ctrl+S" : undefined;

  useEffect(() => {
    document.addEventListener("keydown", handleKbShortcut);

    return () => {
      document.removeEventListener("keydown", handleKbShortcut);
    };
  }, []);

  const handleKbShortcut = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.code === "KeyS") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    props.onClick();
  };

  return (
    <Button variant="contained" {...props} onClick={handleClick}>
      {"Save"}
      {saveSuffix && (
        <Typography variant="button" fontSize="14px" ml={1}>
          {saveSuffix}
        </Typography>
      )}
    </Button>
  );
};
