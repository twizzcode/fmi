import { useEffect, useEffectEvent } from "react";

import {
  $getSelection,
  type BaseSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from "lexical";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";

export function useUpdateToolbarHandler(
  callback: (selection: BaseSelection) => void,
) {
  const { activeEditor } = useToolbarContext();
  const handleSelection = useEffectEvent((selection: BaseSelection) => {
    callback(selection);
  });

  useEffect(() => {
    return activeEditor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if (selection) {
          handleSelection(selection);
        }
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [activeEditor]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      const selection = $getSelection();
      if (selection) {
        handleSelection(selection);
      }
    });
  }, [activeEditor]);
}
