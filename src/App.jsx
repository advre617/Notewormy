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
import { FaTrash, FaSave, FaFeatherAlt, FaHeart, FaFolder, FaFolderOpen, FaChevronDown, FaChevronRight, FaPlus } from 'react-icons/fa';
import { MdOutlinePlaylistAdd } from "react-icons/md";

// color palette for the app (dark theme)
const palette = {
  darkBg: '#222831',
  mediumBg: '#393E46',
  accent: '#00ADB5',
  text: '#EEEEEE',
  danger: '#FF6B6B',
  groupBg: 'rgba(57, 62, 70, 0.7)'
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
  autoSaveText: {
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
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    backgroundColor: palette.groupBg,
    marginBottom: '0.5rem',
    cursor: 'pointer',
    userSelect: 'none'
  },
  groupTitle: {
    fontWeight: '600',
    fontSize: '1rem',
    color: palette.text,
    flex: 1
  },
  groupContent: {
    paddingLeft: '1.5rem',
    borderLeft: `2px solid ${palette.accent}`,
    marginLeft: '0.75rem',
    marginBottom: '0.75rem'
  },
  groupActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  groupActionButton: {
    background: 'none',
    border: 'none',
    color: palette.text,
    opacity: 0.5,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: '0.25rem',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  groupControls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    gap: '0.5rem'
  },
  secondaryButton: {
    backgroundColor: 'rgba(0, 173, 181, 0.2)',
    color: palette.accent,
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    fontSize: '0.875rem'
  },
  dropIndicator: {
    height: '2px',
    backgroundColor: palette.accent,
    margin: '0.25rem 0',
  }
};

