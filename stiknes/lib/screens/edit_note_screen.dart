import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../utils/constants.dart';

class EditNoteScreen extends StatefulWidget {
  final int noteId;
  const EditNoteScreen({super.key, required this.noteId});

  @override
  EditNoteScreenState createState() => EditNoteScreenState();
}

class EditNoteScreenState extends State<EditNoteScreen> {
  late TextEditingController _titleController;
  late TextEditingController _contentController;
  bool isLoading = true;
  bool isSaving = false;
  bool isPreview = false;
  final supabase = Supabase.instance.client;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _contentController = TextEditingController();
    _fetchNote();
  }

  Future<void> _fetchNote() async {
    try {
      final note = await supabase
          .from(AppConstants.notesTable)
          .select()
          .eq('id', widget.noteId)
          .single();

      if (mounted) {
        setState(() {
          _titleController.text = note['title'] ?? '';
          _contentController.text = note['content'] ?? '';
          isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load note: ${e.toString()}')),
        );
        Navigator.pop(context);
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    super.dispose();
  }

  Future<void> _saveNote() async {
    if (_titleController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a title')),
      );
      return;
    }

    setState(() => isSaving = true);

    try {
      await supabase
          .from(AppConstants.notesTable)
          .update({
            'title': _titleController.text.trim(),
            'content': _contentController.text.trim(),
            'updated_at': DateTime.now().toIso8601String(),
          })
          .eq('id', widget.noteId);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Note saved successfully!')),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save note: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => isSaving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Note'),
        actions: [
          if (!isLoading)
            IconButton(
              icon: const Icon(Icons.save),
              onPressed: isSaving ? null : _saveNote,
            ),
          if (!isLoading)
            IconButton(
              icon: Icon(isPreview ? Icons.edit : Icons.preview),
              onPressed: () => setState(() => isPreview = !isPreview),
              tooltip: isPreview ? 'Edit mode' : 'Preview mode',
            ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : GestureDetector(
              onTap: () => FocusScope.of(context).unfocus(),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextField(
                      controller: _titleController,
                      decoration: const InputDecoration(
                        labelText: 'Title',
                        border: OutlineInputBorder(),
                      ),
                      style: Theme.of(context).textTheme.titleLarge,
                      maxLines: 1,
                      textInputAction: TextInputAction.next,
                    ),
                    const SizedBox(height: 20),
                    if (!isPreview)
                      TextField(
                        controller: _contentController,
                        maxLines: null,
                        minLines: 10,
                        keyboardType: TextInputType.multiline,
                        decoration: const InputDecoration(
                          labelText: 'Content (Markdown supported)',
                          alignLabelWithHint: true,
                          border: OutlineInputBorder(),
                        ),
                      ),
                    if (isPreview)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: MarkdownBody(
                          data: _contentController.text,
                          styleSheet: MarkdownStyleSheet(
                            p: const TextStyle(fontSize: 16, height: 1.5),
                            h1: Theme.of(context).textTheme.headlineLarge,
                            h2: Theme.of(context).textTheme.headlineMedium,
                            h3: Theme.of(context).textTheme.headlineSmall,
                          ),
                        ),
                      ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        icon: isSaving
                            ? const SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Icon(Icons.save),
                        label: Text(isSaving ? 'Saving...' : 'Save'),
                        onPressed: isSaving ? null : _saveNote,
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}