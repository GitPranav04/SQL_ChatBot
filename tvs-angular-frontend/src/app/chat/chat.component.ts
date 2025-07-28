import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatResponse } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  isArray(val: any): boolean {
    return Array.isArray(val);
  }
  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  
  isChatOpen = false;
  userMessage = '';
  messages: {text: string, sender: 'user' | 'bot'}[] = [];
  isTyping = false;
  dealerId: number | null = null;
  private scrollToBottom = false;

  userInput: string = '';
  sqlQuery: string = '';
  sqlResult: any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Initial messages
    setTimeout(() => {
      this.addMessage('TVS Dealer Assistant ready. How can I help?', 'bot');
      this.addMessage('Ask about stock, orders, or support.', 'bot');
    }, 1000);
  }
  
  ngAfterViewChecked() {
    if (this.scrollToBottom) {
      this.scrollToBottomOfChat();
      this.scrollToBottom = false;
    }
  }

  scrollToBottomOfChat(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = 
        this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err: any) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      // When opening chat, scroll to bottom after view is updated
      setTimeout(() => this.scrollToBottomOfChat(), 100);
    }
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;
    
    // Add user message
    this.addMessage(this.userMessage, 'user');
    const messageToSend = this.userMessage;
    this.userMessage = '';
    
    // Show typing indicator
    this.isTyping = true;
    
    // Send to backend (only one argument!)
    this.chatService.sendMessage(messageToSend, this.dealerId)
      .subscribe({
        next: (response) => {
          this.isTyping = false;
          // If response is an array or object, show a generic message in chat bubble
          if (Array.isArray(response.response) || typeof response.response === 'object') {
            this.addMessage('SQL query executed. See table below.', 'bot');
          } else {
            this.addMessage(response.response, 'bot');
          }
          this.sqlQuery = response.sql;
          this.sqlResult = response.response;
        },
        error: (error) => {
          this.isTyping = false;
          this.addMessage("Sorry, I'm having trouble connecting. Please try again.", 'bot');
          console.error('Chat error:', error);
        }
      });
  }

  addMessage(text: string, sender: 'user' | 'bot') {
    this.messages.push({ text, sender });
    this.scrollToBottom = true;
  }
}
