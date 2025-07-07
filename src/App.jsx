import React, { useState, useEffect, useCallback } from 'react'
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
import { FaTrash, FaSave } from 'react-icons/fa'

function App() {
  const [notesList, setNotesList] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
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
`);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notesList');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotesList(parsedNotes);
      } catch (e) {
        console.error('Failed to parse notes from localStorage', e);
      }
    }
  }, []);

  const saveNotesList = useCallback((notes) => {
    localStorage.setItem('notesList', JSON.stringify(notes));
    setNotesList(notes);
  }, []);

  const addNewNote = useCallback(() => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '# New note\n\nStart writing here...',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTitleCustom: false,
      isDescriptionCustom: false
    };

    const updatedNotes = [...notesList, newNote];
    saveNotesList(updatedNotes);
    setMarkdownContent(newNote.content);
    setCurrentNoteId(newNote.id);
  }, [notesList, saveNotesList]);

  const handleNoteClick = useCallback((note) => {
    setMarkdownContent(note.content);
    setCurrentNoteId(note.id);
  }, []);

  const deleteNote = useCallback((id, e) => {
    e.stopPropagation();
    const updatedNotes = notesList.filter(n => n.id !== id);
    saveNotesList(updatedNotes);
    if (currentNoteId === id) {
      setMarkdownContent('');
      setCurrentNoteId(null);
    }
  }, [notesList, currentNoteId, saveNotesList]);

  const saveCurrentNote = useCallback(() => {
    if (!currentNoteId) return;

    const updatedNotes = notesList.map(note => {
      if (note.id === currentNoteId) {
        return {
          ...note,
          content: markdownContent,
          updatedAt: new Date().toISOString(),
          title: note.isTitleCustom ? note.title : markdownContent.split('\n')[0].replace('#', '').trim() || 'Untitled Note',
          description: note.isDescriptionCustom ? note.description : (
            markdownContent.split('\n')[1] ? 
            markdownContent.split('\n')[1].trim() : 
            markdownContent.substring(0, 50).replace(/#/g, '').trim()
          )
        };
      }
      return note;
    });

    saveNotesList(updatedNotes);
  }, [currentNoteId, markdownContent, notesList, saveNotesList]);

  const handleContentChange = useCallback((newContent) => {
    setMarkdownContent(newContent);
  }, []);

  const handleDoubleClick = useCallback((noteId, field, e) => {
    e.stopPropagation();
    const note = notesList.find(n => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setEditingField(field);
      setEditValue(field === 'title' ? note.title : note.description || '');
    }
  }, [notesList]);

  const saveEdit = useCallback(() => {
    if (!editingNoteId || !editingField) return;

    const updatedNotes = notesList.map(note => {
      if (note.id === editingNoteId) {
        return {
          ...note,
          [editingField]: editValue,
          isTitleCustom: editingField === 'title' ? true : note.isTitleCustom,
          isDescriptionCustom: editingField === 'description' ? true : note.isDescriptionCustom,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    });

    saveNotesList(updatedNotes);
    setEditingNoteId(null);
    setEditingField(null);
    setEditValue('');
  }, [editingNoteId, editingField, editValue, notesList, saveNotesList]);

  const handleEditKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingNoteId(null);
      setEditingField(null);
      setEditValue('');
    }
  }, [saveEdit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 p-8 flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 w-full max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">📝 Simple Notes App</h1>
        <p className="text-gray-600 text-lg">Write. Review. Compose.</p>
      </div>

      <div className='flex flex-row gap-8 w-full max-w-10xl'>
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-2 min-h-[500px] max-h-[800px] py-4 px-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">📌 Notes list</h1>
            <button
              className="bg-orange-600 hover:bg-orange-400 cursor-pointer text-white font-bold py-2 px-4 rounded-lg shadow transition duration-200"
              onClick={addNewNote}
            >
              New Note
            </button>
          </div>

          {notesList.length > 0 ? (
            <div className="space-y-2 max-h-[680px] overflow-y-auto">
              {notesList.map(note => (
                <div
                  key={note.id}
                  className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition duration-200 ${currentNoteId === note.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      {editingNoteId === note.id && editingField === 'title' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={handleEditKeyPress}
                          autoFocus
                          className="w-full font-medium text-gray-800 mb-1 border border-gray-300 rounded px-2 py-1 bg-white"
                        />
                      ) : (
                        <h3 
                          className="font-medium text-gray-800 truncate"
                          onDoubleClick={(e) => handleDoubleClick(note.id, 'title', e)}
                        >
                          {note.title || 'Untitled Note'}
                        </h3>
                      )}
                      
                      {editingNoteId === note.id && editingField === 'description' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={handleEditKeyPress}
                          autoFocus
                          className="w-full text-sm text-gray-500 mb-1 border border-gray-300 rounded px-2 py-1 bg-white"
                        />
                      ) : (
                        <p 
                          className="text-sm text-gray-500 truncate"
                          onDoubleClick={(e) => handleDoubleClick(note.id, 'description', e)}
                        >
                          {note.description || note.content.substring(0, 50).replace(/#/g, '').trim() || 'Empty note...'}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(note.updatedAt || note.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      onClick={(e) => deleteNote(note.id, e)}
                      aria-label="Delete note"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No notes yet. Click "New Note" to create one!
            </div>
          )}
        </div>

        <div className="w-full max-w-8xl bg-white rounded-xl shadow-2xl p-2 min-h-[500px] max-h-[800px] flex flex-col overflow-y-auto">
          <div className="flex-1 overflow-y-auto">
            <MDXEditor
              key={currentNoteId || 'editor'}
              markdown={markdownContent}
              onChange={handleContentChange}
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
                [&>hr]:my-4 [&>hr]:border-t [&&>hr]:border-gray-200
                [&>table]:border-collapse [&>table]:w-full [&>table]:my-4
                [&>table_th]:border [&>table_th]:bg-gray-100 [&>table_th]:p-2 [&>table_th]:text-left
                [&>table_td]:border [&>table_td]:p-2"
            />
          </div>

          <div className="flex justify-end p-2">
            <button
              className="flex items-center gap-2 bg-orange-600 cursor-pointer hover:bg-orange-400 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-200"
              onClick={saveCurrentNote}
              disabled={!currentNoteId}
            >
              <FaSave /> Save
            </button>
          </div>
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