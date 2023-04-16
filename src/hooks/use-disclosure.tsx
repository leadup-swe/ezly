import { useCallback, useState } from "react";

interface Props {
  delay?: number
}

export const useDisclosure = (props?: Props) => {
  const delay = props?.delay;
  const [ open, setOpen ] = useState(false);
  const [ mounted, setMounted ] = useState(false);

  const onOpen = useCallback(() => {
    setMounted(true);
    setTimeout(() => setOpen(true), delay || 0);
  }, [ delay ]);

  const onClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => setMounted(false), delay || 0);
  }, [ delay ]);

  return { open, mounted, onOpen, onClose };
};
