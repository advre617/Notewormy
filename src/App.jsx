import React, { useState } from 'react'
// Импорты плагинов и компонентов
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  tablePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  frontmatterPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertImage,
  InsertThematicBreak
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import './App.css'

function App() {
  const [markdownContent, setMarkdownContent] = useState(`# Welcome to the Markdown editor!

## Supported Features

### Text Formatting
- **Bold text**
- *Italic*
- ~~Strikethrough~~
- \`inline code\`

### Lists
1. Numbered list
2. Second item
   - Nested list
   - Another nested item

### Links and Images
[Example link](https://example.com)

![Alt text](https://via.placeholder.com/150 "Tooltip")

### Tables
| Header 1   | Header 2   |
|------------|------------|
| Cell 1    | Cell 2    |
| Cell 3    | Cell 4    |

### Quotes
> This is a quote.
> It can span multiple lines.

### Horizontal Rule
---
`)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 p-8 flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 w-full max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">📝 Simple Notes App</h1>
        <p className="text-gray-600 text-lg">Write. Review. Compose.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            className="bg-orange-600 hover:bg-orange-400 cursor-pointer text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            onClick={() => setMarkdownContent('# New note\n\nStart writing here...')}
          >
            Preview
          </button>
          <button className="bg-orange-600 hover:bg-orange-400 cursor-pointer text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5">
            Preview
          </button>
          <button className="bg-orange-600 hover:bg-orange-400 cursor-pointer text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5">
            Preview
          </button>
        </div>
      </div>

      <div className='flex flex-row gap-8 w-full max-w-9xl'>

        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-2 min-h-[500px] py-4 px-6" >
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            📌 Notes list
          </h1>
        </div>

        <div className="w-full max-w-10xl bg-white rounded-xl shadow-2xl p-2 min-h-[500px]">
          <MDXEditor
            markdown={markdownContent}
            onChange={setMarkdownContent}
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              tablePlugin(),
              thematicBreakPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              imagePlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
              codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'Plain Text' } }),
              directivesPlugin(),
              frontmatterPlugin(),
              markdownShortcutPlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <ListsToggle />
                    <BlockTypeSelect />
                    <CreateLink />
                    <InsertTable />
                    <InsertImage />
                    <InsertThematicBreak />
                  </>
                )
              })
            ]}
            contentEditableClassName="prose max-w-none mx-auto p-4
           [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:my-4
           [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:my-3
           [&>h3]:text-xl [&>h3]:font-bold [&>h3]:my-2
           [&>p]:my-3 [&>p]:leading-relaxed
           [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:my-3
           [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:my-3
           [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:my-3 [&>blockquote]:text-gray-600
           [&>pre]:bg-gray-100 [&>pre]:p-3 [&>pre]:rounded [&>pre]:overflow-x-auto [&>pre]:my-3
           [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:rounded [&>code]:text-sm
           [&>a]:text-orange-600 [&>a]:underline
           [&>hr]:my-4 [&>hr]:border-t [&>hr]:border-gray-200
           [&>table]:border-collapse [&>table]:w-full [&>table]:my-4
           [&>table_th]:border [&>table_th]:bg-gray-100 [&>table_th]:p-2 [&>table_th]:text-left
           [&>table_td]:border [&>table_td]:p-2"
          />
        </div>
      </div>

      <footer className="mt-12 text-white text-center text-opacity-80">
        <p>2025 Simple Notes App</p>
        <p>Created with 🧡 for your notes</p>
      </footer>
    </div>
  )
}

export default App