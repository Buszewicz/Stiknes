import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../utils/supabase';
import { APP_CONSTANTS, ROUTES } from '../utils/constants';
import { Note } from '../types';
import ReactMarkdown from 'react-markdown';

const DashboardScreen: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { user, logout } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, [user]);

    const fetchNotes = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from(APP_CONSTANTS.NOTES_TABLE)
                .select('id, title, content, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotes(data || []);
        } catch (error) {
            console.error('Error loading notes:', error);
            alert('Error loading notes');
        } finally {
            setIsLoading(false);
        }
    };

    const addNewNote = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from(APP_CONSTANTS.NOTES_TABLE)
                .insert({
                    title: 'New Note',
                    content: '',
                    user_id: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            navigate(`${ROUTES.EDIT_NOTE}/${data.id}`);
        } catch (error) {
            console.error('Error creating note:', error);
            alert('Error creating note');
        }
    };

    const deleteNote = async (noteId: number) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const { error } = await supabase
                .from(APP_CONSTANTS.NOTES_TABLE)
                .delete()
                .eq('id', noteId);

            if (error) throw error;
            await fetchNotes();
            alert('Note deleted successfully');
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note');
        }
    };

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <button
                    className="menu-button"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                >
                    ☰
                </button>
                <h1>Dashboard</h1>
                <img
                    src={isDark ? '../assets/images/logo_light.png' : '../assets/images/logo.png'}
                    alt="Logo"
                    className="header-logo"
                />
            </header>

            <main className="dashboard-main">
                {notes.length === 0 ? (
                    <div className="empty-state">
                        <p>No notes found.</p>
                    </div>
                ) : (
                    <div className="notes-grid">
                        {notes.map((note) => (
                            <div key={note.id} className="note-card">
                                <div
                                    className="note-content"
                                    onClick={() => navigate(`${ROUTES.VIEW_NOTE}/${note.id}`)}
                                >
                                    <h3>{note.title}</h3>
                                    <p><ReactMarkdown>{note.content}</ReactMarkdown></p>
                                </div>
                                <button
                                    className="delete-button"
                                    onClick={() => deleteNote(note.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <button className="fab" onClick={addNewNote}>
                +
            </button>

            {isDrawerOpen && (
                <>
                    <div
                        className="drawer-overlay"
                        onClick={() => setIsDrawerOpen(false)}
                    ></div>
                    <nav className="drawer">
                        <div className="drawer-header">
                            <h2>Welcome, {user?.username}</h2>
                        </div>
                        <ul className="drawer-menu">
                            <li>
                                <Link to={ROUTES.SETTINGS} onClick={() => setIsDrawerOpen(false)}>
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <Link to={ROUTES.USER_INFO} onClick={() => setIsDrawerOpen(false)}>
                                    User Info
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout}>Log Out</button>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    );
};

export default DashboardScreen;