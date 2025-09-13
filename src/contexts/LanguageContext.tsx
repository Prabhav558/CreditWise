import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.defaulter': 'Defaulter Search & Tracking',
    'nav.individual': 'Individual Risk Assessment',
    'nav.synthetic': 'Synthetic Data Generator',
    'nav.howItWorks': 'How it Works',
    
    // Footer
    'footer.description': 'Advanced credit risk analysis platform powered by machine learning algorithms.',
    'footer.features': 'Features',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.rights': 'All rights reserved.',
    
    // Chatbot
    'chatbot.welcome': "Hello! I'm your CreditWise assistant. How can I help you with credit risk analysis today?",
    'chatbot.placeholder': 'Type your message...',
    'chatbot.typing': 'Typing...',
    'chatbot.unavailable': 'Chat temporarily unavailable. Please try again.',
    'chatbot.noResponse': "Sorry, I couldn't find that in CreditWise's context.",
    'chatbot.sources': 'Sources available',
    'chatbot.title': 'CreditWise Assistant'
  },
  es: {
    // Navigation
    'nav.defaulter': 'Búsqueda y Seguimiento de Morosos',
    'nav.individual': 'Evaluación Individual de Riesgo',
    'nav.synthetic': 'Generador de Datos Sintéticos',
    'nav.howItWorks': 'Cómo Funciona',
    
    // Footer
    'footer.description': 'Plataforma avanzada de análisis de riesgo crediticio impulsada por algoritmos de aprendizaje automático.',
    'footer.features': 'Características',
    'footer.company': 'Empresa',
    'footer.support': 'Soporte',
    'footer.rights': 'Todos los derechos reservados.',
    
    // Chatbot
    'chatbot.welcome': '¡Hola! Soy tu asistente CreditWise. ¿Cómo puedo ayudarte con el análisis de riesgo crediticio hoy?',
    'chatbot.placeholder': 'Escribe tu mensaje...',
    'chatbot.typing': 'Escribiendo...',
    'chatbot.unavailable': 'Chat temporalmente no disponible. Por favor, inténtalo de nuevo.',
    'chatbot.noResponse': 'Lo siento, no pude encontrar eso en el contexto de CreditWise.',
    'chatbot.sources': 'Fuentes disponibles',
    'chatbot.title': 'Asistente CreditWise'
  },
  fr: {
    // Navigation
    'nav.defaulter': 'Recherche et Suivi des Défaillants',
    'nav.individual': 'Évaluation Individuelle du Risque',
    'nav.synthetic': 'Générateur de Données Synthétiques',
    'nav.howItWorks': 'Comment ça Marche',
    
    // Footer
    'footer.description': 'Plateforme avancée d\'analyse du risque de crédit alimentée par des algorithmes d\'apprentissage automatique.',
    'footer.features': 'Fonctionnalités',
    'footer.company': 'Entreprise',
    'footer.support': 'Support',
    'footer.rights': 'Tous droits réservés.',
    
    // Chatbot
    'chatbot.welcome': 'Bonjour ! Je suis votre assistant CreditWise. Comment puis-je vous aider avec l\'analyse du risque de crédit aujourd\'hui ?',
    'chatbot.placeholder': 'Tapez votre message...',
    'chatbot.typing': 'En train d\'écrire...',
    'chatbot.unavailable': 'Chat temporairement indisponible. Veuillez réessayer.',
    'chatbot.noResponse': 'Désolé, je n\'ai pas pu trouver cela dans le contexte de CreditWise.',
    'chatbot.sources': 'Sources disponibles',
    'chatbot.title': 'Assistant CreditWise'
  },
  de: {
    // Navigation
    'nav.defaulter': 'Zahlungsausfall-Suche & Verfolgung',
    'nav.individual': 'Individuelle Risikobewertung',
    'nav.synthetic': 'Synthetischer Datengenerator',
    'nav.howItWorks': 'Wie es Funktioniert',
    
    // Footer
    'footer.description': 'Erweiterte Kreditrisikoanalyseplattform mit maschinellen Lernalgorithmen.',
    'footer.features': 'Funktionen',
    'footer.company': 'Unternehmen',
    'footer.support': 'Support',
    'footer.rights': 'Alle Rechte vorbehalten.',
    
    // Chatbot
    'chatbot.welcome': 'Hallo! Ich bin Ihr CreditWise-Assistent. Wie kann ich Ihnen heute bei der Kreditrisikoanalyse helfen?',
    'chatbot.placeholder': 'Geben Sie Ihre Nachricht ein...',
    'chatbot.typing': 'Schreibt...',
    'chatbot.unavailable': 'Chat vorübergehend nicht verfügbar. Bitte versuchen Sie es erneut.',
    'chatbot.noResponse': 'Entschuldigung, ich konnte das nicht im CreditWise-Kontext finden.',
    'chatbot.sources': 'Quellen verfügbar',
    'chatbot.title': 'CreditWise-Assistent'
  },
  zh: {
    // Navigation
    'nav.defaulter': '违约者搜索与跟踪',
    'nav.individual': '个人风险评估',
    'nav.synthetic': '合成数据生成器',
    'nav.howItWorks': '工作原理',
    
    // Footer
    'footer.description': '由机器学习算法驱动的先进信用风险分析平台。',
    'footer.features': '功能',
    'footer.company': '公司',
    'footer.support': '支持',
    'footer.rights': '版权所有。',
    
    // Chatbot
    'chatbot.welcome': '您好！我是您的CreditWise助手。今天我可以如何帮助您进行信用风险分析？',
    'chatbot.placeholder': '输入您的消息...',
    'chatbot.typing': '正在输入...',
    'chatbot.unavailable': '聊天暂时不可用。请再试一次。',
    'chatbot.noResponse': '抱歉，我在CreditWise的上下文中找不到相关信息。',
    'chatbot.sources': '可用来源',
    'chatbot.title': 'CreditWise助手'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};