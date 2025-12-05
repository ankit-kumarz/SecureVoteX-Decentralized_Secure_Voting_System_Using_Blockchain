import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      "welcome": "Welcome",
      "login": "Login",
      "logout": "Logout",
      "register": "Register",
      "email": "Email Address",
      "password": "Password",
      "submit": "Submit",
      "cancel": "Cancel",
      "delete": "Delete",
      "create": "Create",
      "update": "Update",
      "save": "Save",
      "loading": "Loading...",
      "logout": "Logout",
      
      // Navigation
      "voterDashboard": "Voter Dashboard",
      "adminDashboard": "Admin Dashboard",
      "adminControlCenter": "Admin Control Center",
      "manageElectionsMonitor": "Manage elections, candidates & monitor voting",
      "activeElections": "Active Elections",
      "myVotes": "My Votes",
      "results": "Results",
      "transparency": "Transparency",
      "analytics": "Analytics",
      
      // Login/Register
      "welcomeBack": "Welcome Back",
      "signInMessage": "Sign in to access your voting dashboard",
      "email": "Email Address",
      "password": "Password",
      "signIn": "Sign In",
      "dontHaveAccount": "Don't have an account?",
      "registerNow": "Register Now",
      "createAccount": "Create Your Account",
      "joinMessage": "Join the decentralized voting revolution",
      "alreadyHaveAccount": "Already have an account?",
      "signInHere": "Sign In Here",
      "enterEmail": "Enter your email",
      "createPassword": "Create a password",
      "register": "Create Account",
      "walletOptional": "Blockchain Wallet (Optional)",
      "connectWallet": "Connect MetaMask Wallet",
      "voterId": "Voter ID",
      "role": "Role",
      "voter": "Voter",
      "admin": "Admin",
      
      // Elections
      "electionTitle": "Election Title",
      "description": "Description",
      "startDate": "Start Date",
      "endDate": "End Date",
      "createElection": "Create Election",
      "noActiveElections": "No active elections at the moment",
      "voteNow": "Vote Now",
      "voteSecurely": "Vote Securely",
      "castVote": "Cast Vote",
      "castEncryptedVote": "Cast Encrypted Vote",
      "encryptingVote": "Encrypting & Submitting Vote...",
      
      // Candidates
      "candidates": "Candidates",
      "candidateName": "Candidate Name",
      "party": "Party",
      "manifesto": "Manifesto",
      "addCandidate": "Add Candidate",
      "selectCandidate": "Select Your Candidate",
      
      // Voting
      "e2eEncrypted": "End-to-End Encrypted Voting",
      "voteReceipt": "Vote Receipt",
      "receiptHash": "Receipt Hash",
      "verifyReceipt": "Verify Receipt",
      "scanQR": "Scan QR Code",
      "saveReceipt": "Save this receipt to verify your vote later",
      "copyHash": "Copy Hash",
      "viewOnBlockchain": "View on Blockchain",
      
      // Verification
      "receiptVerification": "Receipt Verification",
      "verifyMessage": "Enter your receipt hash to verify that your vote was recorded correctly on the blockchain.",
      "enterReceiptHash": "Enter 64-character hash from your receipt",
      "verifying": "Verifying...",
      "receiptVerified": "Receipt Verified!",
      "voteTime": "Vote Time",
      "election": "Election",
      
      // Transparency
      "transparencyDashboard": "Transparency Dashboard",
      "publicVerification": "Public blockchain verification & election transparency",
      "howItWorks": "How It Works",
      "step1Title": "Cast Vote",
      "step1Desc": "Your vote is encrypted end-to-end before submission",
      "step2Title": "Get Receipt",
      "step2Desc": "Receive cryptographic receipt with QR code",
      "step3Title": "Verify",
      "step3Desc": "Scan QR code or enter hash to verify on blockchain",
      "blockchainNetwork": "Blockchain Network",
      "network": "Network",
      "contractAddress": "Contract Address",
      "encryption": "Encryption",
      "explorer": "Explorer",
      "scanVoteReceipt": "Scan Vote Receipt",
      "scanMessage": "Use your device camera to scan the QR code from your vote receipt for instant verification.",
      "startScanning": "Start Scanning",
      "stopScanning": "Stop Scanning",
      "scanning": "Scanning for QR codes...",
      
      // Analytics
      "analyticsDashboard": "Analytics Dashboard",
      "loadingAnalytics": "Loading analytics...",
      "backToDashboard": "Back to Dashboard",
      "electionAnalytics": "Election Analytics",
      "electionId": "Election ID",
      "statistics": "Statistics",
      "activity": "Activity Monitor",
      "blockchain": "Blockchain",
      "totalVotes": "Total Votes",
      "turnoutRate": "Turnout Rate",
      "eligibleVoters": "Eligible Voters",
      "encryptedVotes": "Encrypted Votes",
      "votesByCandidate": "Votes by Candidate",
      "voterTurnout": "Voter Turnout",
      "votingActivity": "Voting Activity Trend",
      "recentActivity": "Recent Activity",
      "suspiciousActivities": "Suspicious Activities Detected",
      "totalTransactions": "Total Transactions",
      "confirmed": "Confirmed",
      "pending": "Pending",
      "gasUsed": "Gas Used",
      
      // Settings
      "language": "Language",
      "darkMode": "Dark Mode",
      "lightMode": "Light Mode",
      "preferences": "Preferences",
      
      // Messages
      "loginSuccess": "Login successful",
      "loginFailed": "Login failed",
      "registerSuccess": "Registration successful",
      "voteCastSuccess": "Vote cast successfully!",
      "verificationSuccess": "Verification successful",
      "verificationFailed": "Verification failed",
      "errorOccurred": "An error occurred",
      
      // Admin
      "electionManagement": "Election Management",
      "candidateManagement": "Candidate Management",
      "viewAnalytics": "View Analytics",
      "transactionLogs": "Transaction Logs",
      
      // Footer
      "poweredBy": "Powered by Blockchain Technology",
      "secureVoting": "Secure & Transparent Voting",
      
      // Biometric
      "biometricAuth": "Biometric Authentication",
      "faceVerification": "Face Verification",
      "scanFace": "Scan Your Face",
      "biometricSuccess": "Biometric verification successful",
      "biometricFailed": "Biometric verification failed",
      
      // Homepage
      "trustedByWeb3": "Trusted by Web3 Community",
      "poweredByEthereum": "Powered by Ethereum Sepolia Testnet",
      "governmentGradeSecurity": "Government-Grade Security",
      "secureVoteX": "SecureVoteX",
      "indiaNextGenVoting": "India's Next-Generation Blockchain Voting Platform",
      "secureTransparentAI": "A secure, transparent, and AI-powered digital voting infrastructure built for the future of democratic governance.",
      "loginAsVoter": "Login as Voter",
      "loginAsAdmin": "Login as Admin",
      "explorePlatform": "Explore Platform",
      "blockchain": "Blockchain",
      "immutableTransparent": "Immutable & Transparent",
      "everyVoteRecorded": "Every vote is recorded on the Ethereum blockchain, ensuring complete transparency and tamper-proof integrity.",
      "aiPowered": "AI-Powered",
      "biometricVerification": "Biometric Verification",
      "facialRecognition": "Facial recognition and liveness detection prevent fraud and ensure one person, one vote.",
      "e2eEncryption": "E2E Encryption",
      "zeroKnowledge": "Zero-Knowledge Proofs",
      "votesEncrypted": "Votes are encrypted end-to-end. Even administrators cannot see individual votes, ensuring complete privacy.",
      "zkProofs": "ZK Proofs",
      "cryptographicGuarantees": "Cryptographic Guarantees",
      "zkSNARKs": "zk-SNARKs allow voters to prove they voted without revealing their choice, maintaining ballot secrecy."
    }
  },
  hi: {
    translation: {
      // Common
      "welcome": "स्वागत है",
      "login": "लॉगिन",
      "logout": "लॉगआउट",
      "register": "पंजीकरण",
      "email": "ईमेल पता",
      "password": "पासवर्ड",
      "submit": "जमा करें",
      "cancel": "रद्द करें",
      "delete": "हटाएं",
      "create": "बनाएं",
      "update": "अपडेट करें",
      "save": "सहेजें",
      "loading": "लोड हो रहा है...",
      "logout": "लॉगआउट",
      
      // Navigation
      "voterDashboard": "मतदाता डैशबोर्ड",
      "adminDashboard": "व्यवस्थापक डैशबोर्ड",
      "adminControlCenter": "व्यवस्थापक नियंत्रण केंद्र",
      "manageElectionsMonitor": "चुनाव, उम्मीदवार प्रबंधित करें और मतदान की निगरानी करें",
      "activeElections": "सक्रिय चुनाव",
      "myVotes": "मेरे वोट",
      "results": "परिणाम",
      "transparency": "पारदर्शिता",
      "analytics": "विश्लेषण",
      
      // Login/Register
      "welcomeBack": "वापसी पर स्वागत है",
      "signInMessage": "अपने मतदान डैशबोर्ड तक पहुंचने के लिए साइन इन करें",
      "email": "ईमेल पता",
      "password": "पासवर्ड",
      "signIn": "साइन इन करें",
      "dontHaveAccount": "खाता नहीं है?",
      "registerNow": "अभी पंजीकरण करें",
      "createAccount": "अपना खाता बनाएं",
      "joinMessage": "विकेंद्रीकृत मतदान क्रांति में शामिल हों",
      "alreadyHaveAccount": "पहले से खाता है?",
      "signInHere": "यहाँ साइन इन करें",
      "enterEmail": "अपना ईमेल दर्ज करें",
      "createPassword": "पासवर्ड बनाएं",
      "register": "खाता बनाएं",
      "walletOptional": "ब्लॉकचेन वॉलेट (वैकल्पिक)",
      "connectWallet": "मेटामास्क वॉलेट कनेक्ट करें",
      "voterId": "मतदाता आईडी",
      "role": "भूमिका",
      "voter": "मतदाता",
      "admin": "व्यवस्थापक",
      
      // Elections
      "electionTitle": "चुनाव शीर्षक",
      "description": "विवरण",
      "startDate": "आरंभ तिथि",
      "endDate": "समाप्ति तिथि",
      "createElection": "चुनाव बनाएं",
      "noActiveElections": "इस समय कोई सक्रिय चुनाव नहीं",
      "voteNow": "अभी वोट करें",
      "voteSecurely": "सुरक्षित वोट करें",
      "castVote": "वोट डालें",
      "castEncryptedVote": "एन्क्रिप्टेड वोट डालें",
      "encryptingVote": "वोट एन्क्रिप्ट और सबमिट हो रहा है...",
      
      // Candidates
      "candidates": "उम्मीदवार",
      "candidateName": "उम्मीदवार का नाम",
      "party": "पार्टी",
      "manifesto": "घोषणापत्र",
      "addCandidate": "उम्मीदवार जोड़ें",
      "selectCandidate": "अपना उम्मीदवार चुनें",
      
      // Voting
      "e2eEncrypted": "एंड-टू-एंड एन्क्रिप्टेड वोटिंग",
      "voteReceipt": "वोट रसीद",
      "receiptHash": "रसीद हैश",
      "verifyReceipt": "रसीद सत्यापित करें",
      "scanQR": "QR कोड स्कैन करें",
      "saveReceipt": "बाद में अपने वोट को सत्यापित करने के लिए इस रसीद को सहेजें",
      "copyHash": "हैश कॉपी करें",
      "viewOnBlockchain": "ब्लॉकचेन पर देखें",
      
      // Verification
      "receiptVerification": "रसीद सत्यापन",
      "verifyMessage": "यह सत्यापित करने के लिए अपना रसीद हैश दर्ज करें कि आपका वोट ब्लॉकचेन पर सही ढंग से दर्ज किया गया था।",
      "enterReceiptHash": "अपनी रसीद से 64-अक्षर का हैश दर्ज करें",
      "verifying": "सत्यापन हो रहा है...",
      "receiptVerified": "रसीद सत्यापित!",
      "voteTime": "वोट समय",
      "election": "चुनाव",
      
      // Transparency
      "transparencyDashboard": "पारदर्शिता डैशबोर्ड",
      "publicVerification": "सार्वजनिक ब्लॉकचेन सत्यापन और चुनाव पारदर्शिता",
      "howItWorks": "यह कैसे काम करता है",
      "step1Title": "वोट डालें",
      "step1Desc": "सबमिट करने से पहले आपका वोट एंड-टू-एंड एन्क्रिप्ट किया जाता है",
      "step2Title": "रसीद प्राप्त करें",
      "step2Desc": "QR कोड के साथ क्रिप्टोग्राफिक रसीद प्राप्त करें",
      "step3Title": "सत्यापित करें",
      "step3Desc": "ब्लॉकचेन पर सत्यापित करने के लिए QR कोड स्कैन करें या हैश दर्ज करें",
      "blockchainNetwork": "ब्लॉकचेन नेटवर्क",
      "network": "नेटवर्क",
      "contractAddress": "कॉन्ट्रैक्ट पता",
      "encryption": "एन्क्रिप्शन",
      "explorer": "एक्सप्लोरर",
      "scanVoteReceipt": "वोट रसीद स्कैन करें",
      "scanMessage": "त्वरित सत्यापन के लिए अपनी वोट रसीद से QR कोड स्कैन करने के लिए अपने डिवाइस कैमरे का उपयोग करें।",
      "startScanning": "स्कैनिंग शुरू करें",
      "stopScanning": "स्कैनिंग बंद करें",
      "scanning": "QR कोड के लिए स्कैन कर रहा है...",
      
      // Analytics
      "analyticsDashboard": "विश्लेषण डैशबोर्ड",
      "loadingAnalytics": "विश्लेषण लोड हो रहा है...",
      "backToDashboard": "डैशबोर्ड पर वापस जाएं",
      "electionAnalytics": "चुनाव विश्लेषण",
      "electionId": "चुनाव आईडी",
      "statistics": "आंकड़े",
      "activity": "गतिविधि मॉनिटर",
      "blockchain": "ब्लॉकचेन",
      "totalVotes": "कुल वोट",
      "turnoutRate": "मतदान दर",
      "eligibleVoters": "पात्र मतदाता",
      "encryptedVotes": "एन्क्रिप्टेड वोट",
      "votesByCandidate": "उम्मीदवार द्वारा वोट",
      "voterTurnout": "मतदाता मतदान",
      "votingActivity": "मतदान गतिविधि रुझान",
      "recentActivity": "हाल की गतिविधि",
      "suspiciousActivities": "संदिग्ध गतिविधियां पाई गईं",
      "totalTransactions": "कुल लेनदेन",
      "confirmed": "पुष्टि की गई",
      "pending": "लंबित",
      "gasUsed": "गैस का उपयोग",
      
      // Settings
      "language": "भाषा",
      "darkMode": "डार्क मोड",
      "lightMode": "लाइट मोड",
      "preferences": "प्राथमिकताएं",
      
      // Messages
      "loginSuccess": "लॉगिन सफल",
      "loginFailed": "लॉगिन विफल",
      "registerSuccess": "पंजीकरण सफल",
      "voteCastSuccess": "वोट सफलतापूर्वक डाला गया!",
      "verificationSuccess": "सत्यापन सफल",
      "verificationFailed": "सत्यापन विफल",
      "errorOccurred": "एक त्रुटि हुई",
      
      // Admin
      "electionManagement": "चुनाव प्रबंधन",
      "candidateManagement": "उम्मीदवार प्रबंधन",
      "viewAnalytics": "विश्लेषण देखें",
      "transactionLogs": "लेनदेन लॉग",
      
      // Footer
      "poweredBy": "ब्लॉकचेन प्रौद्योगिकी द्वारा संचालित",
      "secureVoting": "सुरक्षित और पारदर्शी मतदान",
      
      // Biometric
      "biometricAuth": "बायोमेट्रिक प्रमाणीकरण",
      "faceVerification": "चेहरा सत्यापन",
      "scanFace": "अपना चेहरा स्कैन करें",
      "biometricSuccess": "बायोमेट्रिक सत्यापन सफल",
      "biometricFailed": "बायोमेट्रिक सत्यापन विफल",
      
      // Homepage
      "trustedByWeb3": "Web3 समुदाय द्वारा विश्वसनीय",
      "poweredByEthereum": "Ethereum Sepolia Testnet द्वारा संचालित",
      "governmentGradeSecurity": "सरकारी-स्तरीय सुरक्षा",
      "secureVoteX": "SecureVoteX",
      "indiaNextGenVoting": "भारत का अगली पीढ़ी का ब्लॉकचेन मतदान मंच",
      "secureTransparentAI": "लोकतांत्रिक शासन के भविष्य के लिए बनाई गई एक सुरक्षित, पारदर्शी और AI-संचालित डिजिटल मतदान अवसंरचना।",
      "loginAsVoter": "मतदाता के रूप में लॉगिन",
      "loginAsAdmin": "व्यवस्थापक के रूप में लॉगिन",
      "explorePlatform": "मंच का अन्वेषण करें",
      "blockchain": "ब्लॉकचेन",
      "immutableTransparent": "अपरिवर्तनीय और पारदर्शी",
      "everyVoteRecorded": "प्रत्येक वोट Ethereum ब्लॉकचेन पर दर्ज किया जाता है, जो पूर्ण पारदर्शिता और छेड़छाड़-रोधी अखंडता सुनिश्चित करता है।",
      "aiPowered": "AI-संचालित",
      "biometricVerification": "बायोमेट्रिक सत्यापन",
      "facialRecognition": "चेहरे की पहचान और जीवंतता पहचान धोखाधड़ी को रोकती है और एक व्यक्ति, एक वोट सुनिश्चित करती है।",
      "e2eEncryption": "E2E एन्क्रिप्शन",
      "zeroKnowledge": "शून्य-ज्ञान प्रमाण",
      "votesEncrypted": "वोट एंड-टू-एंड एन्क्रिप्टेड हैं। व्यवस्थापक भी व्यक्तिगत वोट नहीं देख सकते, पूर्ण गोपनीयता सुनिश्चित करते हैं।",
      "zkProofs": "ZK प्रमाण",
      "cryptographicGuarantees": "क्रिप्टोग्राफिक गारंटी",
      "zkSNARKs": "zk-SNARKs मतदाताओं को अपनी पसंद प्रकट किए बिना मतदान साबित करने की अनुमति देता है, मतपत्र गोपनीयता बनाए रखता है।"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