function App() {
  const [notesList, setNotesList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNoteId, setPendingNoteId] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [dropTarget, setDropTarget] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('notesList');
    const savedGroups = localStorage.getItem('noteGroups');
    const lastOpenedNoteId = localStorage.getItem('lastOpenedNote');
    const savedExpandedGroups = localStorage.getItem('expandedGroups');

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

    if (savedGroups) {
      try {
        const parsedGroups = JSON.parse(savedGroups);
        setGroups(parsedGroups);

        if (savedExpandedGroups) {
          setExpandedGroups(JSON.parse(savedExpandedGroups));
        } else {
          const initialExpanded = {};
          parsedGroups.forEach(group => {
            initialExpanded[group.id] = true;
          });
          setExpandedGroups(initialExpanded);
          saveExpandedGroups(initialExpanded);
        }
      } catch (e) {
        console.error('Failed to parse groups from localStorage', e);
      }
    }
  }, []);

  const saveNotesList = useCallback((notes) => {
    localStorage.setItem('notesList', JSON.stringify(notes));
  }, []);

  const saveGroups = useCallback((groups) => {
    localStorage.setItem('noteGroups', JSON.stringify(groups));
  }, []);

  const saveExpandedGroups = useCallback((expanded) => {
    localStorage.setItem('expandedGroups', JSON.stringify(expanded));
  }, []);

  const addNewNote = useCallback((groupId = null) => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '# New Note\n\nStart writing here...',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTitleCustom: false,
      isDescriptionCustom: false,
      groupId: groupId
    };

    setNotesList(prevNotes => {
      if (groupId) {
        const groupNotes = prevNotes.filter(n => n.groupId === groupId);
        const firstGroupNoteIndex = prevNotes.findIndex(n => n.id === groupNotes[0]?.id);

        const updatedNotes = [...prevNotes];
        if (firstGroupNoteIndex >= 0) {
          updatedNotes.splice(firstGroupNoteIndex, 0, newNote);
        } else {
          updatedNotes.push(newNote);
        }
        localStorage.setItem('notesList', JSON.stringify(updatedNotes));
        return updatedNotes;
      } else {

        const updatedNotes = [...prevNotes, newNote];
        localStorage.setItem('notesList', JSON.stringify(updatedNotes));
        return updatedNotes;
      }
    });

    setMarkdownContent(newNote.content);
    setCurrentNoteId(newNote.id);
    localStorage.setItem('lastOpenedNote', newNote.id.toString());

    if (groupId) {
      setExpandedGroups(prev => {
        const newExpanded = { ...prev, [groupId]: true };
        localStorage.setItem('expandedGroups', JSON.stringify(newExpanded));
        return newExpanded;
      });
    }
  }, []);

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
    setNotesList(updatedNotes);
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
    setNotesList(updatedNotes);
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
    setNotesList(updatedNotes);
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

  const handleDragStart = (e, id, type) => {
    setDraggedItem({ id, type });
    setIsDragging(true);

    const img = new Image();
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
    e.dataTransfer.setDragImage(img, 0, 0);

    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetId, type, position = null) => {
    e.preventDefault();
    setDropTarget({ id: targetId, type });
    setDropPosition(position);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
    setDropPosition(null);
  };

  const handleDrop = (e, targetId, type) => {
    e.preventDefault();

    if (!draggedItem) return;

    if (draggedItem.type === 'note' && type === 'note') {
      const draggedNote = notesList.find(n => n.id === draggedItem.id);
      const targetNote = notesList.find(n => n.id === targetId);

      if (draggedNote && targetNote && draggedNote.groupId === targetNote.groupId) {
        const groupId = draggedNote.groupId;
        const groupNotes = getNotesForGroup(groupId);

        const updatedNotes = notesList.filter(n => n.id !== draggedItem.id);

        const targetIndex = groupNotes.findIndex(n => n.id === targetId);

        const insertIndex = notesList.findIndex(n => n.id === (
          dropPosition === 'after' ?
            groupNotes[Math.min(targetIndex + 1, groupNotes.length - 1)]?.id :
            targetId
        ));

        const finalIndex = insertIndex >= 0 ? insertIndex : updatedNotes.length;

        updatedNotes.splice(finalIndex, 0, draggedNote);

        saveNotesList(updatedNotes);
        setNotesList(updatedNotes);
      }
    }
    else if (draggedItem.type === 'note' && type === 'group') {
      moveNoteToGroup(draggedItem.id, targetId);
    }
    else if (draggedItem.type === 'note' && type === 'ungrouped') {
      moveNoteToGroup(draggedItem.id, null);
    }
    else if (draggedItem.type === 'group' && type === 'group') {
      const draggedIndex = groups.findIndex(g => g.id === draggedItem.id);
      const targetIndex = groups.findIndex(g => g.id === targetId);

      if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
        const newGroups = [...groups];
        const [movedGroup] = newGroups.splice(draggedIndex, 1);

        const insertIndex = dropPosition === 'after' ? targetIndex + 1 : targetIndex;
        newGroups.splice(insertIndex, 0, movedGroup);

        saveGroups(newGroups);
        setGroups(newGroups);
      }
    }

    setDropTarget(null);
    setDropPosition(null);
    setDraggedItem(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setDropTarget(null);
    setDropPosition(null);
    setDraggedItem(null);
    setIsDragging(false);
  };

  const createNewGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: newGroupName.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedGroups = [...groups, newGroup];
    saveGroups(updatedGroups);
    setGroups(updatedGroups);
    setNewGroupName('');
    setIsCreatingGroup(false);

    setExpandedGroups(prev => {
      const newExpanded = { ...prev, [newGroup.id]: true };
      saveExpandedGroups(newExpanded);
      return newExpanded;
    });
  };

  const deleteGroup = (groupId, e) => {
    e.stopPropagation();

    const updatedNotes = notesList.map(note => {
      if (note.groupId === groupId) {
        return { ...note, groupId: null };
      }
      return note;
    });

    const updatedGroups = groups.filter(group => group.id !== groupId);

    saveNotesList(updatedNotes);
    saveGroups(updatedGroups);
    setNotesList(updatedNotes);
    setGroups(updatedGroups);

    setExpandedGroups(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[groupId];
      return newExpanded;
    });
  };

  const toggleGroup = (groupId) => {
    console.log('this func was called')
    setExpandedGroups(prev => {
      const newExpanded = { ...prev, [groupId]: !prev[groupId] };
      console.log(JSON.stringify(newExpanded, null, 2));
      saveExpandedGroups(newExpanded);
      return newExpanded;
    });
  };

  const moveNoteToGroup = (noteId, groupId) => {
    const updatedNotes = notesList.map(note => {
      if (note.id === noteId) {
        return { ...note, groupId: groupId };
      }
      return note;
    });

    saveNotesList(updatedNotes);
    setNotesList(updatedNotes);

    if (groupId) {
      setExpandedGroups(prev => {
        const newExpanded = { ...prev, [groupId]: true };
        saveExpandedGroups(newExpanded);
        return newExpanded;
      });
    }
  };

  const getNotesForGroup = (groupId) => {
    return notesList.filter(note => note.groupId === groupId);
  };

  const getUngroupedNotes = () => {
    return notesList.filter(note => !note.groupId);
  };

  const handleGroupClick = (groupId, e) => {
    console.log('Group clicked:', groupId);
    const isTitleClick = e.target.hasAttribute('data-group-title') ||
      e.target.closest('[data-group-title]');

    if (e.detail === 2 && isTitleClick) {
      console.log('group title is editing');
      const group = groups.find(g => g.id === groupId);
      if (group) {
        setEditingGroupId(groupId);
        setEditGroupName(group.name);
      }
      return;
    }
    console.log('group is expanding/collapsing');

    const isActionButton = e.target.closest('[data-group-action]');
    if (!isActionButton) {
      toggleGroup(groupId);
      console.log('expanding/collapsing finished');
    }
  };

  const saveGroupName = useCallback(() => {
    if (!editingGroupId) return;

    const updatedGroups = groups.map(group => {
      if (group.id === editingGroupId) {
        return { ...group, name: editGroupName };
      }
      return group;
    });

    saveGroups(updatedGroups);
    setGroups(updatedGroups);
    setEditingGroupId(null);
    setEditGroupName('');
  }, [editingGroupId, editGroupName, groups, saveGroups]);


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
            </div>

            {isCreatingGroup && (
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createNewGroup()}
                  placeholder="Group name"
                  style={styles.inputField}
                  autoFocus
                />
                <button
                  style={{ ...styles.secondaryButton, padding: '0.5rem' }}
                  onClick={createNewGroup}
                >
                  Add
                </button>
                <button
                  style={{ ...styles.secondaryButton, padding: '0.5rem', backgroundColor: 'rgba(255, 107, 107, 0.2)', color: palette.danger }}
                  onClick={() => setIsCreatingGroup(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex-1 pr-2 pt-1 pl-1 overflow-y-auto custom-scrollbar">
              {groups.length > 0 && groups.map((group, groupIndex) => (
                <React.Fragment key={group.id}>
                  {dropTarget?.type === 'group' && dropTarget.id === group.id && dropPosition === 'before' && (
                    <div style={styles.dropIndicator} />
                  )}

                  <div
                    style={styles.groupHeader}
                    onClick={(e) => handleGroupClick(group.id, e)}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(0, 173, 181, 0.2)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = palette.groupBg}
                    draggable
                    onDragStart={(e) => handleDragStart(e, group.id, 'group')}
                    onDragOver={(e) => handleDragOver(e, group.id, 'group', 'before')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, group.id, 'group')}
                    className={draggedItem?.id === group.id && draggedItem?.type === 'group' ? 'grabbing' : ''}
                  >
                    {expandedGroups[group.id] ? (
                      <FaChevronDown size={14} />
                    ) : (
                      <FaChevronRight size={14} />
                    )}
                    {expandedGroups[group.id] ? (
                      <FaFolderOpen size={16} color={palette.accent} />
                    ) : (
                      <FaFolder size={16} color={palette.accent} />
                    )}
                    {editingGroupId === group.id ? (
                      <input
                        type="text"
                        value={editGroupName}
                        onChange={(e) => setEditGroupName(e.target.value)}
                        onBlur={saveGroupName}
                        onKeyDown={(e) => e.key === 'Enter' ? saveGroupName() : null}
                        autoFocus
                        style={styles.inputField}
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        style={styles.groupTitle}
                        data-group-title={group.id}
                      >
                        {group.name}
                      </span>
                    )}
                    <div style={styles.groupActions}>
                      <button
                        style={styles.groupActionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          addNewNote(group.id);
                        }}
                        title="Add note to group"
                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                        onMouseOut={e => e.currentTarget.style.opacity = 0.5}
                        data-group-action
                      >
                        <FaPlus size={12} />
                      </button>
                      <button
                        style={styles.groupActionButton}
                        onClick={(e) => deleteGroup(group.id, e)}
                        title="Delete group"
                        onMouseOver={e => {
                          e.currentTarget.style.opacity = 1;
                          e.currentTarget.style.color = palette.danger;
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.opacity = 0.5;
                          e.currentTarget.style.color = palette.text;
                        }}
                        data-group-action
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>

                  {dropTarget?.type === 'group' && dropTarget.id === group.id && dropPosition === 'after' && (
                    <div style={styles.dropIndicator} />
                  )}

                  {expandedGroups[group.id] && (
                    <div
                      style={{ ...styles.groupContent }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDropTarget({ id: group.id, type: 'group' });
                      }}
                      onDragLeave={handleDragLeave}
                    >
                      {getNotesForGroup(group.id).length > 0 && (
                        getNotesForGroup(group.id).map((note, noteIndex) => (
                          <React.Fragment key={note.id}>
                            {dropTarget?.type === 'note' && dropTarget.id === note.id && dropPosition === 'before' && (
                              <div style={styles.dropIndicator} />
                            )}

                            <div
                              draggable={editingNoteId !== note.id}
                              onDragStart={(e) => handleDragStart(e, note.id, 'note')}
                              onDragOver={(e) => handleDragOver(e, note.id, 'note', 'before')}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, note.id, 'note')}
                              className={`note-item ${isDragging && draggedItem?.id === note.id && draggedItem?.type === 'note' ? 'grabbing' : 'grab-ready'}`}
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
                                <button
                                  style={styles.deleteButton}
                                  onClick={(e) => deleteNote(note.id, e)}
                                  title="Delete note"
                                  onMouseOver={e => e.currentTarget.style.opacity = 1}
                                  onMouseOut={e => e.currentTarget.style.opacity = 0.5}
                                >
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            </div>

                            {dropTarget?.type === 'note' && dropTarget.id === note.id && dropPosition === 'after' && (
                              <div style={styles.dropIndicator} />
                            )}
                          </React.Fragment>
                        ))
                      )}
                      {getNotesForGroup(group.id).length === 0 && (
                        <div
                          style={{
                            padding: '0.5rem',
                            textAlign: 'center',
                            color: palette.text,
                            opacity: 0.5,
                            fontSize: '0.875rem'
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDropTarget({ id: group.id, type: 'group' });
                          }}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, group.id, 'group')}
                        >
                          No notes in this group. <br /> Drop notes here or add new ones.
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}

              {groups.length > 0 && dropTarget?.type === 'group' && dropTarget.id === groups[groups.length - 1].id && dropPosition === 'after' && (
                <div style={styles.dropIndicator} />
              )}

              <div
                style={{
                  ...styles.groupHeader,
                  backgroundColor: 'transparent',
                  paddingLeft: '0.5rem',
                  marginBottom: '0.25rem'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropTarget({ id: null, type: 'ungrouped' });
                }}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, null, 'ungrouped')}
              >
                <span>Ungrouped Notes</span>
              </div>

              {dropTarget?.type === 'ungrouped' && (
                <div style={styles.dropIndicator} />
              )}

              {getUngroupedNotes().length > 0 && (
                getUngroupedNotes().map((note, index) => (
                  <React.Fragment key={note.id}>
                    {dropTarget?.type === 'note' && dropTarget.id === note.id && dropPosition === 'before' && (
                      <div style={styles.dropIndicator} />
                    )}

                    <div
                      draggable={editingNoteId !== note.id}
                      onDragStart={(e) => handleDragStart(e, note.id, 'note')}
                      onDragOver={(e) => handleDragOver(e, note.id, 'note', 'before')}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, note.id, 'note')}
                      className={`note-item ${isDragging && draggedItem?.id === note.id && draggedItem?.type === 'note' ? 'grabbing' : 'grab-ready'}`}
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
                        <button
                          style={styles.deleteButton}
                          onClick={(e) => deleteNote(note.id, e)}
                          title="Delete note"
                          onMouseOver={e => e.currentTarget.style.opacity = 1}
                          onMouseOut={e => e.currentTarget.style.opacity = 0.5}
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>

                    {dropTarget?.type === 'note' && dropTarget.id === note.id && dropPosition === 'after' && (
                      <div style={styles.dropIndicator} />
                    )}
                  </React.Fragment>
                ))
              )}

              {notesList.length === 0 && (
                <div className="text-center py-10" style={{ color: palette.text, opacity: 0.5 }}>
                  No notes yet. <br /> Click "New Note" to begin.
                </div>
              )}

            </div>

          </div>
          <div className="flex justify-center p-4 border-t gap-4" style={{ borderColor: palette.darkBg }}>
            <button
              style={styles.button}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => addNewNote()}>
              <MdOutlinePlaylistAdd style={{ height: '1.4em', width: '1.4em' }} />
              New Note
            </button>
            <button
              style={{ ...styles.button, backgroundColor: 'rgba(0, 173, 181)' }}
              onClick={() => setIsCreatingGroup(true)}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FaPlus style={{ height: '1em', width: '1em' }} /> New Group
            </button>
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