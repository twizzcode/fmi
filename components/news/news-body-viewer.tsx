"use client"

import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { editorTheme } from "@/components/editor/themes/editor-theme"

export function NewsBodyViewer({ value }: { value: string }) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "fmi-news-viewer",
        theme: editorTheme,
        editable: false,
        onError(error: Error) {
          throw error
        },
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
        editorState: value,
      }}
    >
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            placeholder=""
            className="min-h-0 px-0 py-0 text-base leading-8 text-slate-700 [&_.ContentEditable__root]:min-h-0"
            placeholderClassName="hidden"
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  )
}
