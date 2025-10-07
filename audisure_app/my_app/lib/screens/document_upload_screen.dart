import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class DocumentUploadScreen extends StatefulWidget {
  const DocumentUploadScreen({Key? key}) : super(key: key);

  @override
  State<DocumentUploadScreen> createState() => _DocumentUploadScreenState();
}

class _DocumentUploadScreenState extends State<DocumentUploadScreen> {
  final ImagePicker _picker = ImagePicker();
  bool isLoading = false;
  bool isEnglish = true;

  String t(String en, String tl) => isEnglish ? en : tl;

  // Dropdowns
  String? selectedDocument;
  List<String> documentTypes = [
    "Barangay Clearance",
    "Certificate of Indigency",
    "Business Permit",
  ];

  Map<String, List<String>> requirementsMap = {
    "Barangay Clearance": ["Valid ID", "Birth Certificate", "Photo"],
    "Certificate of Indigency": ["Barangay ID", "Proof of Residency"],
    "Business Permit": ["Business Registration", "Photo of Location"],
  };

  List<String> requirements = [];
  Map<String, XFile?> capturedImages = {};

  @override
  Widget build(BuildContext context) {
    const Color primaryRed = Color(0xFFD32F2F);
    const Color lightGrey = Color(0xFFEEEEEE);
    const Color white = Colors.white;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          t("Upload Document", "Mag-upload ng Dokumento"),
          style: const TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600),
        ),
        backgroundColor: primaryRed,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Document Type Dropdown
                    DropdownButtonFormField<String>(
                      value: selectedDocument,
                      decoration: InputDecoration(
                        labelText: t("Select Document Type", "Pumili ng Uri ng Dokumento"),
                        filled: true,
                        fillColor: lightGrey,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: documentTypes
                          .map((doc) => DropdownMenuItem(
                                value: doc,
                                child: Text(doc),
                              ))
                          .toList(),
                      onChanged: (value) {
                        setState(() {
                          selectedDocument = value;
                          requirements = requirementsMap[value] ?? [];
                          capturedImages.clear();
                        });
                      },
                    ),
                    const SizedBox(height: 24),

                    // Requirements List
                    if (selectedDocument != null)
                      Column(
                        children: requirements.map((req) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: Row(
                              children: [
                                Expanded(child: Text(req)),
                                IconButton(
                                  icon: Icon(
                                    capturedImages[req] != null
                                        ? Icons.check_circle
                                        : Icons.camera_alt,
                                    color: capturedImages[req] != null
                                        ? Colors.green
                                        : primaryRed,
                                  ),
                                  onPressed: () => _captureImage(req),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),

                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: isLoading ? null : _submitDocuments,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primaryRed,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: isLoading
                            ? const CircularProgressIndicator(color: white)
                            : Text(
                                t("Submit Documents", "I-submit ang Dokumento"),
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Language Toggle
            Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              color: white,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _languageButton("English", true),
                  const SizedBox(width: 12),
                  _languageButton("Tagalog", false),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _languageButton(String label, bool english) {
    const Color primaryRed = Color(0xFFD32F2F);
    const Color mediumGrey = Color(0xFF757575);
    return GestureDetector(
      onTap: () {
        if (isEnglish != english) setState(() => isEnglish = english);
      },
      child: Text(
        label,
        style: TextStyle(
          fontFamily: 'Inter',
          fontWeight: FontWeight.w600,
          color: isEnglish == english ? primaryRed : mediumGrey,
        ),
      ),
    );
  }

  Future<void> _captureImage(String requirement) async {
    final XFile? image = await _picker.pickImage(source: ImageSource.camera, imageQuality: 70);
    if (image != null) {
      setState(() {
        capturedImages[requirement] = image;
      });
    }
  }

  Future<void> _submitDocuments() async {
    if (selectedDocument == null) {
      _showMessage(t("Please select a document type", "Pumili ng uri ng dokumento"));
      return;
    }

    if (capturedImages.length != requirements.length) {
      _showMessage(t("Please capture all required documents", "Kuhanan ang lahat ng kailangan"));
      return;
    }

    setState(() => isLoading = true);

    try {
      // Create PDF
      final pdf = pw.Document();
      for (var img in capturedImages.values) {
        final image = pw.MemoryImage(await img!.readAsBytes());
        pdf.addPage(pw.Page(build: (pw.Context context) {
          return pw.Center(child: pw.Image(image));
        }));
      }

      final pdfBytes = await pdf.save();

      // Upload PDF
      final prefs = await SharedPreferences.getInstance();
      final email = prefs.getString('user_email') ?? '';

      final uri = Uri.parse('https://audisure-fullstack.onrender.com/api/documents/upload');
      final request = http.MultipartRequest('POST', uri)
        ..fields['title'] = "$selectedDocument - $email"
        ..fields['user_email'] = email
        ..files.add(http.MultipartFile.fromBytes('file', pdfBytes, filename: 'document.pdf'));

      final response = await request.send();
      final respStr = await response.stream.bytesToString();

      setState(() => isLoading = false);

      if (response.statusCode == 200) {
        _showMessage(t("Documents uploaded successfully", "Matagumpay na na-upload ang dokumento"));
        setState(() {
          selectedDocument = null;
          requirements = [];
          capturedImages.clear();
        });
      } else {
        final respData = jsonDecode(respStr);
        _showMessage(respData['message'] ??
            t("Failed to upload documents", "Bigo ang pag-upload ng dokumento"));
      }
    } catch (e) {
      setState(() => isLoading = false);
      _showMessage(t("Error uploading documents", "May error sa pag-upload ng dokumento"));
    }
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(fontFamily: 'Inter', fontSize: 16)),
        backgroundColor: const Color(0xFFD32F2F),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }
}
