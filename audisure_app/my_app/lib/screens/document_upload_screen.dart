import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class SimpleUploadScreen extends StatefulWidget {
  const SimpleUploadScreen({Key? key}) : super(key: key);

  @override
  State<SimpleUploadScreen> createState() => _SimpleUploadScreenState();
}

class _SimpleUploadScreenState extends State<SimpleUploadScreen> {
  final ImagePicker _picker = ImagePicker();
  XFile? selectedImage;
  bool isLoading = false;

  // Cloudinary
  final String cloudinaryUploadUrl =
      "https://api.cloudinary.com/v1_1/dx78jwu6q/image/upload";
  final String cloudinaryUploadPreset = "audisure_unsigned";

  @override
  Widget build(BuildContext context) {
    const Color primaryRed = Color(0xFFD32F2F);
    return Scaffold(
      appBar: AppBar(
        title: const Text("Simple Document Upload"),
        backgroundColor: primaryRed,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            ElevatedButton.icon(
              onPressed: _pickImage,
              icon: const Icon(Icons.add_a_photo),
              label: const Text("Pick Image (Camera/Gallery)"),
              style: ElevatedButton.styleFrom(backgroundColor: primaryRed),
            ),
            const SizedBox(height: 16),
            if (selectedImage != null) Text("Selected: ${selectedImage!.name}"),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: selectedImage == null || isLoading ? null : _uploadDocument,
              style: ElevatedButton.styleFrom(backgroundColor: primaryRed),
              child: isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text("Upload Document"),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickImage() async {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text("Camera"),
              onTap: () async {
                Navigator.pop(context);
                final XFile? picked = await _picker.pickImage(
                    source: ImageSource.camera, imageQuality: 70);
                if (picked != null) setState(() => selectedImage = picked);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text("Gallery"),
              onTap: () async {
                Navigator.pop(context);
                final XFile? picked = await _picker.pickImage(
                    source: ImageSource.gallery, imageQuality: 70);
                if (picked != null) setState(() => selectedImage = picked);
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _uploadDocument() async {
    if (selectedImage == null) return;

    setState(() => isLoading = true);

    try {
      // Convert image to PDF
      final pdf = pw.Document();
      final imageBytes = await selectedImage!.readAsBytes();
      final pwImage = pw.MemoryImage(imageBytes);
      pdf.addPage(pw.Page(build: (context) => pw.Center(child: pw.Image(pwImage))));
      final pdfBytes = await pdf.save();

      // Upload PDF to Cloudinary
      final cloudRequest = http.MultipartRequest('POST', Uri.parse(cloudinaryUploadUrl));
      cloudRequest.files.add(
        http.MultipartFile.fromBytes('file', pdfBytes, filename: 'document.pdf'),
      );
      cloudRequest.fields['upload_preset'] = cloudinaryUploadPreset;

      final cloudResponse = await cloudRequest.send();
      final cloudRespStr = await cloudResponse.stream.bytesToString();

      if (cloudResponse.statusCode != 200) {
        throw Exception("Cloudinary upload failed: $cloudRespStr");
      }

      final cloudData = jsonDecode(cloudRespStr);
      final imageUrl = cloudData['secure_url'];

      // Send URL to backend
      final prefs = await SharedPreferences.getInstance();
      final email = prefs.getString('user_email') ?? 'test@example.com';

      final backendResp = await http.post(
        Uri.parse('https://audisure-backend.onrender.com/api/upload'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user_email': email,
          'document_type_id': 1, // placeholder
          'requirement_id': 0,   // placeholder
          'file_url': imageUrl,
        }),
      );

      if (backendResp.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Upload successful!")),
        );
        setState(() => selectedImage = null);
      } else {
        throw Exception("Backend upload failed: ${backendResp.body}");
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }
}
