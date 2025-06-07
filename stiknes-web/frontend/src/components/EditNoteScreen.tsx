import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { APP_CONSTANTS, ROUTES } from '../utils/constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

const EditNoteScreen: React.FC = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    const { user } = useAuth();
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
            setTitle(data.title || '');
            setContent(data.content || '');
        } catch (error) {
            console.error('Error loading note:', error);
            alert('Failed to load note');
            navigate(ROUTES.DASHBOARD);
        } finally {
            setIsLoading(false);
        }
    };

    const saveNote = async () => {
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        setIsSaving(true);

        try {
            const { error } = await supabase
                .from(APP_CONSTANTS.NOTES_TABLE)
                .update({
                    title: title.trim(),
                    content: content.trim(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', noteId);

            if (error) throw error;
            alert('Note saved successfully!');
            navigate(ROUTES.DASHBOARD);
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="edit-note">
            <header className="edit-header">
                <button onClick={() => navigate(ROUTES.DASHBOARD)}>
                    ← Back
                </button>
                <h1>Edit Note</h1>
                <div className="header-actions">
                    <button onClick={saveNote} disabled={isSaving}>
                        {isSaving ? '💾' : '💾'} Save
                    </button>
                    <button onClick={() => setIsPreview(!isPreview)}>
                        {isPreview ? '✏️' : '👁️'} {isPreview ? 'Edit' : 'Preview'}
                    </button>
                </div>
            </header>

            <main className="edit-main">
                <div className="form-group">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="title-input"
                    />
                </div>

                {!isPreview ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content (Markdown supported)"
                        className="content-textarea"
                    />
                ) : (
                    <div className="preview-container">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    </div>
                )}

                <button
                    className="save-button-large"
                    onClick={saveNote}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </main>
        </div>
    );
};

export default EditNoteScreen;