import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { APP_CONSTANTS, ROUTES } from '../utils/constants';
import { Note } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

const ViewNoteScreen: React.FC = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const [note, setNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (noteId) {
            fetchNote();
        }
    }, [noteId]);

    const fetchNote = async () => {
        if (!noteId) return;

        try {
            const { data, error } = await supabase
                .from(APP_CONSTANTS.NOTES_TABLE)
                .select()
                .eq('id', noteId)
                .single();

            if (error) throw error;
            setNote(data);
        } catch (error) {
            console.error('Error loading note:', error);
            alert('Error loading note');
            navigate(ROUTES.DASHBOARD);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="error-state">
                <p>Note not found</p>
                <button onClick={() => navigate(ROUTES.DASHBOARD)}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="view-note">
            <header className="view-header">
                <button onClick={() => navigate(ROUTES.DASHBOARD)}>
                    ← Back
                </button>
                <h1>View Note</h1>
                <button onClick={() => navigate(`${ROUTES.EDIT_NOTE}/${noteId}`)}>
                    ✏️ Edit
                </button>
            </header>

            <main className="view-main">
                <h1 className="note-title">{note.title || 'Untitled'}</h1>
                <div className="note-content-container">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content || ''}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
};

export default ViewNoteScreen;