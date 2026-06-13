"use client"

import { useEffect, useMemo, useState } from "react"

import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListItemNode, ListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list"
import { AutoLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $setBlocksType } from "@lexical/selection"
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  TextIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { editorTheme } from "@/components/editor/themes/editor-theme"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type RichTextEditorProps = {
  name: string
  initialValue?: string | null
  placeholder?: string
  className?: string
  onValueChange?: (value: string) => void
}

export function RichTextEditor({
  name,
  initialValue,
  placeholder = "Tulis isi berita di sini...",
  className,
  onValueChange,
}: RichTextEditorProps) {
  const [value, setValue] = useState(
    initialValue ?? JSON.stringify(emptyEditorState)
  )

  useEffect(() => {
    setValue(initialValue ?? JSON.stringify(emptyEditorState))
  }, [initialValue])

  const initialConfig = useMemo(
    () => ({
      namespace: `fmi-rich-text-${name}`,
      theme: editorTheme,
      onError(error: Error) {
        throw error
      },
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
      editorState: initialValue ?? JSON.stringify(emptyEditorState),
    }),
    [initialValue, name]
  )

  return (
    <div className={className}>
      <input type="hidden" name={name} value={value} />
      <LexicalComposer initialConfig={initialConfig}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <EditorToolbar />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  placeholder={placeholder}
                  className="min-h-[20rem] px-5 py-4 text-sm leading-7 text-slate-800"
                  placeholderClassName="px-5 py-4 text-sm text-slate-400"
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin
              onChange={(editorState) => {
                const nextValue = JSON.stringify(editorState.toJSON())
                setValue(nextValue)
                onValueChange?.(nextValue)
              }}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
          </div>
        </div>
      </LexicalComposer>
    </div>
  )
}

function EditorToolbar() {
  const [editor] = useLexicalComposerContext()
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkValue, setLinkValue] = useState("https://")

  function applyBlock(type: "paragraph" | "h1" | "h2" | "quote") {
    editor.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return

      if (type === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode())
        return
      }

      if (type === "quote") {
        $setBlocksType(selection, () => $createQuoteNode())
        return
      }

      $setBlocksType(selection, () => $createHeadingNode(type))
    })
  }

  function submitLink() {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkValue.trim() || null)
    setShowLinkInput(false)
    setLinkValue("https://")
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
      <Button type="button" variant="outline" size="sm" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <Undo2Icon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <Redo2Icon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => applyBlock("paragraph")}>
        <TextIcon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => applyBlock("h1")}>
        <Heading1Icon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => applyBlock("h2")}>
        <Heading2Icon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <BoldIcon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <ItalicIcon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
        <UnderlineIcon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => applyBlock("quote")}>
        <QuoteIcon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
        <ListIcon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
        <ListOrderedIcon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}>
        <RemoveFormattingIcon className="size-4" />
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={() => setShowLinkInput((current) => !current)}>
        <LinkIcon className="size-4" />
      </Button>

      {showLinkInput ? (
        <div className="flex items-center gap-2">
          <Input
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            className="h-8 w-56 bg-white"
            placeholder="https://"
          />
          <Button type="button" size="sm" onClick={submitLink}>
            Simpan link
          </Button>
        </div>
      ) : null}
    </div>
  )
}

const emptyEditorState = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
        textFormat: 0,
        textStyle: "",
      },
    ],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}
