import { useState } from "react";
import { Bot, X, Minimize2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askCreditWise } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import creditWiseLogo from "@/assets/creditwise-logo.png";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Initialize with greeting message when opened
  const initializeChat = () => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: t('chatbot.greeting'),
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
    setIsOpen(true);
  };

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
        responseText = t('chatbot.noResponse');
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
        title: t('chatbot.error'),
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
        <Button
          onClick={initializeChat}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50 p-0 bg-gradient-to-r from-primary to-accent hover:scale-110 border-2 border-background/20"
          size="icon"
        >
          <div className="relative">
            <img src={creditWiseLogo} alt="CreditWise" className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-background"></div>
          </div>
        </Button>
      )}

      {/* Chatbot Screen */}
      {isOpen && (
        <Card 
          className={`fixed bottom-6 right-6 w-96 shadow-2xl border-0 bg-gradient-to-b from-background to-background/95 backdrop-blur-lg z-50 transition-all duration-300 rounded-2xl overflow-hidden ${
            isMinimized ? 'h-16' : 'h-[32rem]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={creditWiseLogo} alt="CreditWise" className="w-8 h-8" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-primary-foreground"></div>
              </div>
              <div>
                <span className="font-semibold text-sm">{t('chatbot.title')}</span>
                <div className="text-xs opacity-80">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
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
              <ScrollArea className="flex-1 p-4 h-80 bg-gradient-to-b from-background/50 to-muted/30">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        {message.sender === 'bot' && (
                          <div className="flex items-center gap-2 mb-1">
                            <img src={creditWiseLogo} alt="Bot" className="w-5 h-5" />
                            <span className="text-xs text-muted-foreground">CreditWise AI</span>
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl text-sm shadow-md ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground ml-2 rounded-br-md'
                              : 'bg-background/80 text-foreground border border-border/50 mr-2 rounded-bl-md'
                          }`}
                        >
                          {message.text}
                        </div>
                        {message.sender === 'bot' && message.sources && (
                          <div className="text-xs text-muted-foreground mt-1 ml-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Sources available
                          </div>
                        )}
                        <div className={`text-xs text-muted-foreground mt-1 ${
                          message.sender === 'user' ? 'text-right mr-2' : 'ml-2'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="max-w-[85%]">
                        <div className="flex items-center gap-2 mb-1">
                          <img src={creditWiseLogo} alt="Bot" className="w-5 h-5" />
                          <span className="text-xs text-muted-foreground">CreditWise AI</span>
                        </div>
                        <div className="bg-background/80 text-foreground border border-border/50 p-3 rounded-2xl rounded-bl-md text-sm mr-2">
                          <div className="flex items-center gap-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">{t('chatbot.typing')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex gap-3 p-4 bg-background/80 border-t border-border/30">
                <Input
                  placeholder={t('chatbot.placeholder')}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 rounded-full border-border/50 bg-background/50 focus:bg-background transition-colors"
                />
                <Button 
                  onClick={sendMessage}
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                  className="rounded-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
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