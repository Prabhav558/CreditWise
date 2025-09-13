// Test:
// 1) Ask: "What does FinShield predict?"
// 2) Ask: "List the dataset features."
// Expect grounded answers from the hardcoded context in the edge function.

import { useState } from "react";
import { Bot, X, Minimize2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askCreditWise } from "@/api";
import { useToast } from "@/hooks/use-toast";
import chatbotLogo from "@/assets/chatbot-logo.png";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: any[];
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your CreditWise assistant. How can I help you with credit risk analysis today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await askCreditWise(currentInput);
      
      let responseText = result.answer;
      if (!responseText || responseText === "No response.") {
        responseText = "Sorry, I couldn't find that in CreditWise's context.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        sources: result.sources
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat temporarily unavailable. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="relative w-16 h-16 rounded-full bg-gradient-primary shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 group overflow-hidden border-0 p-0"
            size="icon"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <img 
                src={chatbotLogo} 
                alt="CreditWise Assistant" 
                className="w-10 h-10 rounded-full transition-transform duration-300 group-hover:rotate-12"
              />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping opacity-0 group-hover:opacity-75"></div>
          </Button>
        </div>
      )}

      {/* Chatbot Screen */}
      {isOpen && (
        <Card 
          className={`fixed bottom-6 right-6 w-80 shadow-2xl border-0 bg-background z-50 transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-96'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-primary text-primary-foreground rounded-t-lg relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <img 
                  src={chatbotLogo} 
                  alt="CreditWise Assistant" 
                  className="w-6 h-6 rounded-full"
                />
                <div className="absolute -inset-1 rounded-full bg-accent/20 blur-sm"></div>
              </div>
              <span className="font-semibold text-primary-foreground">CreditWise Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content - Hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 h-64">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-[80%]">
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {message.text}
                        </div>
                        {message.sender === 'bot' && message.sources && (
                          <div className="text-xs text-muted-foreground mt-1 opacity-75">
                            Sources available
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm">
                        Typing...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex gap-2 p-4 border-t">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}