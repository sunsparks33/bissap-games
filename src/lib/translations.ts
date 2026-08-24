export type Language = 'en' | 'fr' | 'ar';

export const translations = {
  en: {
    // Header & Nav
    navBrandSubtitle: 'MOROCCO NATIONAL TOUR',
    navLeaderboard: 'Leaderboard',
    navManagerPanel: 'Manager Panel',
    navRegister: 'Register Squad',

    // Hero Section
    announcementBadge: 'Morocco National Tour • Casablanca • Marrakech • Tangier • Agadir • Rabat',
    heroTitlePart1: 'Compete for the Fittest',
    heroTitlePart2: 'Team in Morocco',
    heroSubtitle: 'The ultimate multi-city athletic challenge testing endurance, speed, and raw power across 5 iconic Moroccan arenas.',
    btnRegisterSquad: 'Register Your Squad',
    btnViewLeaderboard: 'View Live Standings',

    // Tour Stats
    statCities: 'Host Cities',
    statCitiesDesc: 'Casablanca, Marrakech, Tangier, Agadir & Rabat',
    statTeams: 'Registered Teams',
    statTeamsDesc: '4 Athletes per Squad',
    statPrizePool: 'Prize Pool',
    statPrizePoolDesc: 'National Championship Trophy',
    statDisciplines: 'Disciplines',
    statDisciplinesDesc: 'Relay, Strength & Ocean Dune Pull',

    // Challenges Section
    challengesTitle: 'Tour Disciplines & Challenges',
    challengesSubtitle: 'High-intensity workouts designed to push every athlete to their absolute limit.',

    // Registration Modal / Form
    regTitle: 'Register Your Squad',
    regSubtitle: 'Complete the 3-step registration form to secure your spot in the Morocco National Tour.',
    step1Title: 'Team Details',
    step2Title: 'Captain Info',
    step3Title: 'Roster Members',
    labelTeamName: 'Team Name *',
    labelCategory: 'Category *',
    labelCaptainName: 'Captain Full Name *',
    labelCaptainEmail: 'Captain Email *',
    labelCaptainPhone: 'Captain Phone *',
    btnNext: 'Next Step',
    btnBack: 'Previous',
    btnSubmitRegistration: 'Submit Squad Registration',

    // Leaderboard Section
    leaderboardTitle: 'National Leaderboard',
    leaderboardSubtitle: 'Real-time standings tracking squad performance across Casablanca, Marrakech, Tangier, Agadir, and Rabat.',
    searchPlaceholder: 'Search team, captain, or city...',
    sortLabel: 'Sort:',
    sortPoints: 'Points',
    sortRoster: 'Roster Size',
    btnRefreshLive: 'Refresh Live',
    syncingDb: 'Syncing DB...',

    // Leaderboard Table
    colRank: 'Rank',
    colTeam: 'Team Squad',
    colCaptain: 'Captain',
    colMembers: 'Roster',
    colPoints: 'Total Points',
    viewRoster: 'View Roster',

    // Manager Panel
    managerHeaderTitle: 'Manager Control Center',
    managerHeaderSubtitle: 'Register teams, captains, athletes, schedule multi-city events, and record live scoring.',
    managerPasscodeTitle: 'Manager Authentication',
    managerPasscodeDesc: 'Enter your admin security passcode to access score control panel.',
    managerPasscodePlaceholder: 'Enter admin security passcode',
    btnUnlock: 'Unlock Admin Panel',

    // Manager Tabs
    tabOverview: 'Dashboard Overview',
    tabTeams: 'Teams',
    tabCaptains: 'Captains',
    tabAthletes: 'Athletes',
    tabEvents: 'Events',
    tabScores: 'Score & Standings',

    // Footer
    footerDesc: 'Ain Diab Relays & Strength Arena — Official Moroccan National Fitness Championship.',
    footerRights: 'All rights reserved.',
  },

  fr: {
    // Header & Nav
    navBrandSubtitle: 'TOUR NATIONAL DU MAROC',
    navLeaderboard: 'Classement',
    navManagerPanel: 'Espace Gestion',
    navRegister: 'Inscrire une Équipe',

    // Hero Section
    announcementBadge: 'Tour National du Maroc • Casablanca • Marrakech • Tanger • Agadir • Rabat',
    heroTitlePart1: 'Affrontez les Meilleures',
    heroTitlePart2: 'Équipes du Maroc',
    heroSubtitle: 'Le défi athlétique ultime à travers 5 villes iconiques marocaines testant endurance, vitesse et force brute.',
    btnRegisterSquad: 'Inscrire Votre Équipe',
    btnViewLeaderboard: 'Voir le Classement Direct',

    // Tour Stats
    statCities: 'Villes Hôtes',
    statCitiesDesc: 'Casablanca, Marrakech, Tanger, Agadir & Rabat',
    statTeams: 'Équipes Inscrites',
    statTeamsDesc: '4 Athlètes par Équipe',
    statPrizePool: 'Cagraphe de Prix',
    statPrizePoolDesc: 'Trophée du Championnat National',
    statDisciplines: 'Disciplines',
    statDisciplinesDesc: 'Relais, Force & Tirage de Dunes',

    // Challenges Section
    challengesTitle: 'Disciplines & Épreuves du Tour',
    challengesSubtitle: 'Épreuves haute intensité conçues pour pousser chaque athlète à sa limite absolue.',

    // Registration Modal / Form
    regTitle: 'Inscrire Votre Équipe',
    regSubtitle: 'Remplissez le formulaire en 3 étapes pour garantir votre place dans le Tour National du Maroc.',
    step1Title: 'Détails de l\'Équipe',
    step2Title: 'Infos Capitaine',
    step3Title: 'Membres de l\'Équipe',
    labelTeamName: 'Nom de l\'Équipe *',
    labelCategory: 'Catégorie *',
    labelCaptainName: 'Nom Complet du Capitaine *',
    labelCaptainEmail: 'Email du Capitaine *',
    labelCaptainPhone: 'Téléphone du Capitaine *',
    btnNext: 'Étape Suivante',
    btnBack: 'Précédent',
    btnSubmitRegistration: 'Valider l\'Inscription',

    // Leaderboard Section
    leaderboardTitle: 'Classement National',
    leaderboardSubtitle: 'Suivi en direct des performances à Casablanca, Marrakech, Tanger, Agadir et Rabat.',
    searchPlaceholder: 'Rechercher une équipe, un capitaine ou une ville...',
    sortLabel: 'Trier par:',
    sortPoints: 'Points',
    sortRoster: 'Effectif',
    btnRefreshLive: 'Actualiser en Direct',
    syncingDb: 'Synchro BDD...',

    // Leaderboard Table
    colRank: 'Rang',
    colTeam: 'Équipe',
    colCaptain: 'Capitaine',
    colMembers: 'Effectif',
    colPoints: 'Total Points',
    viewRoster: 'Voir Effectif',

    // Manager Panel
    managerHeaderTitle: 'Centre de Contrôle Gestion',
    managerHeaderSubtitle: 'Gérez les équipes, capitaines, athlètes, épreuves et la saisie des scores en direct.',
    managerPasscodeTitle: 'Authentification Gestionnaire',
    managerPasscodeDesc: 'Entrez votre code de sécurité administrateur pour accéder au panneau.',
    managerPasscodePlaceholder: 'Entrez le code de sécurité',
    btnUnlock: 'Déverrouiller le Panneau',

    // Manager Tabs
    tabOverview: 'Vue d\'Ensemble',
    tabTeams: 'Équipes',
    tabCaptains: 'Capitaines',
    tabAthletes: 'Athlètes',
    tabEvents: 'Épreuves',
    tabScores: 'Scores & Classements',

    // Footer
    footerDesc: 'Ain Diab Relais & Arène de Force — Championnat National Officiel de Fitness du Maroc.',
    footerRights: 'Tous droits réservés.',
  },

  ar: {
    // Header & Nav
    navBrandSubtitle: 'الجولة الوطنية بالمغرب',
    navLeaderboard: 'الترتيب العام',
    navManagerPanel: 'لوحة التحكم',
    navRegister: 'تسجيل الفريق',

    // Hero Section
    announcementBadge: 'الجولة الوطنية بالمغرب • الدار البيضاء • مراكش • طنجة • أكادير • الرباط',
    heroTitlePart1: 'تنافس على لقب أقوى',
    heroTitlePart2: 'فريق في المغرب',
    heroSubtitle: 'التحدي الرياضي الأقوى في 5 مدن مغربية لاختبار التحمل والسرعة والقوة البدنية.',
    btnRegisterSquad: 'سجل فريقك الآن',
    btnViewLeaderboard: 'عرض الترتيب المباشر',

    // Tour Stats
    statCities: 'المدن المستضيفة',
    statCitiesDesc: 'الدار البيضاء، مراكش، طنجة، أكادير والرباط',
    statTeams: 'الفرق المسجلة',
    statTeamsDesc: '4 رياضيين لكل فريق',
    statPrizePool: 'الجوائز',
    statPrizePoolDesc: 'كأس البطولة الوطنية',
    statDisciplines: 'التخصصات',
    statDisciplinesDesc: 'التناوب، القوة وسحب الكثبان الرملية',

    // Challenges Section
    challengesTitle: 'تحديات وسباقات الجولة',
    challengesSubtitle: 'تمارين عالية الشدة مصممة لدفع كل رياضي إلى أقصى حدوده.',

    // Registration Modal / Form
    regTitle: 'تسجيل فريقك',
    regSubtitle: 'أكمل استمارة التسجيل في 3 خطوات لحجز مكانك في الجولة الوطنية بالمغرب.',
    step1Title: 'تفاصيل الفريق',
    step2Title: 'معلومات القائد',
    step3Title: 'أعضاء الفريق',
    labelTeamName: 'اسم الفريق *',
    labelCategory: 'الفئة *',
    labelCaptainName: 'الاسم الكامل للقائد *',
    labelCaptainEmail: 'البريد الإلكتروني للقائد *',
    labelCaptainPhone: 'رقم هاتف القائد *',
    btnNext: 'الخطوة التالية',
    btnBack: 'السابق',
    btnSubmitRegistration: 'تأكيد التسجيل',

    // Leaderboard Section
    leaderboardTitle: 'الترتيب الوطني العام',
    leaderboardSubtitle: 'متابعة مباشرة لأداء الفرق في الدار البيضاء، مراكش، طنجة، أكادير والرباط.',
    searchPlaceholder: 'البحث عن فريق، قائد، أو مدينة...',
    sortLabel: 'ترتيب حسب:',
    sortPoints: 'النقاط',
    sortRoster: 'عدد الأعضاء',
    btnRefreshLive: 'تحديث مباشر',
    syncingDb: 'جاري المزامنة...',

    // Leaderboard Table
    colRank: 'الرتبة',
    colTeam: 'الفريق',
    colCaptain: 'القائد',
    colMembers: 'الأعضاء',
    colPoints: 'مجموع النقاط',
    viewRoster: 'عرض الأعضاء',

    // Manager Panel
    managerHeaderTitle: 'مركز الإدارة والتحكم',
    managerHeaderSubtitle: 'إدارة الفرق، القادة، الرياضيين، السباقات وتسجيل النقاط المباشرة.',
    managerPasscodeTitle: 'مصادقة المدير',
    managerPasscodeDesc: 'أدخل رمز الأمان الإداري للوصول إلى لوحة التحكم.',
    managerPasscodePlaceholder: 'أدخل رمز الأمان',
    btnUnlock: 'فتح لوحة التحكم',

    // Manager Tabs
    tabOverview: 'نظرة عامة',
    tabTeams: 'الفرق',
    tabCaptains: 'القادة',
    tabAthletes: 'الرياضيون',
    tabEvents: 'السباقات',
    tabScores: 'النقاط والترتيب',

    // Footer
    footerDesc: 'عين الذئاب للتناوب والقوة — البطولة الوطنية المغربية الرسمية للياقة البدنية.',
    footerRights: 'جميع الحقوق محفوظة.',
  },
};
