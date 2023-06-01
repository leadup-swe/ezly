import { Block } from '@blocknote/core';
import { useBlockNote } from '@blocknote/react';
import _ from 'lodash';
import moment from 'moment';
import { useRef } from 'react';

type Props = {
  onChange: (blocks: Block[]) => void
  initialBlocks?: Block[]
  debounced?: boolean
  delay?: number
};

export const useEditor = ({ onChange, initialBlocks = [], debounced, delay = 1000 }: Props) => {
  const blocksRef = useRef(initialBlocks);
  const mountTime = useRef(Date.now()).current;

  const editor = useBlockNote({
    onEditorContentChange: (editor) => {
      blocksRef.current = editor.topLevelBlocks;
      if (moment().isAfter(moment(mountTime).add(3, `second`))) {
        if (debounced) {
          debouncedOnChange?.(blocksRef.current);
        } else {
          onChange(blocksRef.current);
        }
      }
    },
    initialContent: initialBlocks,
  });

  const debouncedOnChange = useRef(_.debounce((b) => onChange(b), delay, { leading: false })).current;

  return { editor, blocks: blocksRef.current };
};
