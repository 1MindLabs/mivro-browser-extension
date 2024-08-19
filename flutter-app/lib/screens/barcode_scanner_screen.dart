import 'package:mivro/widgets/barcode/barcode_scanner_list_view.dart';
import 'package:flutter/material.dart';

class BarcodeScannerScreen extends StatefulWidget {
  const BarcodeScannerScreen({super.key});

  @override
  State<StatefulWidget> createState() => _BarcodeScannerScreen();
}

class _BarcodeScannerScreen extends State<BarcodeScannerScreen> {
  @override
  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        Expanded(child: BarcodeScannerListView()),
      ],
    );
  }
}
