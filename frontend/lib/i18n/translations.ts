// ===================================================================
// Sanne DZ — Dictionnaire de traductions FR / AR
// ===================================================================

export type Lang = 'fr' | 'ar'

export const translations = {
  // ===== GÉNÉRAL =====
  common: {
    appName: {
      fr: 'Sanne Textile DZ',
      ar: 'صنع النسيج DZ',
    },
    search: {
      fr: 'Rechercher',
      ar: 'بحث',
    },
    searchPlaceholder: {
      fr: 'Couture, Ateliers de couture, Studio...',
      ar: 'خياطة، ورشات خياطة، استوديو...',
    },
    searchMobilePlaceholder: {
      fr: 'Rechercher...',
      ar: 'ابحث...',
    },
    allWilayas: {
      fr: 'Toutes les wilayas',
      ar: 'كل الولايات',
    },
    allCategories: {
      fr: 'Toutes catégories',
      ar: 'كل الفئات',
    },
    seeAll: {
      fr: 'Voir tout',
      ar: 'رؤية الكل',
    },
    allCategories2: {
      fr: 'Toutes les catégories',
      ar: 'جميع الفئات',
    },
    allWilayas2: {
      fr: 'Toutes les wilayas',
      ar: 'جميع الولايات',
    },
    popular: {
      fr: 'Populaire :',
      ar: 'الأكثر بحثاً :',
    },
    pros: {
      fr: 'pros',
      ar: 'متخصص',
    },
    moreWilayas: {
      fr: '57 autres wilayas',
      ar: '57 ولاية أخرى',
    },
  },

  // ===== NAVBAR =====
  nav: {
    categories: {
      fr: 'Catégories',
      ar: 'الفئات',
    },
    search: {
      fr: 'Recherche',
      ar: 'بحث',
    },
    about: {
      fr: 'À propos',
      ar: 'من نحن',
    },
    contact: {
      fr: 'Contact',
      ar: 'اتصل بنا',
    },
    login: {
      fr: 'Connexion',
      ar: 'تسجيل الدخول',
    },
    registerBusiness: {
      fr: 'Inscrire mon business',
      ar: 'سجّل عملك',
    },
    myDashboard: {
      fr: 'Mon Dashboard',
      ar: 'لوحتي',
    },
    myProfile: {
      fr: 'Mon Profil',
      ar: 'ملفي الشخصي',
    },
    logout: {
      fr: 'Déconnexion',
      ar: 'تسجيل الخروج',
    },
    dashboard: {
      fr: 'Dashboard',
      ar: 'لوحة التحكم',
    },
  },

  // ===== HERO =====
  hero: {
    badge: {
      fr: 'La marketplace algérienne de référence',
      ar: 'منصة السوق الجزائرية الرائدة',
    },
    title1: {
      fr: 'اعثر على أفضل',
      ar: 'اعثر على أفضل',
    },
    titleMain: {
      fr: 'Trouvez les meilleurs',
      ar: 'اعثر على أفضل',
    },
    titlePro: {
      fr: 'professionnels',
      ar: 'المتخصصين',
    },
    titleEnd: {
      fr: 'près de chez vous',
      ar: 'بالقرب منك',
    },
    subtitle: {
      fr: "Ateliers de couture, Merceries, Tissus et plus — dans toutes les 69 wilayas d'Algérie.",
      ar: 'ورشات الخياطة، البزازة، الأقمشة والمزيد — في جميع ولايات الجزائر الـ 69.',
    },
    stats: {
      partners: {
        fr: 'Partenaires actifs',
        ar: 'شريك نشط',
      },
      wilayas: {
        fr: 'Wilayas couvertes',
        ar: 'ولاية مغطاة',
      },
      clients: {
        fr: 'Clients inscrits',
        ar: 'عميل مسجل',
      },
      proPct: {
        fr: 'Partenaires Pro',
        ar: 'شركاء Pro',
      },
    },
  },

  // ===== CATEGORIES GRID =====
  categories: {
    title: {
      fr: 'Explorer par catégorie',
      ar: 'استكشف حسب الفئة',
    },
    subtitle: {
      fr: 'Tous les secteurs en un seul endroit',
      ar: 'جميع القطاعات في مكان واحد',
    },
    items: {
      'ateliers-couture': { fr: 'Ateliers de couture', ar: 'ورشات الخياطة' },
      'modelistes': { fr: 'Modélistes', ar: 'المصمِّمون' },
      'patronistes': { fr: 'Patronistes', ar: 'صانعو الباترونات' },
      'magasins-tissus': { fr: 'Magasins de tissus', ar: 'متاجر الأقمشة' },
      'merceries': { fr: 'Merceries', ar: 'البزازة' },
      'services-broderie': { fr: 'Services de broderie', ar: 'خدمات التطريز' },
      'formation-couture': { fr: 'Centres de formation couture', ar: 'مراكز تدريب الخياطة' },
      'location-machines': { fr: 'Location de machines à coudre', ar: 'تأجير آلات الخياطة' },
      'textiles': { fr: 'Textiles', ar: 'المنسوجات' },
      'studios': { fr: 'Studios', ar: 'الاستوديوهات' },
    },
  },

  // ===== WILAYAS SECTION =====
  wilayas: {
    badge: {
      fr: '69 Wilayas',
      ar: '69 ولاية',
    },
    title: {
      fr: 'Présents partout en Algérie',
      ar: 'متواجدون في كل أنحاء الجزائر',
    },
    subtitle: {
      fr: 'Trouver un professionnel dans votre wilaya',
      ar: 'اعثر على متخصص في ولايتك',
    },
  },

  // ===== HOW IT WORKS =====
  how: {
    title: {
      fr: 'Comment ça marche ?',
      ar: 'كيف يعمل ؟',
    },
    subtitle: {
      fr: "Trouver un professionnel n'a jamais été aussi simple",
      ar: 'العثور على متخصص لم يكن أسهل من هذا',
    },
    steps: [
      {
        number: '01',
        title: { fr: 'Cherchez', ar: 'ابحث' },
        description: {
          fr: "Filtrez par wilaya, catégorie et plan. Trouvez le professionnel qu'il vous faut en quelques secondes.",
          ar: 'صفِّ حسب الولاية والفئة. اعثر على المتخصص المناسب في ثوانٍ.',
        },
      },
      {
        number: '02',
        title: { fr: 'Comparez', ar: 'قارن' },
        description: {
          fr: 'Consultez les portfolios, lisez les avis clients, comparez les profils et choisissez le meilleur.',
          ar: 'اطّلع على ملفات الأعمال، اقرأ آراء العملاء، قارن الملفات واختر الأفضل.',
        },
      },
      {
        number: '03',
        title: { fr: 'Contactez', ar: 'تواصل' },
        description: {
          fr: "Appelez directement ou envoyez un message WhatsApp en un seul clic. Aucune inscription requise.",
          ar: 'اتصل مباشرةً أو أرسل رسالة واتساب بنقرة واحدة. لا حاجة للتسجيل.',
        },
      },
    ],
  },

  // ===== CALL TO ACTION =====
  cta: {
    title: {
      fr: 'Prêt à trouver votre professionnel ?',
      ar: 'هل أنت مستعد للعثور على متخصصك؟',
    },
    subtitle: {
      fr: 'Des milliers de professionnels vous attendent dans votre wilaya.\nInscrivez votre business et rejoignez Sanne DZ gratuitement.',
      ar: 'آلاف المتخصصين بانتظارك في ولايتك.\nسجّل عملك وانضم إلى Sanne DZ مجاناً.',
    },
    findPro: {
      fr: 'Trouver un professionnel',
      ar: 'اعثر على متخصص',
    },
    registerBusiness: {
      fr: 'Inscrire mon business',
      ar: 'سجّل عملك',
    },
    trustFree: {
      fr: 'Inscription gratuite',
      ar: 'تسجيل مجاني',
    },
    trustNoCommit: {
      fr: 'Sans engagement',
      ar: 'بدون التزام',
    },
    trustVisible: {
      fr: 'Visible en 24h',
      ar: 'ظاهر خلال 24 ساعة',
    },
    trustWilayas: {
      fr: '69 wilayas',
      ar: '69 ولاية',
    },
  },

  // ===== FEATURED PARTNERS =====
  featured: {
    badge: {
      fr: 'Partenaires à la une',
      ar: 'شركاء مميزون',
    },
    title: {
      fr: 'Les professionnels du moment',
      ar: 'المتخصصون المميزون',
    },
    subtitle: {
      fr: 'Sélectionnés par notre équipe pour leur qualité et leurs avis clients',
      ar: 'مختارون من فريقنا لجودتهم وآراء عملائهم',
    },
    verified: {
      fr: 'Vérifié',
      ar: 'موثَّق',
    },
    pro: {
      fr: 'Pro',
      ar: 'برو',
    },
    viewProfile: {
      fr: 'Voir le profil',
      ar: 'عرض الملف',
    },
    seeAll: {
      fr: 'Voir tous les partenaires',
      ar: 'رؤية جميع الشركاء',
    },
    reviews: {
      fr: 'avis',
      ar: 'تقييم',
    },
  },

  // ===== FOOTER =====
  footer: {
    description: {
      fr: 'La marketplace algérienne qui connecte les clients avec les meilleurs professionnels locaux dans les 69 wilayas.',
      ar: 'السوق الجزائري الذي يربط العملاء بأفضل المتخصصين المحليين في 69 ولاية.',
    },
    navigation: {
      fr: 'Navigation',
      ar: 'التنقل',
    },
    categoriesTitle: {
      fr: 'Catégories',
      ar: 'الفئات',
    },
    contact: {
      fr: 'Contact',
      ar: 'اتصل بنا',
    },
    links: {
      home: { fr: 'Accueil', ar: 'الرئيسية' },
      search: { fr: 'Recherche', ar: 'بحث' },
      categories: { fr: 'Catégories', ar: 'الفئات' },
      about: { fr: 'À propos', ar: 'من نحن' },
      contact: { fr: 'Contact', ar: 'اتصل بنا' },
      terms: { fr: 'CGU', ar: 'شروط الاستخدام' },
    },
    hasBusiness: {
      fr: 'Vous avez un business ?',
      ar: 'هل لديك عمل تجاري؟',
    },
    registerBusiness: {
      fr: 'Inscrire mon business',
      ar: 'سجّل عملك',
    },
    rights: {
      fr: 'Tous droits réservés',
      ar: 'جميع الحقوق محفوظة',
    },
    privacy: {
      fr: 'Confidentialité',
      ar: 'الخصوصية',
    },
    terms: {
      fr: "Conditions d'utilisation",
      ar: 'شروط الاستخدام',
    },
    partnerRules: {
      fr: 'Règles Partenaires',
      ar: 'قواعد الشركاء',
    },
    location: {
      fr: 'Alger, Algérie',
      ar: 'الجزائر العاصمة، الجزائر',
    },
  },

  // ===== PAGE ABOUT =====
  about: {
    metaTitle: {
      fr: 'À propos de Sanne DZ | Notre mission',
      ar: 'من نحن — Sanne DZ | مهمتنا',
    },
    badge: {
      fr: 'Fait en Algérie',
      ar: 'صُنع في الجزائر',
    },
    title: {
      fr: 'À propos de Sanne DZ',
      ar: 'من نحن — Sanne DZ',
    },
    subtitle: {
      fr: "La marketplace numérique algérienne universelle, conçue pour connecter les clients avec les meilleurs professionnels locaux dans les 69 wilayas d'Algérie.",
      ar: 'السوق الرقمي الجزائري الشامل، مصمَّم لربط العملاء بأفضل المتخصصين المحليين في 69 ولاية جزائرية.',
    },
    stats: {
      partners: { fr: 'Partenaires actifs', ar: 'شريك نشط' },
      wilayas: { fr: 'Wilayas couvertes', ar: 'ولاية مغطاة' },
      clients: { fr: 'Clients inscrits', ar: 'عميل مسجل' },
      sectors: { fr: 'Secteurs couverts', ar: 'قطاع مغطى' },
    },
    missionBadge: {
      fr: 'Notre Mission',
      ar: 'مهمتنا',
    },
    missionTitle: {
      fr: 'Digitaliser les professionnels algériens',
      ar: 'رقمنة المتخصصين الجزائريين',
    },
    missionP1: {
      fr: "Sanne DZ est né d'un constat simple : des milliers de professionnels et artisans algériens excellents restent invisibles faute de présence numérique. Pendant ce temps, leurs clients potentiels les cherchent en ligne sans les trouver.",
      ar: 'وُلد Sanne DZ من ملاحظة بسيطة: آلاف المتخصصين والحرفيين الجزائريين الممتازين يبقون غير مرئيين بسبب غياب الحضور الرقمي. في الوقت ذاته، يبحث عملاؤهم المحتملون عنهم على الإنترنت دون أن يجدوهم.',
    },
    missionP2: {
      fr: "Notre plateforme offre à chaque professionnel — couturière, coiffeur, pâtissier, photographe ou technicien — un espace vitrine professionnel accessible en quelques minutes, sans compétences techniques.",
      ar: 'توفر منصتنا لكل متخصص — خياطة، حلاق، حلواني، مصور أو تقني — فضاءً احترافياً متاحاً في دقائق، دون الحاجة إلى مهارات تقنية.',
    },
    missionP3: {
      fr: "Pour les clients, Sanne DZ est le point d'entrée unique pour trouver, comparer et contacter le bon professionnel dans leur wilaya.",
      ar: 'للعملاء، Sanne DZ هو النقطة الواحدة للعثور على المتخصص المناسب في ولايتهم ومقارنته والتواصل معه.',
    },
    madeIn: {
      fr: 'Made in Algeria',
      ar: 'صُنع في الجزائر',
    },
    madeInSub: {
      fr: 'Pour les Algériens, par les Algériens',
      ar: 'للجزائريين، بأيدي جزائرية',
    },
    valuesTitle: {
      fr: 'Nos valeurs',
      ar: 'قيمنا',
    },
    valuesSub: {
      fr: 'Ce qui nous guide chaque jour',
      ar: 'ما يوجهنا كل يوم',
    },
    values: {
      local: {
        title: { fr: "Local d'abord", ar: 'المحلي أولاً' },
        desc: { fr: "Nous mettons en avant les professionnels algériens de chaque wilaya. La proximité est notre force.", ar: 'نُبرز المتخصصين الجزائريين في كل ولاية. القرب هو قوتنا.' },
      },
      trust: {
        title: { fr: 'Confiance & Qualité', ar: 'الثقة والجودة' },
        desc: { fr: "Chaque partenaire est validé manuellement par notre équipe avant d'être visible sur la plateforme.", ar: 'يتم التحقق من كل شريك يدوياً من قبل فريقنا قبل ظهوره على المنصة.' },
      },
      feminine: {
        title: { fr: 'Féminin & Inclusif', ar: 'نسوي وشامل' },
        desc: { fr: "Conçu pour les femmes algériennes, clientes et professionnelles, avec un design intuitif et élégant.", ar: 'مصمَّم للمرأة الجزائرية، عميلةً ومتخصصةً، بتصميم بديهي وأنيق.' },
      },
      fast: {
        title: { fr: 'Simple & Rapide', ar: 'بسيط وسريع' },
        desc: { fr: "Trouver un professionnel, le contacter via WhatsApp — en quelques secondes, sans inscription.", ar: 'العثور على متخصص والتواصل معه عبر واتساب — في ثوانٍ، بدون تسجيل.' },
      },
      digital: {
        title: { fr: 'Numérique Algérien', ar: 'رقمي جزائري' },
        desc: { fr: "Nous participons à la digitalisation des PME et artisans algériens, sans compétences techniques requises.", ar: 'نشارك في رقمنة المؤسسات الصغيرة والحرفيين الجزائريين، دون الحاجة إلى مهارات تقنية.' },
      },
      freemium: {
        title: { fr: 'Freemium Accessible', ar: 'مجاني ومتاح' },
        desc: { fr: "Plan Simple gratuit au lancement. Plan Pro abordable pour maximiser la visibilité.", ar: 'الخطة البسيطة مجانية عند الإطلاق. الخطة Pro بسعر مناسب لتعظيم الظهور.' },
      },
    },
    sectorsTitle: {
      fr: 'Secteurs couverts',
      ar: 'القطاعات المغطاة',
    },
    sectorsSub: {
      fr: 'Une plateforme universelle pour tous les professionnels',
      ar: 'منصة شاملة لجميع المتخصصين',
    },
    sectorsList: {
      fr: ['Ateliers de couture', 'Modélistes', 'Patronistes', 'Magasins de tissus', 'Merceries', 'Services de broderie', 'Centres de formation couture', 'Location de machines à coudre', 'Textiles'],
      ar: ['ورشات الخياطة', 'المصمِّمون', 'صانعو الباترونات', 'متاجر الأقمشة', 'البزازة', 'خدمات التطريز', 'مراكز تدريب الخياطة', 'تأجير آلات الخياطة', 'المنسوجات'],
    },
    tagsFr: ['Ateliers', 'Tissus', 'Merceries', 'Broderie', 'Formation', 'Modélistes'],
    tagsAr: ['ورشات', 'أقمشة', 'بزازة', 'تطريز', 'تكوين', 'مصمِّمون'],
  },

  // ===== PAGE CONTACT =====
  contact: {
    title: {
      fr: 'Contactez-nous',
      ar: 'اتصل بنا',
    },
    subtitle: {
      fr: 'Notre équipe vous répond sous 24h ouvrables',
      ar: 'فريقنا يجيبك خلال 24 ساعة عمل',
    },
    reach: {
      fr: 'Nous joindre',
      ar: 'تواصل معنا',
    },
    social: {
      fr: 'Réseaux sociaux',
      ar: 'شبكات التواصل',
    },
    formTitle: {
      fr: 'Envoyer un message',
      ar: 'أرسل رسالة',
    },
    nameLabel: {
      fr: 'Votre nom *',
      ar: 'اسمك *',
    },
    namePlaceholder: {
      fr: 'Amina Bensalem',
      ar: 'أمينة بن سالم',
    },
    emailLabel: {
      fr: 'Email *',
      ar: 'البريد الإلكتروني *',
    },
    emailPlaceholder: {
      fr: 'amina@gmail.com',
      ar: 'amina@gmail.com',
    },
    subjectLabel: {
      fr: 'Sujet *',
      ar: 'الموضوع *',
    },
    subjectPlaceholder: {
      fr: 'Choisir un sujet',
      ar: 'اختر موضوعاً',
    },
    subjects: {
      fr: ["Question sur l'inscription partenaire", 'Problème technique', "Signalement d'abus", 'Demande de partenariat', 'Autre'],
      ar: ['سؤال حول تسجيل الشريك', 'مشكلة تقنية', 'الإبلاغ عن إساءة', 'طلب شراكة', 'أخرى'],
    },
    otherSubjectLabel: {
      fr: 'Précisez votre sujet *',
      ar: 'حدِّد موضوعك *',
    },
    otherSubjectPlaceholder: {
      fr: 'Saisissez votre sujet...',
      ar: 'أدخل موضوعك...',
    },
    messageLabel: {
      fr: 'Message *',
      ar: 'الرسالة *',
    },
    messagePlaceholder: {
      fr: 'Décrivez votre demande...',
      ar: 'صِف طلبك...',
    },
    send: {
      fr: 'Envoyer le message',
      ar: 'أرسل الرسالة',
    },
    sending: {
      fr: 'Envoi en cours...',
      ar: 'جارٍ الإرسال...',
    },
    successToast: {
      fr: 'Message envoyé ! Nous vous répondrons sous 24h.',
      ar: 'تم إرسال رسالتك! سنردّ عليك خلال 24 ساعة.',
    },
    faqTitle: {
      fr: 'Questions fréquentes',
      ar: 'الأسئلة الشائعة',
    },
    faqs: {
      fr: [
        { q: "Comment s'inscrire comme partenaire ?", a: 'Cliquez sur "Inscrire mon business", remplissez le formulaire et soumettez-le. Notre équipe validera votre profil sous 24–48h ouvrables.' },
        { q: "L'inscription est-elle gratuite ?", a: 'Oui, le Plan Simple est entièrement gratuit au lancement. Le Plan Pro offre plus de visibilité à un tarif mensuel ou annuel très abordable.' },
        { q: 'Comment les clients me contactent-ils ?', a: 'Directement via WhatsApp ou téléphone depuis votre profil. Aucun intermédiaire, contact direct et immédiat.' },
        { q: 'Puis-je modifier mon profil après validation ?', a: 'Oui, depuis votre dashboard partenaire vous pouvez modifier toutes vos informations à tout moment.' },
        { q: 'Comment signaler un avis inapproprié ?', a: "Via le bouton \"Signaler\" sur l'avis concerné. Notre équipe de modération traitera votre signalement rapidement." },
        { q: 'La plateforme est-elle disponible sur mobile ?', a: 'Oui, Sanne DZ est entièrement responsive et optimisé pour mobile. Une application native est en cours de développement.' },
      ],
      ar: [
        { q: 'كيف أسجّل كشريك؟', a: 'انقر على "سجّل عملك"، أكمل النموذج وأرسله. سيتحقق فريقنا من ملفك خلال 24–48 ساعة عمل.' },
        { q: 'هل التسجيل مجاني؟', a: 'نعم، الخطة البسيطة مجانية تماماً عند الإطلاق. تتيح الخطة Pro مزيداً من الظهور بسعر شهري أو سنوي مناسب.' },
        { q: 'كيف يتواصل العملاء معي؟', a: 'مباشرةً عبر واتساب أو الهاتف من ملفك الشخصي. لا وسيط، تواصل مباشر وفوري.' },
        { q: 'هل يمكنني تعديل ملفي بعد التحقق؟', a: 'نعم، من لوحة تحكم الشريك يمكنك تعديل جميع معلوماتك في أي وقت.' },
        { q: 'كيف أُبلّغ عن تقييم غير لائق؟', a: 'عبر زر "الإبلاغ" على التقييم المعني. سيتعامل فريق الإشراف لدينا مع بلاغك بسرعة.' },
        { q: 'هل المنصة متاحة على الهاتف المحمول؟', a: 'نعم، Sanne DZ متجاوب بالكامل ومُحسَّن للهاتف المحمول. تطبيق أصلي قيد التطوير.' },
      ],
    },
    contactMethods: {
      email: { fr: 'Email', ar: 'البريد الإلكتروني' },
      phone: { fr: 'Téléphone', ar: 'الهاتف' },
      whatsapp: { fr: 'WhatsApp Support', ar: 'دعم واتساب' },
    },
  },

  // ===== POPULAR SEARCHES =====
  popularSearches: {
    fr: ['Ateliers de couture', 'Tissus', 'Broderie', 'Merceries', 'Formation couture', 'Modélistes', 'Studios'],
    ar: ['ورشات الخياطة', 'أقمشة', 'تطريز', 'بزازة', 'تكوين خياطة', 'مصمِّمون', 'استوديوهات'],
  },

  // ===== SIDEBAR =====
  sidebar: {
    backToSite:  { fr: 'Retour au site',       ar: 'العودة للموقع' },
    logout:      { fr: 'Déconnexion',           ar: 'تسجيل الخروج' },
    rolePart:    { fr: 'Partenaire',            ar: 'شريك' },
    roleClient:  { fr: 'Client',               ar: 'عميل' },
    roleAdmin:   { fr: 'Administrateur',        ar: 'مشرف' },
    planPro:     { fr: 'Pro',                   ar: 'برو' },
    planSimple:  { fr: 'Simple',               ar: 'بسيط' },
    nav: {
      // Client
      favorites:     { fr: 'Mes favoris',           ar: 'مفضلتي' },
      myReviews:     { fr: 'Mes avis',              ar: 'تقييماتي' },
      myProfile:     { fr: 'Mon profil',            ar: 'ملفي الشخصي' },
      notifications: { fr: 'Notifications',         ar: 'الإشعارات' },
      settings:      { fr: 'Paramètres',            ar: 'الإعدادات' },
      // Partner
      overview:      { fr: "Vue d'ensemble",        ar: 'نظرة عامة' },
      bizProfile:    { fr: 'Mon profil business',   ar: 'ملف عملي' },
      portfolio:     { fr: 'Portfolio',             ar: 'معرض الأعمال' },
      receivedRevs:  { fr: 'Avis reçus',            ar: 'التقييمات المستلمة' },
      stats:         { fr: 'Statistiques',          ar: 'الإحصائيات' },
      subscription:  { fr: 'Abonnement',            ar: 'الاشتراك' },
      // Admin
      globalView:    { fr: 'Vue globale',           ar: 'النظرة الشاملة' },
      partners:      { fr: 'Partenaires',           ar: 'الشركاء' },
      clients:       { fr: 'Clients',              ar: 'العملاء' },
      categories:    { fr: 'Catégories',           ar: 'الفئات' },
      subscriptions: { fr: 'Abonnements',          ar: 'الاشتراكات' },
      modReviews:    { fr: 'Modération avis',      ar: 'إشراف التقييمات' },
      adminNotifs:   { fr: 'Notifications',        ar: 'الإشعارات' },
      adminStats:    { fr: 'Statistiques',         ar: 'الإحصائيات' },
      export:        { fr: 'Export données',       ar: 'تصدير البيانات' },
    },
  },

  // ===== DASHBOARD PARTENAIRE =====
  partnerDash: {
    title:          { fr: 'Mon Dashboard',                  ar: 'لوحتي' },
    viewPublic:     { fr: 'Voir mon profil public',         ar: 'عرض ملفي العام' },
    profilePct:     { fr: 'Profil complété à 65%',          ar: 'الملف مكتمل بنسبة 65٪' },
    profileHint:    { fr: 'Ajoutez vos horaires et au moins 5 photos pour maximiser votre visibilité.', ar: 'أضف أوقات عملك وما لا يقل عن 5 صور لتعظيم ظهورك.' },
    complete:       { fr: 'Compléter',                      ar: 'أكمل' },
    profileViews:   { fr: 'Vues du profil',                 ar: 'مشاهدات الملف' },
    waClicks:       { fr: 'Clics WhatsApp',                 ar: 'نقرات واتساب' },
    favorites:      { fr: 'Favoris',                        ar: 'المفضلة' },
    avgRating:      { fr: 'Note moyenne',                   ar: 'التقييم المتوسط' },
    weekActivity:   { fr: 'Activité de la semaine',         ar: 'نشاط الأسبوع' },
    latestReviews:  { fr: 'Derniers avis',                  ar: 'آخر التقييمات' },
    noReviews:      { fr: "Aucun avis pour l'instant.",     ar: 'لا توجد تقييمات بعد.' },
    seeAll:         { fr: 'Voir tout',                      ar: 'رؤية الكل' },
    quickActions:   { fr: 'Actions rapides',                ar: 'إجراءات سريعة' },
    addPhotos:      { fr: 'Ajouter des photos',             ar: 'إضافة صور' },
    editProfile:    { fr: 'Modifier le profil',             ar: 'تعديل الملف' },
    seeStats:       { fr: 'Voir les stats',                 ar: 'عرض الإحصائيات' },
    mySubscription: { fr: 'Mon abonnement',                 ar: 'اشتراكي' },
    upgradePro:     { fr: 'Passez au Plan Pro',             ar: 'انتقل إلى خطة Pro' },
    upgradeDesc:    { fr: 'Statistiques avancées, badge Premium, priorité dans les résultats et plus encore.', ar: 'إحصائيات متقدمة، شارة Premium، أولوية في النتائج والمزيد.' },
    viewPlans:      { fr: 'Voir les plans',                 ar: 'رؤية الخطط' },
    thisMth:        { fr: 'ce mois',                        ar: 'هذا الشهر' },
    thisWeek:       { fr: 'cette semaine',                  ar: 'هذا الأسبوع' },
    newOnes:        { fr: 'nouveaux',                       ar: 'جديد' },
    reviews:        { fr: 'avis',                           ar: 'تقييم' },
    chartProfileViews: { fr: 'Vues du profil',             ar: 'مشاهدات الملف' },
    chartFavorites: { fr: 'Favoris',                        ar: 'المفضلة' },
    days: {
      fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      ar: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
    },
  },

  // ===== DASHBOARD ADMIN =====
  adminDash: {
    title:           { fr: 'Administration Sanne DZ',            ar: 'إدارة Sanne DZ' },
    subtitle:        { fr: 'Vue globale de la plateforme',        ar: 'النظرة الشاملة للمنصة' },
    thisMth:         { fr: 'ce mois', ar: 'هذا الشهر' },
    pendingPartners: { fr: 'partenaire(s) en attente de validation', ar: 'شريك بانتظار التحقق' },
    pendingReviews:  { fr: 'avis en attente de modération',      ar: 'تقييم بانتظار الإشراف' },
    process:         { fr: 'Traiter',                            ar: 'معالجة' },
    moderate:        { fr: 'Modérer',                            ar: 'إشراف' },
    totalPartners:   { fr: 'Partenaires actifs',                 ar: 'الشركاء النشطون' },
    totalClients:    { fr: 'Clients inscrits',                   ar: 'العملاء المسجلون' },
    totalReviews:    { fr: 'Avis publiés',                       ar: 'التقييمات المنشورة' },
    proPartners:     { fr: 'Partenaires Pro',                    ar: 'الشركاء Pro' },
    ofTotal:         { fr: '% du total',                         ar: '٪ من الإجمالي' },
    monthRevenue:    { fr: 'Revenus mensuels',                   ar: 'الإيرادات الشهرية' },
    last6months:     { fr: 'Plan Simple + Plan Pro — 6 derniers mois', ar: 'الخطة البسيطة + خطة Pro — آخر 6 أشهر' },
    total:           { fr: 'total',                              ar: 'المجموع' },
    growth:          { fr: 'Évolution des inscriptions',         ar: 'تطور التسجيلات' },
    lastRegistered:  { fr: 'Derniers inscrits',                  ar: 'آخر المسجلين' },
    quickActions:    { fr: 'Actions rapides',                    ar: 'إجراءات سريعة' },
    validatePartners:{ fr: 'Valider partenaires',               ar: 'التحقق من الشركاء' },
    moderateReviews: { fr: 'Modérer les avis',                  ar: 'إشراف التقييمات' },
    exportData:      { fr: 'Exporter données',                  ar: 'تصدير البيانات' },
    estRevenue:      { fr: 'Revenus estimés ce mois',           ar: 'الإيرادات المتوقعة هذا الشهر' },
    basedOn:         { fr: 'Basé sur',                          ar: 'استناداً إلى' },
    proPartnersLbl:  { fr: 'partenaires Pro',                   ar: 'شريك Pro' },
    seeAll:          { fr: 'Voir tout',                         ar: 'رؤية الكل' },
    statusActive:    { fr: 'Actif',                             ar: 'نشط' },
    statusPending:   { fr: 'En attente',                        ar: 'قيد الانتظار' },
    statusSuspended: { fr: 'Suspendu',                          ar: 'موقوف' },
    newPartners:     { fr: 'Nouveaux Partenaires',              ar: 'شركاء جدد' },
    newClients:      { fr: 'Nouveaux Clients',                  ar: 'عملاء جدد' },
    revSimple:       { fr: 'Revenus Plan Simple (DA)',           ar: 'إيرادات الخطة البسيطة (دج)' },
    revPro:          { fr: 'Revenus Plan Pro (DA)',             ar: 'إيرادات خطة Pro (دج)' },
    months: {
      fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      ar: ['جان', 'فيف', 'مار', 'أفر', 'ماي', 'جوان'],
    },
  },

  // ===== DASHBOARD CLIENT =====
  clientDashboard: {
    // Profil
    profileTitle:     { fr: 'Mon profil',                            ar: 'ملفي الشخصي' },
    profileSub:       { fr: 'Gérez vos informations personnelles',   ar: 'أدِر معلوماتك الشخصية' },
    role:             { fr: 'Client Sanne DZ',                       ar: 'عميل Sanne DZ' },
    memberSince:      { fr: 'Membre depuis ',            ar: 'عضو منذ جانفي 2025' },
    personalInfo:     { fr: 'Informations personnelles',             ar: 'المعلومات الشخصية' },
    firstName:        { fr: 'Prénom',                                ar: 'الاسم' },
    lastName:         { fr: 'Nom',                                   ar: 'اللقب' },
    email:            { fr: 'Email',                                 ar: 'البريد الإلكتروني' },
    emailNotice:      { fr: "L'email ne peut pas être modifié directement.", ar: 'لا يمكن تغيير البريد الإلكتروني مباشرة.' },
    phone:            { fr: 'Téléphone',                             ar: 'الهاتف' },
    wilaya:           { fr: 'Wilaya',                                ar: 'الولاية' },
    choose:           { fr: 'Choisir',                               ar: 'اختر' },
    saving:           { fr: 'Sauvegarde...',                         ar: 'جارٍ الحفظ...' },
    save:             { fr: 'Sauvegarder',                           ar: 'حفظ' },
    saveSuccess:      { fr: 'Profil mis à jour avec succès !',       ar: 'تم تحديث الملف بنجاح!' },
    dangerZone:       { fr: 'Zone dangereuse',                       ar: 'منطقة الخطر' },
    dangerNotice:     { fr: 'La suppression de votre compte est irréversible.', ar: 'حذف حسابك نهائي ولا يمكن التراجع عنه.' },
    deleteAccountBtn: { fr: 'Supprimer mon compte',                  ar: 'حذف حسابي' },
    deleteModalTitle: { fr: 'Supprimer mon compte',                  ar: 'حذف حسابي' },
    deleteModalDesc:  { fr: 'Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et toutes vos données seront supprimées.', ar: 'هل أنت متأكد من أنك تريد حذف حسابك نهائياً؟ هذا الإجراء لا رجوع فيه وسيتم حذف جميع بياناتك.' },
    cancel:           { fr: 'Annuler',                               ar: 'إلغاء' },
    confirmDelete:    { fr: 'Oui, supprimer',                        ar: 'نعم، احذف' },
    accountDeleted:   { fr: 'Compte supprimé',                       ar: 'تم حذف الحساب' },

    // Favoris
    favTitle:         { fr: 'Mes favoris',                           ar: 'مفضلتي' },
    favSaved:         { fr: 'partenaire(s) sauvegardé(s)',           ar: 'شريك(شركاء) محفوظ(ين)' },
    viewProfile:      { fr: 'Voir le profil',                        ar: 'عرض الملف' },
    noFavTitle:       { fr: 'Aucun favori encore',                   ar: 'لا توجد مفضلة بعد' },
    noFavDesc:        { fr: 'Parcourez la plateforme et sauvegardez vos professionnels préférés.', ar: 'تصفح المنصة واحفظ المهنيين المفضلين لديك.' },
    exploreBtn:       { fr: 'Explorer les partenaires',              ar: 'استكشاف الشركاء' },

    // Avis
    reviewsTitle:     { fr: 'Mes avis publiés',                      ar: 'تقييماتي المنشورة' },
    reviewsSub:       { fr: 'avis publiés sur la plateforme',        ar: 'تقييم(ات) منشورة على المنصة' },
    viewProfileArrow: { fr: 'Voir le profil →',                      ar: 'عرض الملف ←' },
    noRevTitle:       { fr: 'Aucun avis publié',                     ar: 'لا توجد تقييمات منشورة' },
    noRevDesc:        { fr: 'Visitez des partenaires et partagez votre expérience.', ar: 'زر الشركاء وشارك تجربتك.' },
    delRevModalTitle: { fr: "Supprimer l'avis",                      ar: 'حذف التقييم' },
    delRevModalDesc:  { fr: 'Êtes-vous sûr de vouloir supprimer cet avis ?', ar: 'هل أنت متأكد من أنك تريد حذف هذا التقييم؟' },
    delRevIrrev:      { fr: 'Cette action est irréversible.',        ar: 'هذا الإجراء لا رجوع فيه.' },
  },

  // ===== DASHBOARD PARTENAIRE — PROFIL =====
  partnerProfile: {
    title:          { fr: 'Mon profil business',                   ar: 'ملف عملي التجاري' },
    subtitle:       { fr: 'Mettez à jour vos informations visibles aux clients', ar: 'حدّث معلوماتك المرئية للعملاء' },
    mediaTitle:     { fr: 'Médias',                                ar: 'الوسائط' },
    logo:           { fr: 'Logo',                                  ar: 'الشعار' },
    cover:          { fr: 'Photo de couverture',                   ar: 'صورة الغلاف' },
    change:         { fr: 'Changer',                               ar: 'تغيير' },
    changeCover:    { fr: 'Changer la couverture',                 ar: 'تغيير الغلاف' },
    generalInfo:    { fr: 'Informations générales',                ar: 'المعلومات العامة' },
    bizName:        { fr: 'Nom du business *',                     ar: 'اسم العمل التجاري *' },
    phone:          { fr: 'Téléphone *',                           ar: 'الهاتف *' },
    whatsapp:       { fr: 'WhatsApp *',                            ar: 'واتساب *' },
    category:       { fr: 'Catégorie *',                           ar: 'الفئة *' },
    description:    { fr: 'Description *',                         ar: 'الوصف *' },
    locationTitle:  { fr: 'Localisation',                          ar: 'الموقع' },
    wilaya:         { fr: 'Wilaya *',                              ar: 'الولاية *' },
    rc:             { fr: 'Registre de commerce',                  ar: 'السجل التجاري' },
    address:        { fr: 'Adresse complète *',                    ar: 'العنوان الكامل *' },
    mapsLink:       { fr: 'Lien Google Maps',                      ar: 'رابط خرائط Google' },
    delivery:       { fr: 'Société de livraison',                  ar: 'شركة التوصيل' },
    optional:       { fr: '(optionnel)',                           ar: '(اختياري)' },
    scheduleTitle:  { fr: "Horaires d'ouverture",                  ar: 'أوقات العمل' },
    closed:         { fr: 'Fermé',                                 ar: 'مغلق' },
    saving:         { fr: 'Sauvegarde...',                         ar: 'جارٍ الحفظ...' },
    save:           { fr: 'Sauvegarder les modifications',         ar: 'حفظ التغييرات' },
    saveSuccess:    { fr: 'Profil mis à jour avec succès !',       ar: 'تم تحديث الملف بنجاح!' },
    days: {
      fr: [
        { key: 'monday',    label: 'Lundi' },
        { key: 'tuesday',   label: 'Mardi' },
        { key: 'wednesday', label: 'Mercredi' },
        { key: 'thursday',  label: 'Jeudi' },
        { key: 'friday',    label: 'Vendredi' },
        { key: 'saturday',  label: 'Samedi' },
        { key: 'sunday',    label: 'Dimanche' },
      ],
      ar: [
        { key: 'monday',    label: 'الإثنين' },
        { key: 'tuesday',   label: 'الثلاثاء' },
        { key: 'wednesday', label: 'الأربعاء' },
        { key: 'thursday',  label: 'الخميس' },
        { key: 'friday',    label: 'الجمعة' },
        { key: 'saturday',  label: 'السبت' },
        { key: 'sunday',    label: 'الأحد' },
      ],
    },
  },

  // ===== DASHBOARD PARTENAIRE — ABONNEMENT =====
  partnerSub: {
    title:          { fr: 'Mon abonnement',                        ar: 'اشتراكي' },
    subtitle:       { fr: 'Gérez votre plan Sanne DZ',            ar: 'أدِر خطة Sanne DZ الخاصة بك' },
    active:         { fr: 'Actif',                                 ar: 'نشط' },
    renewal:        { fr: 'Renouvellement le',                     ar: 'يتجدد في' },
    free:           { fr: 'Gratuit au lancement',                  ar: 'مجاني عند الإطلاق' },
    switchAnnual:   { fr: "Passer à l'abonnement annuel (−20%)",  ar: 'التحويل إلى اشتراك سنوي (−20٪)' },
    cancel:         { fr: "Annuler l'abonnement",                  ar: 'إلغاء الاشتراك' },
    upgradeTitle:   { fr: 'Passez au Plan Pro',                    ar: 'انتقل إلى خطة Pro' },
    upgradeBtn:     { fr: 'Passer au Plan Pro',                    ar: 'انتقل إلى خطة Pro' },
    billingTitle:   { fr: 'Historique de facturation',             ar: 'سجل الفواتير' },
    planProLabel:   { fr: 'Plan Pro — Mensuel',                    ar: 'خطة Pro — شهري' },
    paid:           { fr: 'Payé',                                  ar: 'مدفوع' },
    noInvoice:      { fr: 'Aucune facture — vous êtes sur le Plan Simple gratuit', ar: 'لا توجد فواتير — أنت على الخطة البسيطة المجانية' },
    features: {
      fr: [
        'Photos illimitées + Vidéos',
        'Badge Premium visible sur le profil',
        'Priorité dans les résultats de recherche',
        'Mis en avant sur la homepage',
        'Statistiques : vues, clics, favoris',
        'Graphiques 7j / 30j / 90j',
        'Support prioritaire',
      ],
      ar: [
        'صور وفيديوهات غير محدودة',
        'شارة Premium مرئية على الملف',
        'أولوية في نتائج البحث',
        'ظهور مميز على الصفحة الرئيسية',
        'إحصائيات: مشاهدات، نقرات، مفضلة',
        'رسوم بيانية 7 أيام / 30 يوم / 90 يوم',
        'دعم ذو أولوية',
      ],
    },
  },

  // ===== DASHBOARD PARTENAIRE — AVIS =====
  partnerReviews: {
    title:          { fr: 'Avis reçus',                            ar: 'التقييمات المستلمة' },
    subtitle:       { fr: 'avis clients sur votre profil',         ar: 'تقييم من العملاء على ملفك' },
    reviews:        { fr: 'avis',                                  ar: 'تقييم' },
    statusApproved: { fr: 'Approuvé',                              ar: 'موافق عليه' },
    statusPending:  { fr: 'En attente',                            ar: 'قيد الانتظار' },
    statusRejected: { fr: 'Refusé',                                ar: 'مرفوض' },
    reply:          { fr: 'Répondre',                              ar: 'ردّ' },
    report:         { fr: 'Signaler',                              ar: 'إبلاغ' },
    noReviewsTitle: { fr: 'Aucun avis reçu',                       ar: 'لا توجد تقييمات بعد' },
    noReviewsSub:   { fr: 'Partagez votre profil pour obtenir vos premiers avis.', ar: 'شارك ملفك للحصول على أول تقييماتك.' },
  },

  // ===== AUTHENTIFICATION =====
  auth: {
    // Login
    loginTitle:       { fr: 'Connexion',                             ar: 'تسجيل الدخول' },
    loginSub:         { fr: 'Accédez à votre espace Sanne DZ',       ar: 'قم بالوصول إلى مساحتك في Sanne DZ' },
    demoQuick:        { fr: 'Démo rapide :',                         ar: 'تجربة سريعة:' },
    client:           { fr: 'Client',                                ar: 'عميل' },
    partner:          { fr: 'Partenaire',                            ar: 'شريك' },
    admin:            { fr: 'Admin',                                 ar: 'مشرف' },
    email:            { fr: 'Email',                                 ar: 'البريد الإلكتروني' },
    emailPlace:       { fr: 'votre@email.com',                       ar: 'البريد@العنوان.com' },
    password:         { fr: 'Mot de passe',                          ar: 'كلمة المرور' },
    forgotPwd:        { fr: 'Mot de passe oublié ?',                 ar: 'هل نسيت كلمة المرور؟' },
    pwdPlace:         { fr: '••••••••',                              ar: '••••••••' },
    loggingIn:        { fr: 'Connexion...',                          ar: 'جارٍ تسجيل الدخول...' },
    loginBtn:         { fr: 'Se connecter',                          ar: 'تسجيل الدخول' },
    noAccount:        { fr: 'Pas encore de compte ?',                ar: 'ليس لديك حساب بعد؟' },
    registerLink:     { fr: "S'inscrire",                            ar: 'إنشاء حساب' },
    welcomeAdmin:     { fr: 'Bienvenue Admin !',                     ar: 'مرحباً أيها المشرف!' },
    welcomeUser:      { fr: 'Bienvenue',                             ar: 'مرحباً' },

    // Role Selection
    roleTitle:        { fr: 'Rejoindre Sanne DZ',                    ar: 'انضم إلى Sanne DZ' },
    roleSub:          { fr: 'Choisissez votre profil pour commencer',ar: 'اختر ملفك الشخصي للبدء' },
    imClient:         { fr: 'Je suis client',                        ar: 'أنا عميل' },
    clientDesc:       { fr: 'Je cherche des professionnels locaux pour mes besoins', ar: 'أبحث عن مهنيين محليين لتلبية احتياجاتي' },
    clientPerks: {
      fr: ['Gratuit', 'Sans engagement', 'Accès immédiat'],
      ar: ['مجاني', 'بدون التزام', 'وصول فوري'],
    },
    createClientBtn:  { fr: 'Créer mon compte client',               ar: 'إنشاء حساب عميل' },
    imPartner:        { fr: "J'ai un business",                      ar: 'لدي عمل تجاري' },
    partnerDesc:      { fr: 'Je suis professionnel et je veux être visible dans ma wilaya', ar: 'أنا محترف وأريد أن أكون مرئياً في ولايتي' },
    partnerPerks: {
      fr: ['Départ gratuit', 'Validation 24h', 'Plan Pro disponible'],
      ar: ['بداية مجانية', 'تحقق في 24 ساعة', 'خطة Pro متاحة'],
    },
    createPartnerBtn: { fr: 'Inscrire mon business',                 ar: 'تسجيل عملي التجاري' },
    alreadyReg:       { fr: 'Déjà inscrit ?',                        ar: 'مسجل بالفعل؟' },
  },

  // ===== REGISTER / FORGOT PASSWORD =====
  register: {
    // Shared
    next:             { fr: 'Suivant',                               ar: 'التالي' },
    step:             { fr: 'Étape',                                 ar: 'الخطوة' },
    on:               { fr: 'sur',                                   ar: 'من' },
    
    // Client
    clientTitle:      { fr: 'Créer mon compte',                      ar: 'إنشاء حسابي' },
    stepInfo:         { fr: 'Informations',                          ar: 'المعلومات' },
    stepPrefs:        { fr: 'Préférences',                           ar: 'التفضيلات' },
    firstName:        { fr: 'Prénom',                                ar: 'الاسم الأول' },
    lastName:         { fr: 'Nom',                                   ar: 'اسم العائلة' },
    email:            { fr: 'Adresse email',                         ar: 'البريد الإلكتروني' },
    phone:            { fr: 'Téléphone',                             ar: 'الهاتف' },
    wilaya:           { fr: 'Wilaya',                                ar: 'الولاية' },
    invalidPhone:     { fr: 'Format de téléphone invalide. Ex: 0555123456 ou +213555123456', ar: 'تنسيق الهاتف غير صالح. مثال: 0555123456' },
    invalidPwd:       { fr: 'Le mot de passe doit comporter au minimum 8 caractères, incluant une lettre majuscule, une lettre minuscule et un chiffre.', ar: 'يجب أن يحتوي على الأقل على 8 أحرف، بما في ذلك حرف كبير وحرف صغير ورقم.' },
    pwdMismatch:      { fr: 'Les mots de passe ne correspondent pas', ar: 'كلمتا المرور غير متطابقتين' },
    clientSuccess:    { fr: 'Compte créé ! Vérifiez votre email.',   ar: 'تم إنشاء الحساب! تحقق من بريدك.' },
    firstNamePlace:   { fr: 'Amina',                                 ar: 'أمينة' },
    lastNamePlace:    { fr: 'Bensalem',                              ar: 'بنسالم' },
    phonePlace:       { fr: '0555 123 456',                          ar: '0555 123 456' },
    chooseWilaya:     { fr: 'Choisir votre wilaya',                  ar: 'اختر ولايتك' },
    whichCats:        { fr: 'Quelles catégories vous intéressent ?', ar: 'ما هي الفئات التي تهمك؟' },
    optional:         { fr: '(optionnel)',                           ar: '(اختياري)' },
    catsHelp:         { fr: 'Cela nous permettra de vous proposer les meilleurs partenaires.', ar: 'هذا سيسمح لنا بتقديم أفضل الشركاء لك.' },
    pwdLabel:         { fr: 'Mot de passe *',                        ar: 'كلمة المرور *' },
    pwdConfLabel:     { fr: 'Confirmer le mot de passe *',           ar: 'تأكيد كلمة المرور *' },
    pwdMin:           { fr: 'Min. 8 caractères',                     ar: 'على الأقل 8 أحرف' },
    pwdRepeat:        { fr: 'Répéter le mot de passe',               ar: 'أعد إدخال كلمة المرور' },
    acceptTerms:      { fr: "J'accepte les conditions d'utilisation", ar: 'أوافق على شروط الاستخدام' },
    andPrivacy:       { fr: 'et la politique de confidentialité *',  ar: 'وسياسة الخصوصية *' },
    creatingAccount:  { fr: 'Création du compte...',                 ar: 'جارٍ إنشاء الحساب...' },
    createAccountBtn: { fr: 'Créer mon compte',                      ar: 'إنشاء حسابي' },
    alreadyRegClient: { fr: 'Déjà inscrit ?',                        ar: 'مسجل بالفعل؟' },

    // Partner
    partnerTitle:     { fr: 'Inscrire mon business',                 ar: 'تسجيل عملي التجاري' },
    stepBiz:          { fr: 'Infos business',                        ar: 'معلومات العمل' },
    stepLoc:          { fr: 'Localisation',                          ar: 'الموقع' },
    stepCat:          { fr: 'Catégorie',                             ar: 'الفئة' },
    stepAcc:          { fr: 'Compte',                                ar: 'الحساب' },
    invalidWa:        { fr: 'Format WhatsApp invalide. Ex: 0555123456 ou +213555123456', ar: 'تنسيق واتساب غير صالح.' },
    partnerSuccess:   { fr: 'Dossier soumis ! En attente de validation.', ar: 'تم تقديم الملف! في انتظار التحقق.' },
    bizName:          { fr: 'Nom du business *',                     ar: 'اسم العمل التجاري *' },
    bizNamePlace:     { fr: 'Atelier Fatouma',                       ar: 'ورشة فطومة' },
    proEmail:         { fr: 'Email professionnel *',                 ar: 'البريد المهني *' },
    proEmailPlace:    { fr: 'contact@monbusiness.com',               ar: 'contact@domain.com' },
    waPlace:          { fr: '213555123456',                          ar: '213555123456' },
    rc:               { fr: 'Numéro de registre de commerce',        ar: 'رقم السجل التجاري' },
    rcPlace:          { fr: 'RC-16-B-XXXXXXX',                       ar: 'RC-16-B-XXXXXXX' },
    address:          { fr: 'Adresse complète',                      ar: 'العنوان الكامل' },
    addressPlace:     { fr: '12 Rue Didouche Mourad, Alger Centre',  ar: '12 شارع ديدوش مراد، الجزائر الوسطى' },
    mapsLink:         { fr: 'Lien Google Maps',                      ar: 'رابط خرائط Google' },
    delivery:         { fr: 'Société de livraison',                  ar: 'شركة التوصيل' },
    deliveryPlace:    { fr: 'Ex: Yalidine, Zirim, Interne...',       ar: 'مثال: ياليدين، زيريم...' },
    catBiz:           { fr: 'Catégories de votre activité *',        ar: 'فئات نشاطك *' },
    other:            { fr: 'Autre',                                 ar: 'أخرى' },
    specifyCat:       { fr: 'Précisez votre catégorie *',            ar: 'حدد فئتك *' },
    specifyCatPlace:  { fr: 'Ex: Impression sur tissu...',           ar: 'مثال: طباعة على القماش...' },
    descBiz:          { fr: 'Description de votre activité *',       ar: 'وصف نشاطك *' },
    descBizPlace:     { fr: 'Décrivez votre activité, vos services, votre expérience... (min. 50 caractères)', ar: 'صف نشاطك، خدماتك، خبرتك... (على الأقل 50 حرفاً)' },
    charsMin:         { fr: '/20 caractères minimum',                ar: '/50 حرفاً كحد أدنى' },
    acceptCondGen:    { fr: "J'accepte les conditions générales d'utilisation", ar: 'أوافق على الشروط العامة للاستخدام' },
    acceptCondPart:   { fr: "J'accepte les règles spécifiques aux partenaires", ar: 'أوافق على القواعد الخاصة بالشركاء' },
    submitting:       { fr: 'Soumission...',                         ar: 'جاري التقديم...' },
    submitBtn:        { fr: 'Soumettre mon dossier',                 ar: 'تقديم ملفي' },
  },

  forgot: {
    title:            { fr: 'Mot de passe oublié',                   ar: 'نسيت كلمة المرور' },
    sub:              { fr: 'Nous vous enverrons un lien de réinitialisation', ar: 'سنرسل لك رابط إعادة تعيين' },
    successMsg:       { fr: 'Email de réinitialisation envoyé !',    ar: 'تم إرسال بريد إعادة التعيين!' },
    yourEmail:        { fr: 'Votre adresse email',                   ar: 'بريدك الإلكتروني' },
    sending:          { fr: 'Envoi...',                              ar: 'جارٍ الإرسال...' },
    sendLink:         { fr: 'Envoyer le lien',                       ar: 'إرسال الرابط' },
    sentTitle:        { fr: 'Email envoyé !',                        ar: 'تم الإرسال!' },
    sentSub:          { fr: 'Un lien de réinitialisation a été envoyé à', ar: 'تم إرسال رابط إعادة التعيين إلى' },
    checkInbox:       { fr: 'Vérifiez votre boîte de réception.',    ar: 'تحقق من صندوق الوارد الخاص بك.' },
    backToLogin:      { fr: 'Retour à la connexion',                 ar: 'العودة لتسجيل الدخول' },
    resendIn:         { fr: 'Renvoyer dans',                          ar: 'إعادة الإرسال خلال' },
    resendLink:       { fr: 'Renvoyer le lien',                       ar: 'إعادة إرسال الرابط' },
  },

  resetPassword: {
    title:            { fr: 'Réinitialiser le mot de passe',          ar: 'إعادة تعيين كلمة المرور' },
    sub:              { fr: 'Entrez votre nouveau mot de passe',      ar: 'أدخل كلمة المرور الجديدة' },
    newPassword:      { fr: 'Nouveau mot de passe',                   ar: 'كلمة المرور الجديدة' },
    confirmPassword:  { fr: 'Confirmer le mot de passe',              ar: 'تأكيد كلمة المرور' },
    passwordHint:     { fr: 'Min. 8 caractères, une majuscule, une minuscule et un chiffre', ar: 'حد أدنى 8 أحرف، حرف كبير، حرف صغير ورقم' },
    resetBtn:         { fr: 'Réinitialiser le mot de passe',          ar: 'إعادة تعيين كلمة المرور' },
    resetting:        { fr: 'Réinitialisation...',                    ar: 'جارٍ إعادة التعيين...' },
    noMatch:          { fr: 'Les mots de passe ne correspondent pas', ar: 'كلمتا المرور غير متطابقتين' },
    tooShort:         { fr: 'Le mot de passe doit contenir au moins 8 caractères', ar: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل' },
    invalidToken:     { fr: 'Lien invalide ou expiré',                ar: 'رابط غير صالح أو منتهي الصلاحية' },
    invalidTokenDesc: { fr: 'Ce lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.', ar: 'رابط إعادة التعيين هذا غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.' },
    requestNew:       { fr: 'Demander un nouveau lien',               ar: 'طلب رابط جديد' },
    successMsg:       { fr: 'Mot de passe réinitialisé avec succès !', ar: 'تم إعادة تعيين كلمة المرور بنجاح!' },
    successTitle:     { fr: 'Mot de passe modifié !',                 ar: 'تم تغيير كلمة المرور!' },
    successDesc:      { fr: 'Vous allez être redirigé vers la page de connexion...', ar: 'ستتم إعادة توجيهك إلى صفحة تسجيل الدخول...' },
    goToLogin:        { fr: 'Se connecter',                            ar: 'تسجيل الدخول' },
    errorMsg:         { fr: 'Erreur lors de la réinitialisation. Veuillez réessayer.', ar: 'حدث خطأ أثناء إعادة التعيين. يرجى المحاولة مرة أخرى.' },
  },

  // ===== OTHER AUTH PAGES =====
  verifyEmail: {
    title:            { fr: 'Vérifiez votre email',                  ar: 'تحقق من بريدك الإلكتروني' },
    sub:              { fr: 'Un code à 6 chiffres a été envoyé à votre adresse email. Saisissez-le ci-dessous.', ar: 'تم إرسال رمز من 6 أرقام إلى بريدك الإلكتروني. أدخله أدناه.' },
    demoHint:         { fr: "Pour la démo, entrez n'importe quel code à 6 chiffres.", ar: 'للتجربة، أدخل أي رمز من 6 أرقام.' },
    verifying:        { fr: 'Vérification...',                       ar: 'جاري التحقق...' },
    verifyBtn:        { fr: 'Vérifier le code',                      ar: 'التحقق من الرمز' },
    resending:        { fr: 'Renvoi en cours...',                    ar: 'جارٍ إعادة الإرسال...' },
    resend:           { fr: 'Renvoyer le code',                      ar: 'إعادة إرسال الرمز' },
    resendIn:         { fr: 'Renvoyer dans',                          ar: 'إعادة الإرسال خلال' },
    successMsg:       { fr: 'Email vérifié avec succès !',           ar: 'تم التحقق من البريد بنجاح!' },
    resentMsg:        { fr: 'Code renvoyé sur votre email.',         ar: 'تم إعادة إرسال الرمز إلى بريدك.' },
  },

  pending: {
    title:            { fr: "Dossier en cours d'examen",             ar: 'ملف قيد المراجعة' },
    desc:             { fr: 'Votre inscription partenaire a été soumise avec succès. Notre équipe examine votre dossier et vous notifiera par email et notification sous 24 à 48h ouvrables.', ar: 'تم تقديم تسجيل شريكك بنجاح. يقوم فريقنا بمراجعة ملفك وسيعلمك عبر البريد الإلكتروني والإشعارات خلال 24 إلى 48 ساعة عمل.' },
    step1:            { fr: 'Dossier soumis',                        ar: 'تم تقديم الملف' },
    step2:            { fr: "Examen par l'équipe Sanne DZ",          ar: 'مراجعة من قبل فريق Sanne DZ' },
    step3:            { fr: 'Notification par email',                ar: 'إشعار عبر البريد الإلكتروني' },
    step4:            { fr: 'Profil activé et visible',              ar: 'تم تنشيط الملف وهو مرئي' },
    contactTitle:     { fr: 'En cas de question :',                  ar: 'في حال كان لديك سؤال:' },
    email:            { fr: 'Email',                                 ar: 'بريد إلكتروني' },
    whatsapp:         { fr: 'WhatsApp',                              ar: 'واتساب' },
    backHome:         { fr: "Retour à l'accueil",                    ar: 'العودة للصفحة الرئيسية' },
  },

  conditions: {
    title:            { fr: 'Conditions Partenaires',                ar: 'شروط الشركاء' },
    sub:              { fr: 'Veuillez lire et accepter avant de continuer', ar: 'يرجى القراءة والقبول قبل المتابعة' },
    c1Title:          { fr: "Conditions d'utilisation",              ar: 'شروط الاستخدام' },
    c1Items: {
      fr: [
        'Utilisation de la plateforme uniquement à des fins légales et professionnelles',
        'Responsabilité entière du partenaire concernant ses services et informations',
        'Sanne DZ se réserve le droit de modifier les conditions avec préavis de 15 jours'
      ],
      ar: [
        'استخدام المنصة فقط لأغراض قانونية ومهنية',
        'المسؤولية الكاملة للشريك فيما يتعلق بخدماته ومعلوماته',
        'تحتفظ Sanne DZ بالحق في تعديل الشروط بإشعار مسبق مدته 15 يوماً'
      ]
    },
    c2Title:          { fr: 'Politique contenu & photos',            ar: 'سياسة المحتوى والصور' },
    c2Items: {
      fr: [
        'Photos doivent représenter votre vrai travail uniquement',
        "Interdiction d'images copiées, trompeuses ou à caractère offensant",
        'Sanne DZ peut supprimer tout contenu non conforme sans préavis'
      ],
      ar: [
        'يجب أن تمثل الصور عملك الحقيقي فقط',
        'يمنع استخدام الصور المنسوخة، المضللة أو المسيئة',
        'يمكن لـ Sanne DZ حذف أي محتوى غير متوافق دون إشعار'
      ]
    },
    c3Title:          { fr: 'Anti-spam & fausses informations',      ar: 'مكافحة البريد المزعج والمعلومات الخاطئة' },
    c3Items: {
      fr: [
        'Interdiction de publier de fausses informations sur vos services',
        'Interdiction de créer de faux avis ou de dupliquer des profils',
        'Suspension immédiate en cas de violation constatée'
      ],
      ar: [
        'يمنع نشر معلومات خاطئة عن خدماتك',
        'يمنع إنشاء تقييمات وهمية أو تكرار الملفات الشخصية',
        'إيقاف فوري في حالة اكتشاف أي انتهاك'
      ]
    },
    modPolicy:        { fr: 'Politique de modération',               ar: 'سياسة الإشراف' },
    modDesc:          { fr: "L'administrateur peut suspendre ou supprimer tout profil ne respectant pas les règles, sans préavis ni remboursement de la période restante.", ar: 'يمكن للمشرف تعليق أو حذف أي ملف شخصي لا يحترم القواعد، دون إشعار مسبق أو استرداد أموال الفترة المتبقية.' },
    agreeText:        { fr: "J'ai lu et j'accepte toutes les conditions partenaires de Sanne DZ. Je m'engage à les respecter scrupuleusement.", ar: 'قرأت وأقبل جميع شروط شركاء Sanne DZ. وألتزم باحترامها بدقة.' },
    processing:       { fr: 'Traitement...',                         ar: 'جارٍ المعالجة...' },
    acceptBtn:        { fr: 'Accepter et continuer',                 ar: 'القبول والمتابعة' },
    successMsg:       { fr: 'Conditions acceptées ! Choisissez votre plan.', ar: 'تم قبول الشروط! اختر خطتك.' },
  },

  planSelection: {
    title:            { fr: 'Choisissez votre plan',                 ar: 'اختر خطتك' },
    sub:              { fr: 'Commencez gratuitement, évoluez quand vous voulez', ar: 'ابدأ مجاناً، وتطور متى شئت' },
    monthly:          { fr: 'Mensuel',                               ar: 'شهري' },
    annual:           { fr: 'Annuel',                                ar: 'سنوي' },
    save20:           { fr: '-20%',                                  ar: '-20%' },
    simpleName:       { fr: 'Simple',                                ar: 'بسيط' },
    free:             { fr: 'Gratuit',                               ar: 'مجاني' },
    launchOffer:      { fr: 'Au lancement (période limitée)',        ar: 'عند الإطلاق (فترة محدودة)' },
    simpleFeats: {
      fr: [
        'Profil business complet',
        '3 photos maximum',
        'Bouton WhatsApp + téléphone',
        'Apparition dans la recherche',
        'Avis clients visibles'
      ],
      ar: [
        'ملف عملي تجاري كامل',
        '3 صور كحد أقصى',
        'زر واتساب + الهاتف',
        'الظهور في البحث',
        'التقييمات مرئية للعملاء'
      ]
    },
    proName:          { fr: 'Pro',                                   ar: 'برو' },
    recommended:      { fr: 'Recommandé',                            ar: 'موصى به' },
    daMonth:          { fr: 'DA/mois',                               ar: 'دج/شهر' },
    daYearSave:       { fr: "DA/an — 20% d'économie",                ar: 'دج/سنة — توفير 20%' },
    allSimplePlus:    { fr: 'Tout du Plan Simple, plus :',           ar: 'كل ما في الخطة البسيطة، بالإضافة إلى:' },
    proExtra: {
      fr: [
        'Photos illimitées + Vidéos',
        'Badge Premium visible',
        'Priorité dans les résultats',
        'Mis en avant sur la homepage',
        'Statistiques : vues, clics, favoris',
        'Graphiques 7j / 30j / 90j',
        'Support prioritaire'
      ],
      ar: [
        'صور وفيديوهات غير محدودة',
        'شارة Premium مرئية',
        'أولوية في النتائج',
        'إبراز في الصفحة الرئيسية',
        'إحصائيات: المشاهدات، النقرات، المفضلة',
        'رسوم بيانية 7أيام / 30يوم / 90يوم',
        'دعم ذو أولوية'
      ]
    },
    activating:       { fr: 'Activation...',                         ar: 'جارٍ التفعيل...' },
    continueWith:     { fr: 'Continuer avec le plan',                ar: 'المتابعة بخطة' },
    changeAnytime:    { fr: 'Changement de plan possible à tout moment depuis votre dashboard', ar: 'تغيير الخطة ممكن في أي وقت من لوحة التحكم' },
    proActivated:     { fr: 'Plan Pro activé ! Bienvenue.',          ar: 'تم تفعيل خطة Pro! أهلاً بك.' },
    simpleActivated:  { fr: 'Plan Simple activé. Bienvenue sur Sanne DZ !', ar: 'تم تفعيل الخطة البسيطة. أهلاً بك في Sanne DZ!' },
  },

  // ===== DASHBOARD LAYOUTS =====
  partnerLayout: {
    title: { fr: 'Espace Partenaire', ar: 'مساحة الشريك' },
  },
  clientLayout: {
    title: { fr: 'Espace Client', ar: 'مساحة العميل' },
  },

  // ===== PARTNER DASHBOARD =====
  partnerStats: {
    title:            { fr: 'Statistiques',                          ar: 'الإحصائيات' },
    sub:              { fr: 'Performances de votre profil — 30 derniers jours', ar: 'أداء ملفك الشخصي — آخر 30 يوماً' },
    proFeature:       { fr: 'Fonctionnalité Pro',                    ar: 'ميزة Pro' },
    proDesc:          { fr: 'Les statistiques détaillées sont réservées aux partenaires du Plan Pro.', ar: 'الإحصائيات التفصيلية مخصصة لشركاء خطة Pro.' },
    upgradePro:       { fr: 'Passer au Plan Pro',                    ar: 'الترقية إلى خطة Pro' },
    viewsMonth:       { fr: 'Vues ce mois',                          ar: 'مشاهدات هذا الشهر' },
    clicksWa:         { fr: 'Clics WhatsApp',                        ar: 'نقرات واتساب' },
    favorites:        { fr: 'Favoris',                               ar: 'المفضلة' },
    newReviews:       { fr: 'Nouveaux avis',                         ar: 'تقييمات جديدة' },
    viewsChart:       { fr: 'Vues par jour (7 derniers jours)',      ar: 'المشاهدات يومياً (آخر 7 أيام)' },
    clicksChart:      { fr: 'Clics WhatsApp par jour',               ar: 'نقرات واتساب يومياً' },
    days: {
      fr: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      ar: ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح']
    }
  },

  partnerSettings: {
    title:            { fr: 'Paramètres du compte',                  ar: 'إعدادات الحساب' },
    sub:              { fr: 'Gérez vos préférences de compte et de sécurité', ar: 'إدارة تفضيلات حسابك وأمانك' },
    security:         { fr: 'Sécurité',                              ar: 'الأمان' },
    newPwd:           { fr: 'Nouveau mot de passe',                  ar: 'كلمة مرور جديدة' },
    confirmPwd:       { fr: 'Confirmer le mot de passe',             ar: 'تأكيد كلمة المرور' },
    save:             { fr: 'Enregistrer les modifications',         ar: 'حفظ التغييرات' },
    saving:           { fr: 'Sauvegarde...',                         ar: 'جارٍ الحفظ...' },
    successMsg:       { fr: 'Paramètres mis à jour !',               ar: 'تم تحديث الإعدادات!' },
  },

  partnerPortfolio: {
    title:            { fr: 'Portfolio photos',                      ar: 'معرض الصور' },
    sub:              { fr: 'photos',                                ar: 'صور' },
    simpleLimit:      { fr: '(Plan Simple : max 3)',                 ar: '(خطة بسيطة: أقصى حد 3)' },
    limitReached:     { fr: 'Limite atteinte — Passez au Plan Pro pour des photos illimitées + vidéos', ar: 'تم الوصول للحد الأقصى — قم بالترقية لخطة Pro لصور وفيديوهات غير محدودة' },
    upgradePro:       { fr: 'Passer Pro',                            ar: 'الترقية لـ Pro' },
    dragDrop:         { fr: 'Glisser-déposer ou cliquer pour ajouter',ar: 'اسحب وأفلت أو انقر للإضافة' },
    formats:          { fr: 'JPG, PNG, WEBP — Max 5 MB par photo',   ar: 'JPG، PNG، WEBP — حد أقصى 5 ميجابايت للصور' },
    noPhotos:         { fr: 'Aucune photo encore. Ajoutez vos premières réalisations !', ar: 'لا توجد صور بعد. أضف إنجازاتك الأولى!' },
    tip:              { fr: 'Astuce : La première photo sera utilisée comme photo principale sur votre profil. Faites glisser pour réorganiser.', ar: 'نصيحة: سيتم استخدام الصورة الأولى كصورة رئيسية في ملفك الشخصي. اسحب لإعادة الترتيب.' },
    mainPhoto:        { fr: 'Principale',                            ar: 'الرئيسية' },
    deletedMsg:       { fr: 'Photo supprimée.',                      ar: 'تم حذف الصورة.' },
    addedMsg:         { fr: 'Photo ajoutée ! (simulation)',          ar: 'تمت إضافة الصورة! (محاكاة)' },
    maxReachedMsg:    { fr: 'Maximum atteint.',                      ar: 'تم الوصول للحد الأقصى.' },
  },

  // ===== CLIENT DASHBOARD =====
  clientSettings: {
    title:            { fr: 'Paramètres du compte',                  ar: 'إعدادات الحساب' },
    sub:              { fr: 'Gérez vos préférences de compte et de sécurité', ar: 'إدارة تفضيلات حسابك وأمانك' },
    security:         { fr: 'Sécurité',                              ar: 'الأمان' },
    oldPwd:           { fr: 'Ancien mot de passe',                   ar: 'كلمة المرور القديمة' },
    newPwd:           { fr: 'Nouveau mot de passe',                  ar: 'كلمة مرور جديدة' },
    confirmNewPwd:    { fr: 'Confirmer le nouveau mot de passe',     ar: 'تأكيد كلمة المرور الجديدة' },
    save:             { fr: 'Enregistrer les modifications',         ar: 'حفظ التغييرات' },
    saving:           { fr: 'Sauvegarde...',                         ar: 'جارٍ الحفظ...' },
    successMsg:       { fr: 'Paramètres mis à jour !',               ar: 'تم تحديث الإعدادات!' },
  },

  clientNotifications: {
    title:            { fr: 'Notifications',                         ar: 'الإشعارات' },
    unreadSub:        { fr: 'non lue',                               ar: 'غير مقروءة' },
    unreadSubPlural:  { fr: 'non lues',                              ar: 'غير مقروءة' },
    markAllRead:      { fr: 'Tout marquer comme lu',                 ar: 'تحديد الكل كمقروء' },
    noNotifsTitle:    { fr: 'Aucune notification',                   ar: 'لا توجد إشعارات' },
    noNotifsSub:      { fr: 'Vous êtes à jour !',                    ar: 'أنت على اطلاع دائم!' },
  },

  // ===== ADMIN DASHBOARD =====
  adminLayout: {
    title: { fr: 'Administration', ar: 'الإدارة' },
  },

  adminSubscriptions: {
    title:          { fr: 'Abonnements & Tarification', ar: 'الاشتراكات والتسعير' },
    sub:            { fr: 'Vue financière et gestion interactive des plans partenaires', ar: 'نظرة عامة مالية وإدارة تفاعلية لخطط الشركاء' },
    revenueMonth:   { fr: 'Revenus ce mois', ar: 'عائدات هذا الشهر' },
    vsLastMonth:    { fr: 'vs mois dernier', ar: 'مقارنة بالشهر الماضي' },
    proPartners:    { fr: 'Partenaires Pro', ar: 'شركاء Pro' },
    activeSubs:     { fr: 'abonnés actifs', ar: 'المشتركون النشطون' },
    revenueYear:    { fr: 'Revenus annuels estimés', ar: 'العائدات السنوية المقدرة' },
    configTitle:    { fr: 'Configuration des tarifs', ar: 'إعدادات التسعير' },
    simpleMonthly:  { fr: 'Plan Simple Mensuel (DA)', ar: 'خطة بسيطة شهرياً (د.ج)' },
    simpleAnnual:   { fr: 'Plan Simple Annuel (DA)', ar: 'خطة بسيطة سنوياً (د.ج)' },
    proMonthly:     { fr: 'Plan Pro Mensuel (DA)', ar: 'خطة Pro شهرياً (د.ج)' },
    proAnnual:      { fr: 'Plan Pro Annuel (DA)', ar: 'خطة Pro سنوياً (د.ج)' },
    cancel:         { fr: 'Annuler', ar: 'إلغاء' },
    save:           { fr: 'Enregistrer', ar: 'حفظ' },
    saving:         { fr: 'Sauvegarde...', ar: 'جارٍ الحفظ...' },
    planBreakdown:  { fr: 'Répartition des plans', ar: 'توزيع الخطط' },
    manageSubs:     { fr: 'Gestion des abonnements', ar: 'إدارة الاشتراكات' },
    searchPartner:  { fr: 'Rechercher un partenaire...', ar: 'ابحث عن شريك...' },
    noPartnerFound: { fr: 'Aucun partenaire trouvé', ar: 'لم يتم العثور على أي شريك' },
    downgrade:      { fr: 'Passer Simple', ar: 'التحويل للمجاني' },
    upgrade:        { fr: 'Upgrader Pro', ar: 'ترقية إلى Pro' },
    proMsg:         { fr: 'est maintenant Pro !', ar: 'أصبح الآن Pro!' },
    simpleMsg:      { fr: 'repasse en Simple.', ar: 'عاد إلى الخطة البسيطة.' },
    configUpdated:  { fr: 'Tarifs mis à jour avec succès !', ar: 'تم تحديث الأسعار بنجاح!' },
  },

  adminStats: {
    title:              { fr: 'Statistiques globales', ar: 'إحصائيات عامة' },
    sub:                { fr: 'Vue d\'ensemble de la plateforme Sanne DZ', ar: 'نظرة عامة على منصة Sanne DZ' },
    totalRevenue:       { fr: 'Revenus totaux générés', ar: 'إجمالي الإيرادات المحققة' },
    simpleMonthly:      { fr: 'Plan Simple mensuel', ar: 'الخطة البسيطة شهرياً' },
    proAnnual:          { fr: 'Plan Pro annuel', ar: 'خطة Pro سنوياً' },
    vsLastMonth:        { fr: 'vs mois dernier', ar: 'مقارنة بالشهر الماضي' },
    totalPartners:      { fr: 'Total partenaires', ar: 'إجمالي الشركاء' },
    clientsReg:         { fr: 'Clients inscrits', ar: 'العملاء المسجلون' },
    reviewsPub:         { fr: 'Avis publiés', ar: 'التقييمات المنشورة' },
    activeWilayas:      { fr: 'Wilayas actives', ar: 'الولايات النشطة' },
    thisMonth:          { fr: 'ce mois', ar: 'هذا الشهر' },
    topWilayas:         { fr: 'Top wilayas par partenaires', ar: 'أفضل الولايات حسب الشركاء' },
    topCategories:      { fr: 'Top catégories par partenaires', ar: 'أفضل الفئات حسب الشركاء' },
    activationRate:     { fr: 'Taux d\'activation partenaires', ar: 'معدل تفعيل الشركاء' },
    completeProfiles:   { fr: 'profils complets', ar: 'الملفات المكتملة' },
    avgRating:          { fr: 'Note moyenne globale', ar: 'متوسط التقييم العام' },
    onAllReviews:       { fr: 'sur tous les avis', ar: 'على جميع التقييمات' },
    proRate:            { fr: 'Taux Pro', ar: 'نسبة الـ Pro' },
    ofPartners:         { fr: 'des partenaires', ar: 'من الشركاء' },
  },

  adminSettings: {
    title:          { fr: 'Paramètres de la plateforme', ar: 'إعدادات المنصة' },
    sub:            { fr: 'Gérez les informations globales (Footer, Contacts, Réseaux sociaux)', ar: 'إدارة المعلومات العامة (التذييل، جهات الاتصال، الشبكات الاجتماعية)' },
    contactInfo:    { fr: 'Coordonnées', ar: 'معلومات الاتصال' },
    address:        { fr: 'Adresse physique', ar: 'العنوان الفعلي' },
    phone:          { fr: 'Téléphone', ar: 'الهاتف' },
    whatsapp:       { fr: 'WhatsApp', ar: 'واتساب' },
    email:          { fr: 'Email de contact', ar: 'البريد الإلكتروني' },
    socials:        { fr: 'Réseaux Sociaux & Liens', ar: 'الشبكات الاجتماعية والروابط' },
    facebook:       { fr: 'Facebook', ar: 'فيسبوك' },
    instagram:      { fr: 'Instagram', ar: 'إنستغرام' },
    tiktok:         { fr: 'TikTok', ar: 'تيك توك' },
    save:           { fr: 'Sauvegarder', ar: 'حفظ' },
    saving:         { fr: 'Sauvegarde...', ar: 'جارٍ الحفظ...' },
    successMsg:     { fr: 'Paramètres mis à jour avec succès !', ar: 'تم تحديث الإعدادات بنجاح!' },
  },

  adminReviews: {
    title:          { fr: 'Gestion des avis', ar: 'إدارة التقييمات' },
    sub:            { fr: 'avis publiés sur la plateforme', ar: 'التقييمات المنشورة على المنصة' },
    search:         { fr: 'Rechercher...', ar: 'بحث...' },
    noReviews:      { fr: 'Aucun avis trouvé', ar: 'لم يتم العثور على تقييمات' },
    deleteTitle:    { fr: 'Supprimer l\'avis', ar: 'حذف التقييم' },
    deleteConfirm:  { fr: 'Êtes-vous sûr de vouloir supprimer cet avis ?', ar: 'هل أنت متأكد أنك تريد حذف هذا التقييم؟' },
    deleteWarning:  { fr: 'Cette action est irréversible et l\'avis sera retiré du profil du partenaire.', ar: 'هذا الإجراء لا رجعة فيه وسيتم إزالة التقييم من ملف الشريك.' },
    cancel:         { fr: 'Annuler', ar: 'إلغاء' },
    delete:         { fr: 'Supprimer', ar: 'حذف' },
    deletedMsg:     { fr: 'Avis supprimé avec succès !', ar: 'تم حذف التقييم بنجاح!' },
    viewListing:    { fr: 'Voir l\'annonce', ar: 'عرض الإعلان' },
  },

  adminPartners: {
    title:          { fr: 'Gestion des partenaires', ar: 'إدارة الشركاء' },
    sub:            { fr: 'partenaires au total', ar: 'إجمالي الشركاء' },
    filterAll:      { fr: 'Tous', ar: 'الكل' },
    filterPending:  { fr: 'En attente', ar: 'قيد الانتظار' },
    filterActive:   { fr: 'Actifs', ar: 'نشط' },
    filterSuspended:{ fr: 'Suspendus', ar: 'موقوف' },
    colBusiness:    { fr: 'Business', ar: 'العمل' },
    colWilaya:      { fr: 'Wilaya', ar: 'الولاية' },
    colCategory:    { fr: 'Catégorie', ar: 'الفئة' },
    colPlan:        { fr: 'Plan', ar: 'الخطة' },
    colStatus:      { fr: 'Statut', ar: 'الحالة' },
    colDate:        { fr: 'Date d\'inscription', ar: 'تاريخ التسجيل' },
    colActions:     { fr: 'Actions', ar: 'إجراءات' },
    planPro:        { fr: 'Pro', ar: 'برو' },
    planSimple:     { fr: 'Simple', ar: 'بسيط' },
    statusActive:   { fr: 'Actif', ar: 'نشط' },
    statusPending:  { fr: 'En attente', ar: 'قيد الانتظار' },
    statusSuspended:{ fr: 'Suspendu', ar: 'موقوف' },
    noPartners:     { fr: 'Aucun partenaire trouvé', ar: 'لم يتم العثور على أي شريك' },
    suspendTitle:   { fr: 'Suspendre le partenaire', ar: 'إيقاف الشريك' },
    suspendConfirm: { fr: 'Êtes-vous sûr de vouloir suspendre ce partenaire ? Il n\'apparaîtra plus dans les résultats de recherche et ne pourra plus recevoir de demandes.', ar: 'هل أنت متأكد أنك تريد إيقاف هذا الشريك؟ لن يظهر بعد الآن في نتائج البحث ولن يتمكن من تلقي الطلبات.' },
    suspendYes:     { fr: 'Oui, suspendre', ar: 'نعم، إيقاف' },
    cancel:         { fr: 'Annuler', ar: 'إلغاء' },
    approvedMsg:    { fr: 'Partenaire approuvé !', ar: 'تمت الموافقة على الشريك!' },
    suspendedMsg:   { fr: 'Partenaire suspendu.', ar: 'تم إيقاف الشريك.' },
  },

  adminNotifications: {
    title:          { fr: 'Notifications Admin', ar: 'إشعارات الإدارة' },
    sub:            { fr: 'Envoyez des messages groupés aux utilisateurs', ar: 'إرسال رسائل جماعية للمستخدمين' },
    newNotif:       { fr: 'Nouvelle notification', ar: 'إشعار جديد' },
    compose:        { fr: 'Composer une notification', ar: 'كتابة إشعار' },
    target:         { fr: 'Cible *', ar: 'الهدف *' },
    targetAll:      { fr: 'Tous les utilisateurs', ar: 'جميع المستخدمين' },
    targetPartners: { fr: 'Partenaires uniquement', ar: 'الشركاء فقط' },
    targetClients:  { fr: 'Clients uniquement', ar: 'العملاء فقط' },
    targetSpecific: { fr: 'Utilisateur(s) spécifique(s)', ar: 'مستخدم(ين) محدد(ين)' },
    emailsField:    { fr: 'Emails des destinataires *', ar: 'رسائل البريد الإلكتروني للمستلمين *' },
    emailsPlaceholder: { fr: 'Ex: user1@gmail.com, user2@yahoo.com', ar: 'مثال: user1@gmail.com, user2@yahoo.com' },
    refineBy:       { fr: 'Affiner par', ar: 'تصفية حسب' },
    wilayaOpt:      { fr: 'Wilaya (optionnel)', ar: 'الولاية (اختياري)' },
    allWilayas:     { fr: 'Toutes les wilayas', ar: 'جميع الولايات' },
    catOpt:         { fr: 'Catégorie (optionnel)', ar: 'الفئة (اختياري)' },
    allCats:        { fr: 'Toutes les catégories', ar: 'جميع الفئات' },
    titleField:     { fr: 'Titre *', ar: 'العنوان *' },
    titlePlaceholder: { fr: 'Ex: Nouvelle fonctionnalité disponible !', ar: 'مثال: ميزة جديدة متاحة!' },
    messageField:   { fr: 'Message *', ar: 'الرسالة *' },
    messagePlaceholder: { fr: 'Corps de la notification...', ar: 'نص الإشعار...' },
    send:           { fr: 'Envoyer', ar: 'إرسال' },
    sending:        { fr: 'Envoi...', ar: 'جاري الإرسال...' },
    cancel:         { fr: 'Annuler', ar: 'إلغاء' },
    historyTitle:   { fr: 'Historique des envois', ar: 'سجل الإرسال' },
    recipients:     { fr: 'destinataires', ar: 'مستلم' },
    noResults:      { fr: 'Aucun résultat', ar: 'لا توجد نتائج' },
    noNotifs:       { fr: 'Aucune notification envoyée', ar: 'لم يتم إرسال أي إشعار' },
    deleteTitle:    { fr: 'Supprimer la notification', ar: 'حذف الإشعار' },
    deleteConfirm:  { fr: 'Êtes-vous sûr de vouloir supprimer cet élément ?', ar: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟' },
    deleteWarning:  { fr: 'L\'historique de cet envoi sera effacé définitivement.', ar: 'سيتم مسح سجل هذا الإرسال نهائيًا.' },
    delete:         { fr: 'Supprimer', ar: 'حذف' },
    sentMsgPart1:   { fr: 'Notification envoyée à', ar: 'تم إرسال الإشعار إلى' },
    deletedMsg:     { fr: 'Notification supprimée de l\'historique !', ar: 'تم حذف الإشعار من السجل!' },
  },

  adminCategories: {
    title:          { fr: 'Catégories', ar: 'الفئات' },
    sub:            { fr: 'Gérez les catégories principales de la plateforme', ar: 'إدارة الفئات الرئيسية للمنصة' },
    addCategory:    { fr: 'Ajouter une catégorie', ar: 'إضافة فئة' },
    catName:        { fr: 'Nom de la catégorie', ar: 'اسم الفئة' },
    create:         { fr: 'Créer', ar: 'إنشاء' },
    otherText:      { fr: 'Autre (Texte)', ar: 'أخرى (نص)' },
    iconPlaceholder:{ fr: 'Icône...', ar: 'أيقونة...' },
    noCategories:   { fr: 'Aucune catégorie', ar: 'لا توجد فئات' },
    partnersAssoc:  { fr: 'partenaires associés', ar: 'شركاء مرتبطون' },
    editTitle:      { fr: 'Éditer', ar: 'تعديل' },
    deleteTitleBtn: { fr: 'Supprimer', ar: 'حذف' },
    deleteTitle:    { fr: 'Supprimer la catégorie', ar: 'حذف الفئة' },
    deleteConfirm:  { fr: 'Êtes-vous sûr de vouloir supprimer cet élément ? Toutes les données associées seront perdues. Cette action est irréversible.', ar: 'هل أنت متأكد أنك تريد حذف هذا العنصر؟ ستفقد جميع البيانات المرتبطة. هذا الإجراء لا رجعة فيه.' },
    deleteYes:      { fr: 'Oui, supprimer', ar: 'نعم، حذف' },
    cancel:         { fr: 'Annuler', ar: 'إلغاء' },
    existsName:     { fr: 'Ce nom existe déjà !', ar: 'هذا الاسم موجود بالفعل!' },
    addedMsg:       { fr: 'Catégorie ajoutée !', ar: 'تمت إضافة الفئة!' },
    usedName:       { fr: 'Ce nom est déjà utilisé !', ar: 'هذا الاسم مستخدم بالفعل!' },
    editedMsg:      { fr: 'Catégorie modifiée !', ar: 'تم تعديل الفئة!' },
    deletedMsg:     { fr: 'Catégorie supprimée !', ar: 'تم حذف الفئة!' },
  },

  // ===== ADMIN CLIENTS =====
  adminClients: {
    title:         { fr: 'Gestion des clients',                                ar: 'إدارة العملاء' },
    sub:           { fr: 'clients inscrits',                                   ar: 'عميل مسجل' },
    search:        { fr: 'Nom, email, wilaya...',                              ar: 'الاسم، البريد، الولاية...' },
    colClient:     { fr: 'Client',                                             ar: 'العميل' },
    colWilaya:     { fr: 'Wilaya',                                             ar: 'الولاية' },
    colReviews:    { fr: 'Avis',                                               ar: 'التقييمات' },
    colFavorites:  { fr: 'Favoris',                                            ar: 'المفضلة' },
    colJoined:     { fr: 'Inscrit le',                                         ar: 'تاريخ الانضمام' },
    colActions:    { fr: 'Actions',                                             ar: 'الإجراءات' },
    contact:       { fr: 'Contacter',                                          ar: 'تواصل' },
    block:         { fr: 'Bloquer',                                            ar: 'حظر' },
    noClients:     { fr: 'Aucun client trouvé',                                ar: 'لا يوجد عملاء' },
    reviewsOf:     { fr: 'Avis de',                                            ar: 'تقييمات' },
    noReviews:     { fr: "Cet utilisateur n'a laissé aucun avis.",             ar: 'لم يترك هذا المستخدم أي تقييم.' },
    blockTitle:    { fr: 'Bloquer le client',                                  ar: 'حظر العميل' },
    blockConfirm:  { fr: 'Êtes-vous sûr de vouloir bloquer ce client ?',      ar: 'هل أنت متأكد من حظر هذا العميل؟' },
    blockDesc:     { fr: "Il ne pourra plus se connecter ni laisser d'avis.", ar: 'لن يتمكن من تسجيل الدخول أو ترك تقييمات.' },
    cancel:        { fr: 'Annuler',                                            ar: 'إلغاء' },
    blockYes:      { fr: 'Oui, bloquer',                                       ar: 'نعم، احظر' },
    blockedMsg:    { fr: 'Client bloqué avec succès.',                         ar: 'تم حظر العميل بنجاح.' },
  },

  // ===== ADMIN EXPORT =====
  adminExport: {
    title:         { fr: 'Export des données',                                 ar: 'تصدير البيانات' },
    sub:           { fr: 'Téléchargez les données de la plateforme en CSV ou Excel', ar: 'تنزيل بيانات المنصة بصيغة CSV أو Excel' },
    period:        { fr: "Période d'export",                                   ar: 'فترة التصدير' },
    from:          { fr: 'Du',                                                 ar: 'من' },
    to:            { fr: 'Au',                                                 ar: 'إلى' },
    partnersTitle: { fr: 'Partenaires',                                        ar: 'الشركاء' },
    partnersDesc:  { fr: 'Nom, wilaya, catégorie, plan, statut, contact',      ar: 'الاسم، الولاية، الفئة، الخطة، الحالة، جهة الاتصال' },
    clientsTitle:  { fr: 'Clients',                                            ar: 'العملاء' },
    clientsDesc:   { fr: "Nom, email, wilaya, date d'inscription",             ar: 'الاسم، البريد، الولاية، تاريخ التسجيل' },
    reviewsTitle:  { fr: 'Avis',                                               ar: 'التقييمات' },
    reviewsDesc:   { fr: 'Auteur, partenaire, note, commentaire, statut',      ar: 'المؤلف، الشريك، التقييم، التعليق، الحالة' },
    subsTitle:     { fr: 'Abonnements',                                        ar: 'الاشتراكات' },
    subsDesc:      { fr: 'Partenaire, plan, montant, date de renouvellement',  ar: 'الشريك، الخطة، المبلغ، تاريخ التجديد' },
    exportingBtn:  { fr: 'Export en cours...',                                 ar: 'جارٍ التصدير...' },
    note:          { fr: 'Les exports sont générés en temps réel. Les fichiers contiennent uniquement les données de la période sélectionnée. Les données sensibles (mots de passe) ne sont jamais exportées.', ar: 'يتم إنشاء الملفات في الوقت الفعلي وتحتوي فقط على بيانات الفترة المحددة. لا يتم تصدير البيانات الحساسة (كلمات المرور) أبداً.' },
    exportedMsg:   { fr: 'Export téléchargé !',                               ar: 'تم تنزيل الملف!' },
  },

  // ===== PAGE PARTENAIRE (public) =====
  partnerPage: {
    back:              { fr: 'Retour',                            ar: 'رجوع' },
    premiumBadge:      { fr: 'Partenaire Premium',               ar: 'شريك مميز' },
    reviews:           { fr: 'avis',                             ar: 'تقييم' },
    views:             { fr: 'vues',                             ar: 'مشاهدة' },
    call:              { fr: 'Appeler',                          ar: 'اتصال' },
    quickInfoTitle:    { fr: 'Infos rapides',                    ar: 'معلومات سريعة' },
    infoCategory:      { fr: 'Catégorie',                        ar: 'الفئة' },
    infoWilaya:        { fr: 'Wilaya',                           ar: 'الولاية' },
    infoRating:        { fr: 'Note',                             ar: 'التقييم' },
    infoReviews:       { fr: 'Avis',                             ar: 'التقييمات' },
    infoPlan:          { fr: 'Plan',                             ar: 'الخطة' },
    infoPlanPro:       { fr: '✨ Partenaire Pro',                ar: '✨ شريك Pro' },
    infoPlanStd:       { fr: 'Standard',                         ar: 'عادي' },
    clientReviews:     { fr: 'avis clients',                     ar: 'تقييم عميل' },
  },

  // ===== PORTFOLIO TABS =====
  portfolioTabs: {
    tabRealisations: { fr: 'Réalisations',          ar: 'الأعمال' },
    tabServices:     { fr: 'Services',               ar: 'الخدمات' },
    tabInfos:        { fr: 'Informations',           ar: 'المعلومات' },
    tabAvis:         { fr: 'Avis',                   ar: 'التقييمات' },
    // Réalisations tab
    realizTitle:     { fr: 'Nos réalisations',       ar: 'أعمالنا' },
    galleryTitle:    { fr: 'Galerie Portfolio',      ar: 'معرض الأعمال' },
    beforeAfter:     { fr: 'Avant / Après',          ar: 'قبل / بعد' },
    before:          { fr: 'Avant',                  ar: 'قبل' },
    after:           { fr: 'Après',                  ar: 'بعد' },
    faqTitle:        { fr: 'Questions fréquentes',   ar: 'أسئلة شائعة' },
    // Services tab
    servicesTitle:   { fr: 'Services proposés',      ar: 'الخدمات المتاحة' },
    pricingTitle:    { fr: 'Tarifs & services',      ar: 'الأسعار والخدمات' },
    // Infos tab
    practicalTitle:  { fr: 'Informations pratiques', ar: 'معلومات عملية' },
    labelWilaya:     { fr: 'Wilaya',                 ar: 'الولاية' },
    labelPhone:      { fr: 'Téléphone',              ar: 'الهاتف' },
    labelDelivery:   { fr: 'Livraison',              ar: 'التوصيل' },
    deliveryVal:     { fr: 'Disponible sur demande', ar: 'متاح عند الطلب' },
    labelDelay:      { fr: 'Délai moyen',            ar: 'المدة المتوسطة' },
    delayVal:        { fr: '7 à 21 jours selon commande', ar: '7 إلى 21 يوماً حسب الطلب' },
    conditionsTitle: { fr: 'Conditions',             ar: 'الشروط' },
    condMinOrder:    { fr: 'Commande minimum',       ar: 'الحد الأدنى للطلب' },
    condMinOrderVal: { fr: 'Aucune',                 ar: 'لا يوجد' },
    condRemote:      { fr: 'Travail à distance',     ar: 'العمل عن بُعد' },
    condRemoteVal:   { fr: 'Accepté',                ar: 'مقبول' },
    condAppt:        { fr: 'Rendez-vous obligatoire', ar: 'موعد مسبق' },
    condApptVal:     { fr: 'Recommandé',             ar: 'موصى به' },
    condDelivery:    { fr: 'Livraison disponible',   ar: 'التوصيل متاح' },
    condDeliveryVal: { fr: 'Oui',                    ar: 'نعم' },
    scheduleTitle:   { fr: "Horaires d'ouverture",   ar: 'أوقات العمل' },
    today:           { fr: "aujourd'hui",            ar: 'اليوم' },
    closed:          { fr: 'Fermé',                  ar: 'مغلق' },
    aboutTitle:      { fr: 'À propos',               ar: 'عن الشريك' },
    rcLabel:         { fr: 'Registre de commerce :', ar: 'السجل التجاري:' },
    // Days
    monday:          { fr: 'Lundi',                  ar: 'الإثنين' },
    tuesday:         { fr: 'Mardi',                  ar: 'الثلاثاء' },
    wednesday:       { fr: 'Mercredi',               ar: 'الأربعاء' },
    thursday:        { fr: 'Jeudi',                  ar: 'الخميس' },
    friday:          { fr: 'Vendredi',               ar: 'الجمعة' },
    saturday:        { fr: 'Samedi',                 ar: 'السبت' },
    sunday:          { fr: 'Dimanche',               ar: 'الأحد' },
  },

  // ===== CONTACT BUTTONS =====
  contactButtons: {
    contactTitle:    { fr: 'Contacter',              ar: 'تواصل مع' },
    whatsappBtn:     { fr: 'Envoyer un message WhatsApp', ar: 'إرسال رسالة واتساب' },
    callBtn:         { fr: 'Appeler :',              ar: 'اتصل:' },
    save:            { fr: 'Sauvegarder',            ar: 'حفظ' },
    saved:           { fr: 'Sauvegardé',             ar: 'تم الحفظ' },
    noAccount:       { fr: 'Contact direct — aucune inscription requise', ar: 'تواصل مباشر — لا حاجة للتسجيل' },
    callMobile:      { fr: 'Appeler',                ar: 'اتصال' },
  },
} as const

// ===================================================================
// Helper type pour accéder aux traductions
// ===================================================================
export type Translations = typeof translations
