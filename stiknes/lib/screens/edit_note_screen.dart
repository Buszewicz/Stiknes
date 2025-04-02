import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class EditNoteScreen extends StatefulWidget {
  final int noteId; // Zamiast Map, przekazujemy tylko ID notatki

  const EditNoteScreen({super.key, required this.noteId});

  @override
  _EditNoteScreenState createState() => _EditNoteScreenState();
}

class _EditNoteScreenState extends State<EditNoteScreen> {
  late TextEditingController _titleController;
  late TextEditingController _contentController;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _contentController = TextEditingController();
    _fetchNote(); // Pobranie notatki po załadowaniu ekranu
  }

  Future<void> _fetchNote() async {
    final note = await Supabase.instance.client
        .from('notes')
        .select()
        .eq('id', widget.noteId)
        .single();

    if (note != null) {
      setState(() {
        _titleController.text = note['title'] ?? '';
        _contentController.text = note['content'] ?? '';
        isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    super.dispose();
  }

  void _saveNote() async {
    await Supabase.instance.client
        .from('notes')
        .update({'title': _titleController.text, 'content': _contentController.text})
        .eq('id', widget.noteId);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Note saved successfully!')),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Note')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator()) // Spinner podczas ładowania
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  TextField(
                    controller: _titleController,
                    decoration: const InputDecoration(labelText: 'Title'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _contentController,
                    maxLines: 5,
                    decoration: const InputDecoration(labelText: 'Content'),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _saveNote,
                    child: const Text('Save'),
                  ),
                ],
              ),
            ),
    );
  }
}
