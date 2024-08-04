import 'dart:developer';

import 'package:mivro/models/message.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

class ChatsNotifier extends StateNotifier<List<dynamic>> {
  ChatsNotifier() : super([]);
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  Future<Message> getResponse(String prompt) async {
    _isLoading = true;
    state = [...state];
    var geminiApiKey = 'AIzaSyBbzVI-x9oVNlcqVkDd1td-MrdKQiElbHY';
    log(geminiApiKey);
    log('here in gemini api provider');
    final model = GenerativeModel(model: 'gemini-pro', apiKey: geminiApiKey);
    final content = [
      Content.text(
          'You are Mivro, a knowledgeable and friendly chatbot specializing in health and food. Your primary role is to provide accurate information about nutritional facts of different foods and advise on whether they are healthy. Also answer question related to food products and if they are healty or not. If asked about topics outside of health and food, politely inform the user that you can only answer questions related to health and food. Start with introducing yourself and here is your prompt: $prompt')
    ];

    final response = await model.generateContent(content);

    final chat = Message(text: response.text!, isUser: false);

    state = [...state, chat];
    _isLoading = false;
    state = [...state];

    return chat;
  }
}

final chatsProvider = StateNotifierProvider<ChatsNotifier, List<dynamic>>(
    (ref) => ChatsNotifier());
