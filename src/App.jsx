import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './App.css';
import { FaTrash, FaSave, FaFeatherAlt, FaHeart } from 'react-icons/fa';
import { MdOutlinePlaylistAdd } from "react-icons/md";

// color palette for the app (dark theme)
const palette = {
  darkBg: '#222831',
  mediumBg: '#393E46',
  accent: '#00ADB5',
  text: '#EEEEEE',
  danger: '#FF6B6B'
};

const styles = {
  appBackground: {
    backgroundColor: palette.darkBg,
    minHeight: '100vh',
    padding: '1.5rem 2rem',
    color: palette.text,
    fontFamily: "'Nunito', sans-serif"
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  headerTitle: {
    color: palette.accent,
    fontWeight: 'bold',
    fontSize: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem'
  },
  headerSubtitle: {
    color: palette.text,
    opacity: 0.7,
    fontSize: '1.125rem'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    width: '100%',
    maxWidth: '1400px',
    height: 'calc(100vh - 180px)'
  },
  notesListContainer: {
    backgroundColor: palette.mediumBg,
    borderRadius: '16px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  notesListWrapper: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden'
  },
  notesListHeader: {
    color: palette.text,
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  editorContainer: {
    backgroundColor: palette.mediumBg,
    borderRadius: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    maxHeight: '100%',
    overflow: 'hidden'
  },
  noteItem: {
    padding: '1rem 1.25rem',
    border: `2px solid transparent`,
    borderColor: 'transparent',
    borderRadius: '12px',
    marginBottom: '0.75rem',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transition: 'all 0.2s ease-in-out',
  },
  activeNote: {
    backgroundColor: 'rgba(0, 173, 181, 0.15)',
    borderColor: palette.accent,
    transform: 'scale(1.02)',
  },
  noteTitle: {
    fontWeight: '600',
    fontSize: '1.1rem',
    color: palette.text,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  noteDescription: {
    color: palette.text,
    opacity: 0.6,
    fontSize: '0.875rem'
  },
  noteDate: {
    color: palette.text,
    opacity: 0.4,
    fontSize: '0.75rem',
    marginTop: '0.5rem'
  },
  button: {
    backgroundColor: palette.accent,
    color: palette.darkBg,
    border: 'none',
    padding: '0.75rem 1.25rem',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
  },
  autoSaveText:{
    color: palette.text,
    fontSize: '0.875rem',
    fontFamily: "'Nunito', sans-serif",
  },
  deleteButton: {
    color: palette.text,
    opacity: 0.5,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
  },
  inputField: {
    width: '100%',
    padding: '0.35rem',
    border: `1px solid ${palette.accent}`,
    borderRadius: '4px',
    backgroundColor: palette.darkBg,
    color: palette.text,
    fontSize: '1rem'
  },
  footer: {
    marginTop: '2.5rem',
    color: palette.text,
    textAlign: 'center',
    opacity: '0.5'
  }
};

function App() {
  const [notesList, setNotesList] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [draggedNoteId, setDraggedNoteId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNoteId, setPendingNoteId] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notesList');
    const lastOpenedNoteId = localStorage.getItem('lastOpenedNote');

    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotesList(parsedNotes);

        if (lastOpenedNoteId) {
          const lastOpenedNote = parsedNotes.find(note => note.id === parseInt(lastOpenedNoteId));
          if (lastOpenedNote) {
            setCurrentNoteId(lastOpenedNote.id);
            setMarkdownContent(lastOpenedNote.content);
          } else {
            setCurrentNoteId(null);
            setMarkdownContent('');
          }
        } else if (parsedNotes.length > 0) {
          // fallback to last note
          const lastNote = parsedNotes[parsedNotes.length - 1];
          setCurrentNoteId(lastNote.id);
          setMarkdownContent(lastNote.content);
        } else {
          setMarkdownContent(`# Welcome to Notewormy! 💎✨

## A sleek, modern editor built for focus.

### Key Features:
- Easily create bold, italic, or \`inline code\`.
- Organize your thoughts with numbered or bulleted lists.
- A minimalist design that's both beautiful and functional.

> "Simplicity is the ultimate sophistication." 
> – Leonardo da Vinci
`);
        }

      } catch (e) {
        console.error('Failed to parse notes from localStorage', e);
        setMarkdownContent(`# Welcome to Notewormy! 💎✨\n\n...`);
      }
    } else {
      setMarkdownContent(`# Welcome to Notewormy! 💎✨

## A sleek, modern editor built for focus.

### Key Features:
- Easily create bold, italic, or \`inline code\`.
- Organize your thoughts with numbered or bulleted lists.
- A minimalist design that's both beautiful and functional.

> "Simplicity is the ultimate sophistication." 
> – Leonardo da Vinci
`);
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
      content: '# New Note\n\nStart writing here...',
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
    if (note.id === currentNoteId) return;

    const currentNote = notesList.find(n => n.id === currentNoteId);
    if (currentNote && currentNote.content !== markdownContent) {
      setPendingNoteId(note.id);
      setShowConfirmModal(true);
      return;
    }

    setMarkdownContent(note.content);
    setCurrentNoteId(note.id);
    localStorage.setItem('lastOpenedNote', note.id);
  }, [notesList, currentNoteId, markdownContent]);

  const confirmNoteSwitch = () => {
    const nextNote = notesList.find(n => n.id === pendingNoteId);
    if (nextNote) {
      setMarkdownContent(nextNote.content);
      setCurrentNoteId(nextNote.id);
      localStorage.setItem('lastOpenedNote', nextNote.id);
    }
    setShowConfirmModal(false);
    setPendingNoteId(null);
  };

  const cancelNoteSwitch = () => {
    setShowConfirmModal(false);
    setPendingNoteId(null);
  };

  const deleteNote = useCallback((id, e) => {
    e.stopPropagation();
    const updatedNotes = notesList.filter(n => n.id !== id);
    saveNotesList(updatedNotes);
    if (currentNoteId === id) {
      if (updatedNotes.length > 0) {
        const lastNote = updatedNotes[updatedNotes.length - 1];
        setMarkdownContent(lastNote.content);
        setCurrentNoteId(lastNote.id);
      } else {
        setMarkdownContent('');
        setCurrentNoteId(null);
      }

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
          title: note.isTitleCustom ? note.title : markdownContent.split('\n')[0].replace(/#/g, '').trim() || 'Untitled Note',
          description: note.isDescriptionCustom ? note.description : (
            markdownContent.split('\n').slice(1).find(line => line.trim()) || markdownContent.substring(0, 80).replace(/#/g, '').trim()
          )
        };
      }
      return note;
    });
    saveNotesList(updatedNotes);
  }, [currentNoteId, markdownContent, notesList, saveNotesList]);

  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(() => {
      saveCurrentNote();
    }, 60000);

    return () => clearInterval(interval);
  }, [autoSaveEnabled, saveCurrentNote]);

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
    if (e.key === 'Enter' && !e.shiftKey) { saveEdit(); }
    else if (e.key === 'Escape') {
      setEditingNoteId(null);
      setEditingField(null);
      setEditValue('');
    }
  }, [saveEdit]);

  const handleDragStart = (e, id) => {
    setDraggedNoteId(id);
    setIsDragging(true);

    const img = new Image();
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
    e.dataTransfer.setDragImage(img, 0, 0);

    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, targetId) => {
    e.preventDefault();
    if (draggedNoteId === targetId) return;

    const updatedList = [...notesList];
    const draggedIdx = updatedList.findIndex(n => n.id === draggedNoteId);
    const targetIdx = updatedList.findIndex(n => n.id === targetId);

    const [draggedNote] = updatedList.splice(draggedIdx, 1);
    updatedList.splice(targetIdx, 0, draggedNote);

    setNotesList(updatedList);
  };

  const handleDragEnd = () => {
    setDraggedNoteId(null);
    setIsDragging(false);
    saveNotesList(notesList);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  return (
    <div style={styles.appBackground} className="flex flex-col items-center">
      <header style={styles.header}>
        <h1 style={styles.headerTitle}><FaFeatherAlt /> Notewormy</h1>
        <p style={styles.headerSubtitle}>Your Markdown Notepad</p>
      </header>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-[#4F5257]/50 flex items-center justify-center z-50 transition-opacity animate-fade-in">
          <div className="bg-[#393E46] rounded-2xl p-8 shadow-2xl max-w-md w-full transform scale-100 transition-transform animate-slide-up">
            <h2 className="text-xl font-bold text-[#EEEEEE] mb-4">Unsaved changes</h2>
            <p className="text-[#CCCCCC] mb-6">You have unsaved changes. Are you sure you want to leave without saving?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-[#00ADB5] text-[#222831] font-semibold hover:bg-[#00cdd5] transition-all"
                onClick={confirmNoteSwitch}
              >
                Leave
              </button>
              <button
                className="px-4 py-2 rounded-lg border border-[#EEEEEE] text-[#EEEEEE] hover:bg-[#4a4e55] transition-all"
                onClick={cancelNoteSwitch}
              >
                Stay
              </button>
            </div>
          </div>
        </div>
      )}


      <main style={styles.container}>
        <div style={styles.notesListContainer}>
          <div style={styles.notesListWrapper}>
            <div className="flex justify-between items-center mb-6">
              <h2 style={styles.notesListHeader}>My Notes</h2>
              <button style={styles.button} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} onClick={addNewNote}>
                <MdOutlinePlaylistAdd style={{ height: '1.4em', width: '1.4em' }} />
                New Note
              </button>
            </div>

            <div className="flex-1 pr-2 pt-1 pl-1 overflow-y-auto custom-scrollbar">
              {notesList.length > 0 ? (
                notesList.map(note => (
                  <div
                    key={note.id}
                    draggable={editingNoteId !== note.id}
                    onDragStart={(e) => handleDragStart(e, note.id)}
                    onDragEnter={(e) => handleDragEnter(e, note.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    className={`note-item ${isDragging && draggedNoteId === note.id ? 'grabbing' : 'grab-ready'
                      }`}
                    style={{
                      ...styles.noteItem,
                      ...(currentNoteId === note.id ? styles.activeNote : {}),
                    }}
                    onClick={() => handleNoteClick(note)}
                  >

                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        {editingNoteId === note.id && editingField === 'title' ? (
                          <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={saveEdit} onKeyDown={handleEditKeyPress} autoFocus style={styles.inputField} onClick={e => e.stopPropagation()} />
                        ) : (
                          <h3 style={styles.noteTitle} onDoubleClick={(e) => handleDoubleClick(note.id, 'title', e)}> {note.title || 'Untitled Note'} </h3>
                        )}
                        {editingNoteId === note.id && editingField === 'description' ? (
                          <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={saveEdit} onKeyDown={handleEditKeyPress} autoFocus style={{ ...styles.inputField, marginTop: '4px', fontSize: '0.9rem' }} onClick={e => e.stopPropagation()} />
                        ) : (
                          <p style={styles.noteDescription} onDoubleClick={(e) => handleDoubleClick(note.id, 'description', e)}> {note.description || 'No description'} </p>
                        )}
                        <p style={styles.noteDate}> {new Date(note.updatedAt || note.createdAt).toLocaleString()} </p>
                      </div>
                      <button style={styles.deleteButton} onClick={(e) => deleteNote(note.id, e)} aria-label="Delete note" onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.5}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10" style={{ color: palette.text, opacity: 0.5 }}>
                  No notes yet. <br /> Click "New Note" to begin.
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.editorContainer}>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <MDXEditor
              key={currentNoteId || 'editor'}
              markdown={markdownContent}
              onChange={handleContentChange}
              plugins={[
                headingsPlugin(), listsPlugin(), quotePlugin(), tablePlugin(),
                thematicBreakPlugin(), linkPlugin(), linkDialogPlugin(), imagePlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'Plain Text' } }),
                directivesPlugin(), frontmatterPlugin(), markdownShortcutPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo /> <BoldItalicUnderlineToggles /> <ListsToggle />
                      <BlockTypeSelect /> <CreateLink /> <InsertTable /> <InsertImage /> <InsertThematicBreak />
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

          <div className="flex justify-end p-4 border-t gap-4" style={{ borderColor: palette.darkBg }}>
            <label className="flex items-center gap-2 text-[#EEEEEE] cursor-pointer">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={() => setAutoSaveEnabled(prev => !prev)}
                className="accent-[#00ADB5] w-4 h-4"
              />
              <span style={styles.autoSaveText}>Auto-save</span>
            </label>

            <button style={{ ...styles.button, opacity: !currentNoteId ? 0.5 : 1 }} onMouseOver={e => { if (currentNoteId) e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} onClick={saveCurrentNote} disabled={!currentNoteId}>
              <FaSave /> Save
            </button>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p> {new Date().getFullYear()} Notewormy</p>
        <p>Powered by <a href="https://github.com/advre617">Nikita Rulevics</a></p>
        <span className='flex flex-row gap-2 items-center justify-center'> With <FaHeart /> for your notes</span>

      </footer>
    </div>
  )
}

export default App;