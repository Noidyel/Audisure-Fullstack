import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

class DocumentUploadScreen extends StatefulWidget {
  const DocumentUploadScreen({super.key});

  @override
  State<DocumentUploadScreen> createState() => _DocumentUploadScreenState();
}

class _DocumentUploadScreenState extends State<DocumentUploadScreen> {
  final String baseUrl =
      "https://audisure-backend.onrender.com/api/documents_meta";
  final String backendUploadUrl =
      "https://audisure-backend.onrender.com/api/upload";
  final String cloudinaryUploadUrl =
      "https://api.cloudinary.com/v1_1/dx78jwu6q/image/upload";
  final String cloudinaryUploadPreset = "audisure_unsigned"; // your unsigned preset

  List<Map<String, dynamic>> documentTypes = [];
  List<Map<String, dynamic>> requirements = [];
  int? selectedTypeId;

  Map<int, List<XFile>> uploadedImages = {};
  bool isLoading = false;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _fetchDocumentTypes();
  }

  Future<void> _fetchDocumentTypes() async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/types"));
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        setState(() {
          documentTypes =
              List<Map<String, dynamic>>.from(data['types'] ?? []);
        });
      } else {
        _showMessage("Failed to fetch document types");
      }
    } catch (e) {
      _showMessage("Error fetching document types: $e");
    }
  }

  Future<void> _fetchRequirements(int typeId) async {
    try {
      final response =
          await http.get(Uri.parse("$baseUrl/requirements/$typeId"));
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        setState(() {
          requirements =
              List<Map<String, dynamic>>.from(data['requirements'] ?? []);
          uploadedImages.clear();
        });
      } else {
        _showMessage("Failed to fetch requirements");
      }
    } catch (e) {
      _showMessage("Error fetching requirements: $e");
    }
  }

  Future<void> _pickImage(int requirementId) async {
    final req = requirements.firstWhere((r) => r['id'] == requirementId);
    final allowMultiple = req['allow_multiple'] ?? false;

    List<XFile> pickedFiles = [];

    if (allowMultiple) {
      final files = await _picker.pickMultiImage();
      if (files != null) pickedFiles = files;
    } else {
      final single = await _picker.pickImage(source: ImageSource.gallery);
      if (single != null) pickedFiles = [single];
    }

    if (pickedFiles.isEmpty) return;

    setState(() {
      if (allowMultiple) {
        uploadedImages[requirementId] =
            [...?uploadedImages[requirementId], ...pickedFiles];
      } else {
        uploadedImages[requirementId] = [pickedFiles.first];
      }
    });
  }

  Future<void> _uploadDocuments() async {
    if (selectedTypeId == null || uploadedImages.isEmpty) {
      _showMessage("Please select a document type and upload required files");
      return;
    }

    setState(() => isLoading = true);

    try {
      for (var entry in uploadedImages.entries) {
        final requirementId = entry.key;
        final files = entry.value;

        for (var file in files) {
          // Upload to Cloudinary
          final cloudRequest =
              http.MultipartRequest('POST', Uri.parse(cloudinaryUploadUrl));
          cloudRequest.files
              .add(await http.MultipartFile.fromPath('file', file.path));
          cloudRequest.fields['upload_preset'] = cloudinaryUploadPreset;

          final cloudResponse = await cloudRequest.send();
          if (cloudResponse.statusCode != 200) {
            _showMessage("Cloudinary upload failed: ${file.name}");
            continue;
          }

          final cloudRespStr = await cloudResponse.stream.bytesToString();
          final cloudData = jsonDecode(cloudRespStr);
          final imageUrl = cloudData['secure_url'];
          print("Cloudinary URL: $imageUrl"); // <-- debug print

          // Send URL to backend
          final backendResp = await http.post(
            Uri.parse(backendUploadUrl),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'document_type_id': selectedTypeId,
              'requirement_id': requirementId,
              'file_url': imageUrl,
            }),
          );

          if (backendResp.statusCode != 200) {
            _showMessage(
                "Backend save failed for file: ${file.name} (${backendResp.body})");
          }
        }
      }

      _showMessage("All files uploaded successfully!");
      setState(() {
        uploadedImages.clear();
      });
    } catch (e) {
      _showMessage("Error uploading documents: $e");
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryRed = Color(0xFFD32F2F);
    const Color white = Colors.white;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Upload Documents"),
        backgroundColor: primaryRed,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              DropdownButtonFormField<int>(
                value: selectedTypeId,
                hint: const Text("Select Document Type"),
                items: documentTypes
                    .map((type) => DropdownMenuItem<int>(
                          value: type['id'] as int,
                          child: Text(type['type_name'] ?? ''),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() => selectedTypeId = value);
                  if (value != null) _fetchRequirements(value);
                },
              ),
              const SizedBox(height: 16),
              Expanded(
                child: requirements.isEmpty
                    ? const Center(
                        child:
                            Text("Select a document type to see requirements"))
                    : ListView.builder(
                        itemCount: requirements.length,
                        itemBuilder: (context, index) {
                          final req = requirements[index];
                          final reqId = req['id'] as int;
                          final optional = req['optional'] ?? false;
                          final allowMultiple = req['allow_multiple'] ?? false;
                          final uploaded = uploadedImages[reqId] ?? [];

                          return Card(
                            child: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                          child: Text(
                                              req['requirement_name'] ?? '',
                                              style: const TextStyle(
                                                  fontWeight: FontWeight.bold))),
                                      if (optional)
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: Colors.grey[300],
                                            borderRadius:
                                                BorderRadius.circular(8),
                                          ),
                                          child: const Text("Optional",
                                              style: TextStyle(fontSize: 12)),
                                        ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Wrap(
                                    spacing: 8,
                                    children: uploaded
                                        .map((img) => Image.file(File(img.path),
                                            width: 80,
                                            height: 80,
                                            fit: BoxFit.cover))
                                        .toList(),
                                  ),
                                  TextButton.icon(
                                    onPressed: () => _pickImage(reqId),
                                    icon: const Icon(Icons.upload_file),
                                    label: Text(
                                        allowMultiple ? "Add Images" : "Add Image"),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isLoading ? null : _uploadDocuments,
                  style: ElevatedButton.styleFrom(backgroundColor: primaryRed),
                  child: isLoading
                      ? const CircularProgressIndicator(color: white)
                      : const Text("Upload All",
                          style: TextStyle(fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
