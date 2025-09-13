import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    'nav.defaulterTracking': 'Defaulter Search & Tracking',
    'nav.individualAssessment': 'Individual Risk Assessment',
    'nav.syntheticData': 'Synthetic Data Generator',
    'nav.howItWorks': 'How it Works',
    
    // Chatbot
    'chatbot.title': 'CreditWise Assistant',
    'chatbot.placeholder': 'Type your message...',
    'chatbot.greeting': 'Hello! I\'m your CreditWise assistant. How can I help you with credit risk analysis today?',
    'chatbot.typing': 'Typing...',
    'chatbot.error': 'Chat temporarily unavailable. Please try again.',
    'chatbot.noResponse': 'Sorry, I couldn\'t find that in CreditWise\'s context.',
    
    // Footer
    'footer.creditwise': 'CreditWise',
    'footer.description': 'Advanced AI technology to predict credit risk and probability of default using alternative behavioral signals and real-time data analytics.',
    'footer.contribute': 'Contribute on GitHub',
    'footer.developers': 'Developers',
    'footer.technology': 'About Our Technology',
    'footer.techDescription': 'The system performs automatic credit risk assessment using a pre-trained machine learning model. It loads behavioral data and financial indicators, processes the input variables, predicts default probability, combines risk factors with credit history, and converts the result to a comprehensive risk score.',
    'footer.copyright': '© 2025 CreditWise. All rights reserved.',
  },
  es: {
    // Navigation
    'nav.defaulterTracking': 'Búsqueda y Seguimiento de Morosos',
    'nav.individualAssessment': 'Evaluación de Riesgo Individual',
    'nav.syntheticData': 'Generador de Datos Sintéticos',
    'nav.howItWorks': 'Cómo Funciona',
    
    // Chatbot
    'chatbot.title': 'Asistente CreditWise',
    'chatbot.placeholder': 'Escribe tu mensaje...',
    'chatbot.greeting': '¡Hola! Soy tu asistente de CreditWise. ¿Cómo puedo ayudarte con el análisis de riesgo crediticio hoy?',
    'chatbot.typing': 'Escribiendo...',
    'chatbot.error': 'Chat temporalmente no disponible. Inténtalo de nuevo.',
    'chatbot.noResponse': 'Lo siento, no pude encontrar eso en el contexto de CreditWise.',
    
    // Footer
    'footer.creditwise': 'CreditWise',
    'footer.description': 'Tecnología de IA avanzada para predecir el riesgo crediticio y la probabilidad de incumplimiento utilizando señales de comportamiento alternativas y análisis de datos en tiempo real.',
    'footer.contribute': 'Contribuir en GitHub',
    'footer.developers': 'Desarrolladores',
    'footer.technology': 'Acerca de Nuestra Tecnología',
    'footer.techDescription': 'El sistema realiza una evaluación automática del riesgo crediticio utilizando un modelo de aprendizaje automático pre-entrenado. Carga datos de comportamiento e indicadores financieros, procesa las variables de entrada, predice la probabilidad de incumplimiento, combina factores de riesgo con historial crediticio y convierte el resultado en una puntuación de riesgo integral.',
    'footer.copyright': '© 2025 CreditWise. Todos los derechos reservados.',
  },
  fr: {
    // Navigation
    'nav.defaulterTracking': 'Recherche et Suivi des Défaillants',
    'nav.individualAssessment': 'Évaluation de Risque Individuel',
    'nav.syntheticData': 'Générateur de Données Synthétiques',
    'nav.howItWorks': 'Comment Ça Marche',
    
    // Chatbot
    'chatbot.title': 'Assistant CreditWise',
    'chatbot.placeholder': 'Tapez votre message...',
    'chatbot.greeting': 'Bonjour ! Je suis votre assistant CreditWise. Comment puis-je vous aider avec l\'analyse du risque de crédit aujourd\'hui ?',
    'chatbot.typing': 'En train d\'écrire...',
    'chatbot.error': 'Chat temporairement indisponible. Veuillez réessayer.',
    'chatbot.noResponse': 'Désolé, je n\'ai pas pu trouver cela dans le contexte de CreditWise.',
    
    // Footer
    'footer.creditwise': 'CreditWise',
    'footer.description': 'Technologie IA avancée pour prédire le risque de crédit et la probabilité de défaut en utilisant des signaux comportementaux alternatifs et l\'analyse de données en temps réel.',
    'footer.contribute': 'Contribuer sur GitHub',
    'footer.developers': 'Développeurs',
    'footer.technology': 'À Propos de Notre Technologie',
    'footer.techDescription': 'Le système effectue une évaluation automatique du risque de crédit en utilisant un modèle d\'apprentissage automatique pré-entraîné. Il charge les données comportementales et les indicateurs financiers, traite les variables d\'entrée, prédit la probabilité de défaut, combine les facteurs de risque avec l\'historique de crédit et convertit le résultat en un score de risque complet.',
    'footer.copyright': '© 2025 CreditWise. Tous droits réservés.',
  },
  de: {
    // Navigation
    'nav.defaulterTracking': 'Ausfallsuche & Verfolgung',
    'nav.individualAssessment': 'Individuelle Risikobewertung',
    'nav.syntheticData': 'Synthetischer Datengenerator',
    'nav.howItWorks': 'Wie Es Funktioniert',
    
    // Chatbot
    'chatbot.title': 'CreditWise Assistent',
    'chatbot.placeholder': 'Nachricht eingeben...',
    'chatbot.greeting': 'Hallo! Ich bin Ihr CreditWise-Assistent. Wie kann ich Ihnen heute bei der Kreditrisikoanalyse helfen?',
    'chatbot.typing': 'Schreibt...',
    'chatbot.error': 'Chat vorübergehend nicht verfügbar. Bitte versuchen Sie es erneut.',
    'chatbot.noResponse': 'Entschuldigung, ich konnte das nicht im CreditWise-Kontext finden.',
    
    // Footer
    'footer.creditwise': 'CreditWise',
    'footer.description': 'Fortschrittliche KI-Technologie zur Vorhersage von Kreditrisiken und Ausfallwahrscheinlichkeiten unter Verwendung alternativer Verhaltenssignale und Echtzeit-Datenanalyse.',
    'footer.contribute': 'Auf GitHub beitragen',
    'footer.developers': 'Entwickler',
    'footer.technology': 'Über Unsere Technologie',
    'footer.techDescription': 'Das System führt eine automatische Kreditrisikobewertung mit einem vortrainierten maschinellen Lernmodell durch. Es lädt Verhaltensdaten und Finanzindikatoren, verarbeitet die Eingabevariablen, sagt die Ausfallwahrscheinlichkeit vorher, kombiniert Risikofaktoren mit der Kredithistorie und wandelt das Ergebnis in eine umfassende Risikobewertung um.',
    'footer.copyright': '© 2025 CreditWise. Alle Rechte vorbehalten.',
  },
  zh: {
    // Navigation
    'nav.defaulterTracking': '违约者搜索与跟踪',
    'nav.individualAssessment': '个人风险评估',
    'nav.syntheticData': '合成数据生成器',
    'nav.howItWorks': '工作原理',
    
    // Chatbot
    'chatbot.title': 'CreditWise 助手',
    'chatbot.placeholder': '输入您的消息...',
    'chatbot.greeting': '您好！我是您的CreditWise助手。今天我如何帮助您进行信用风险分析？',
    'chatbot.typing': '正在输入...',
    'chatbot.error': '聊天暂时不可用。请重试。',
    'chatbot.noResponse': '抱歉，我在CreditWise的上下文中找不到这个。',
    
    // Footer
    'footer.creditwise': 'CreditWise',
    'footer.description': '先进的AI技术，使用替代行为信号和实时数据分析来预测信用风险和违约概率。',
    'footer.contribute': '在GitHub上贡献',
    'footer.developers': '开发者',
    'footer.technology': '关于我们的技术',
    'footer.techDescription': '该系统使用预训练的机器学习模型执行自动信用风险评估。它加载行为数据和财务指标，处理输入变量，预测违约概率，将风险因素与信用历史相结合，并将结果转换为综合风险评分。',
    'footer.copyright': '© 2025 CreditWise。保留所有权利。',
  },
  ja: {
    // Navigation
    'nav.defaulterTracking': 'デフォルター検索・追跡',
    'nav.individualAssessment': '個別リスク評価',
    'nav.syntheticData': '合成データジェネレーター',
    'nav.howItWorks': '仕組み',
    
    // Chatbot
    'chatbot.title': 'CreditWise アシスタント',
    'chatbot.placeholder': 'メッセージを入力...',
    'chatbot.greeting': 'こんにちは！私はあなたのCreditWiseアシスタントです。今日は信用リスク分析についてどのようにお手伝いできますか？',
    'chatbot.typing': '入力中...',
    'chatbot.error': 'チャットが一時的に利用できません。再試行してください。',
    'chatbot.noResponse': '申し訳ございませんが、CreditWiseのコンテキストでそれを見つけることができませんでした。',
    
    // Footer
    'footer.creditwise': 'CreditWise',
    'footer.description': '代替行動シグナルとリアルタイムデータ分析を使用して信用リスクとデフォルト確率を予測する高度なAI技術。',
    'footer.contribute': 'GitHubで貢献',
    'footer.developers': '開発者',
    'footer.technology': '私たちの技術について',
    'footer.techDescription': 'システムは事前訓練された機械学習モデルを使用して自動信用リスク評価を実行します。行動データと財務指標を読み込み、入力変数を処理し、デフォルト確率を予測し、リスク要因を信用履歴と組み合わせ、結果を包括的なリスクスコアに変換します。',
    'footer.copyright': '© 2025 CreditWise。全著作権所有。',
  },
  hi: {
    // Navigation
    'nav.defaulterTracking': 'डिफॉल्टर खोज और ट्रैकिंग',
    'nav.individualAssessment': 'व्यक्तिगत जोखिम मूल्यांकन',
    'nav.syntheticData': 'सिंथेटिक डेटा जेनरेटर',
    'nav.howItWorks': 'यह कैसे काम करता है',
    
    // Chatbot
    'chatbot.title': 'CreditWise सहायक',
    'chatbot.placeholder': 'अपना संदेश टाइप करें...',
    'chatbot.greeting': 'नमस्ते! मैं आपका CreditWise सहायक हूं। आज क्रेडिट जोखिम विश्लेषण में मैं आपकी कैसे सहायता कर सकता हूं?',
    'chatbot.typing': 'टाइप कर रहा है...',
    'chatbot.error': 'चैट अस्थायी रूप से अनुपलब्ध है। कृपया पुनः प्रयास करें।',
    'chatbot.noResponse': 'क्षमा करें, मुझे CreditWise के संदर्भ में वह नहीं मिला।',
    
    // Footer
    'footer.creditwise': 'CreditWise',
    'footer.description': 'वैकल्पिक व्यवहारिक संकेतों और रीयल-टाइम डेटा विश्लेषण का उपयोग करके क्रेडिट जोखिम और डिफॉल्ट संभावना की भविष्यवाणी करने के लिए उन्नत AI तकनीक।',
    'footer.contribute': 'GitHub पर योगदान दें',
    'footer.developers': 'डेवलपर्स',
    'footer.technology': 'हमारी तकनीक के बारे में',
    'footer.techDescription': 'सिस्टम एक पूर्व-प्रशिक्षित मशीन लर्निंग मॉडल का उपयोग करके स्वचालित क्रेडिट जोखिम मूल्यांकन करता है। यह व्यवहारिक डेटा और वित्तीय संकेतकों को लोड करता है, इनपुट चर को संसाधित करता है, डिफॉल्ट संभावना की भविष्यवाणी करता है, जोखिम कारकों को क्रेडिट इतिहास के साथ जोड़ता है, और परिणाम को एक व्यापक जोखिम स्कोर में परिवर्तित करता है।',
    'footer.copyright': '© 2025 CreditWise। सभी अधिकार सुरक्षित।',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
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