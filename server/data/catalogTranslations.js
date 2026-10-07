const TRANSLATED_LANGS = ['ru', 'uz', 'ar', 'tr'];

const PRODUCT_NAMES = {
  'Wholesale Chain Bundle': {
    ru: 'Оптовый набор цепей', uz: "Ulgurji zanjirlar to'plami", ar: 'مجموعة سلاسل بالجملة', tr: 'Toptan Zincir Seti',
  },
  'Classic Cuban Link Chain': {
    ru: 'Классическая кубинская цепь', uz: 'Klassik kuba zanjiri', ar: 'سلسلة كوبية كلاسيكية', tr: 'Klasik Küba Zinciri',
  },
  'Rope Chain 22K': {
    ru: 'Цепь «Корда» 22K', uz: 'Arqon zanjir 22K', ar: 'سلسلة مجدولة عيار 22K', tr: 'Halat Zincir 22K',
  },
  'Singapore Chain 18K': {
    ru: 'Цепь «Сингапур» 18K', uz: 'Singapur zanjiri 18K', ar: 'سلسلة سنغافورية عيار 18K', tr: 'Singapur Zincir 18K',
  },
  'Traditional Gold Bangle': {
    ru: 'Традиционный золотой браслет', uz: "An'anaviy oltin bilaguzuk", ar: 'سوار ذهبي تقليدي', tr: 'Geleneksel Altın Bilezik',
  },
  'Plain Gold Kada': {
    ru: 'Гладкий золотой браслет-када', uz: 'Silliq oltin kada', ar: 'سوار كادا ذهبي سادة', tr: 'Düz Altın Kada',
  },
  'Heavy Kada 22K': {
    ru: 'Массивный браслет-када 22K', uz: "Og'ir kada 22K", ar: 'سوار كادا ثقيل عيار 22K', tr: 'Ağır Kada 22K',
  },
  'Machine Cut Bangle': {
    ru: 'Браслет машинной огранки', uz: 'Mashina kesimli bilaguzuk', ar: 'سوار بقص آلي', tr: 'Makine Kesim Bilezik',
  },
  'Figaro Chain 18K': {
    ru: 'Цепь «Фигаро» 18K', uz: 'Figaro zanjiri 18K', ar: 'سلسلة فيغارو عيار 18K', tr: 'Figaro Zincir 18K',
  },
  'Box Chain 14K': {
    ru: 'Цепь «Венецианка» 14K', uz: 'Kvadrat zanjir 14K', ar: 'سلسلة صندوقية عيار 14K', tr: 'Kutu Zincir 14K',
  },
  'Curb Chain 22K': {
    ru: 'Панцирная цепь 22K', uz: 'Panser zanjir 22K', ar: 'سلسلة كيرب عيار 22K', tr: 'Gurmet Zincir 22K',
  },
  'Snake Chain 18K': {
    ru: 'Цепь «Снейк» 18K', uz: 'Ilon zanjir 18K', ar: 'سلسلة الأفعى عيار 18K', tr: 'Yılan Zincir 18K',
  },
  'Mariner Chain 14K': {
    ru: 'Якорная цепь 14K', uz: 'Langar zanjir 14K', ar: 'سلسلة بحرية عيار 14K', tr: 'Denizci Zincir 14K',
  },
  'Designer Bangle Set': {
    ru: 'Дизайнерский набор браслетов', uz: "Dizaynerlik bilaguzuklar to'plami", ar: 'طقم أساور مصممة', tr: 'Tasarım Bilezik Seti',
  },
  '18K Gold Bangle Pair': {
    ru: 'Пара золотых браслетов 18K', uz: '18K oltin bilaguzuklar jufti', ar: 'زوج أساور ذهبية عيار 18K', tr: '18K Altın Bilezik Çifti',
  },
  '14K Lightweight Bangle': {
    ru: 'Лёгкий браслет 14K', uz: '14K yengil bilaguzuk', ar: 'سوار خفيف عيار 14K', tr: '14K Hafif Bilezik',
  },
  'Heritage Rope Chain': {
    ru: 'Цепь «Корда» Наследие', uz: 'Meros arqon zanjiri', ar: 'سلسلة مجدولة تراثية', tr: 'Miras Halat Zincir',
  },
  'Figaro Chain Necklace': {
    ru: 'Колье-цепь «Фигаро»', uz: 'Figaro zanjirli marjon', ar: 'قلادة سلسلة فيغارو', tr: 'Figaro Zincir Kolye',
  },
  'Box Chain — Slim': {
    ru: 'Цепь «Венецианка» — тонкая', uz: 'Kvadrat zanjir — ingichka', ar: 'سلسلة صندوقية — رفيعة', tr: 'Kutu Zincir — İnce',
  },
  '22K Gold Rope Chain': {
    ru: 'Золотая цепь «Корда» 22K', uz: '22K oltin arqon zanjir', ar: 'سلسلة ذهبية مجدولة عيار 22K', tr: '22K Altın Halat Zincir',
  },
  'Cuban Link — Medium': {
    ru: 'Кубинская цепь — средняя', uz: "Kuba zanjiri — o'rtacha", ar: 'سلسلة كوبية — متوسطة', tr: 'Küba Zinciri — Orta',
  },
  'Layered Figaro Chain': {
    ru: 'Многослойная цепь «Фигаро»', uz: "Ko'p qatlamli Figaro zanjiri", ar: 'سلسلة فيغارو متعددة الطبقات', tr: 'Katmanlı Figaro Zincir',
  },
  'Bold Box Chain': {
    ru: 'Массивная цепь «Венецианка»', uz: "Yo'g'on kvadrat zanjir", ar: 'سلسلة صندوقية عريضة', tr: 'Kalın Kutu Zincir',
  },
  'Delicate Rope Chain': {
    ru: 'Изящная цепь «Корда»', uz: 'Nafis arqon zanjir', ar: 'سلسلة مجدولة رقيقة', tr: 'Zarif Halat Zincir',
  },
  'Statement Cuban Link': {
    ru: 'Эффектная кубинская цепь', uz: "Ko'zga tashlanadigan kuba zanjiri", ar: 'سلسلة كوبية لافتة', tr: 'Gösterişli Küba Zinciri',
  },
  "Men's Figaro Chain": {
    ru: 'Мужская цепь «Фигаро»', uz: 'Erkaklar uchun Figaro zanjiri', ar: 'سلسلة فيغارو رجالية', tr: 'Erkek Figaro Zincir',
  },
  "Women's Box Chain": {
    ru: 'Женская цепь «Венецианка»', uz: 'Ayollar uchun kvadrat zanjir', ar: 'سلسلة صندوقية نسائية', tr: 'Kadın Kutu Zincir',
  },
  'Classic Plain Bangle': {
    ru: 'Классический гладкий браслет', uz: 'Klassik silliq bilaguzuk', ar: 'سوار سادة كلاسيكي', tr: 'Klasik Düz Bilezik',
  },
  'Traditional Kada Bangle': {
    ru: 'Традиционный браслет-када', uz: "An'anaviy kada bilaguzuk", ar: 'سوار كادا تقليدي', tr: 'Geleneksel Kada Bilezik',
  },
  'Hinged Bangle — Polished': {
    ru: 'Браслет на шарнире — полированный', uz: 'Sharnirli bilaguzuk — sayqallangan', ar: 'سوار بمفصلة — مصقول', tr: 'Menteşeli Bilezik — Parlak',
  },
  'Stackable Bangle Set': {
    ru: 'Набор комбинируемых браслетов', uz: "Ustma-ust taqiladigan bilaguzuklar to'plami", ar: 'طقم أساور قابلة للتنسيق', tr: 'Kombinlenebilir Bilezik Seti',
  },
  '22K Classic Bangle Pair': {
    ru: 'Пара классических браслетов 22K', uz: '22K klassik bilaguzuklar jufti', ar: 'زوج أساور كلاسيكية عيار 22K', tr: '22K Klasik Bilezik Çifti',
  },
  'Engraved Kada Bangle': {
    ru: 'Гравированный браслет-када', uz: "O'ymakor kada bilaguzuk", ar: 'سوار كادا منقوش', tr: 'Gravürlü Kada Bilezik',
  },
  'Slim Hinged Bangle': {
    ru: 'Тонкий браслет на шарнире', uz: 'Ingichka sharnirli bilaguzuk', ar: 'سوار رفيع بمفصلة', tr: 'İnce Menteşeli Bilezik',
  },
  'Minimal Stackable Bangle': {
    ru: 'Минималистичный комбинируемый браслет', uz: 'Minimalistik ustma-ust bilaguzuk', ar: 'سوار بسيط قابل للتنسيق', tr: 'Minimal Kombinlenebilir Bilezik',
  },
  'Bridal Classic Bangle Set': {
    ru: 'Свадебный набор классических браслетов', uz: "Kelinlik klassik bilaguzuklar to'plami", ar: 'طقم أساور كلاسيكية للعروس', tr: 'Gelin Klasik Bilezik Seti',
  },
  "Men's Kada Bangle": {
    ru: 'Мужской браслет-када', uz: 'Erkaklar kada bilaguzugi', ar: 'سوار كادا رجالي', tr: 'Erkek Kada Bilezik',
  },
  'Diamond-Cut Hinged Bangle': {
    ru: 'Браслет на шарнире с алмазной гранью', uz: 'Olmos kesimli sharnirli bilaguzuk', ar: 'سوار بمفصلة بقص الماس', tr: 'Elmas Kesim Menteşeli Bilezik',
  },
  'Gold Stackable Trio': {
    ru: 'Трио комбинируемых золотых браслетов', uz: 'Uchta ustma-ust oltin bilaguzuk', ar: 'ثلاثية أساور ذهبية قابلة للتنسيق', tr: 'Altın Kombin Bilezik Üçlüsü',
  },
};

const TYPE_TERMS = {
  chain: {
    ru: { one: 'Профессиональная золотая цепь', many: 'золотые цепи', premium: 'Премиальные золотые цепи', shopMany: 'премиальные золотые цепи' },
    uz: { one: 'oltin zanjir', many: 'oltin zanjirlar' },
    ar: { one: 'سلسلة ذهبية احترافية', many: 'سلاسل ذهبية', premium: 'سلاسل ذهبية فاخرة' },
    tr: { one: 'altın zincir', many: 'altın zincirler' },
  },
  bangle: {
    ru: { one: 'Профессиональный золотой браслет', many: 'золотые браслеты', premium: 'Премиальные золотые браслеты', shopMany: 'премиальные золотые браслеты' },
    uz: { one: 'oltin bilaguzuk', many: 'oltin bilaguzuklar' },
    ar: { one: 'سوار ذهبي احترافي', many: 'أساور ذهبية', premium: 'أساور ذهبية فاخرة' },
    tr: { one: 'altın bilezik', many: 'altın bilezikler' },
  },
};

const typeOf = (word) => (word.startsWith('bangle') ? 'bangle' : 'chain');

// Each pattern must capture the product's English name as `name`; `karat` and `type` are optional.
const PRODUCT_TEXT_TEMPLATES = {
  description: [
    {
      pattern: /^The (?<name>.+) is manufactured at our Namangan facility for international gold and jewellery business partners\.$/,
      render: {
        ru: ({ name }) => `${name} производится на нашем предприятии в Намангане для международных партнёров в сфере золота и ювелирного бизнеса.`,
        uz: ({ name }) => `${name} Namangandagi korxonamizda xalqaro oltin va zargarlik biznesi hamkorlari uchun ishlab chiqariladi.`,
        ar: ({ name }) => `يتم تصنيع ${name} في منشأتنا في نمنغان لشركاء أعمال الذهب والمجوهرات الدوليين.`,
        tr: ({ name }) => `${name}, Namangan'daki tesisimizde uluslararası altın ve mücevher iş ortakları için üretilmektedir.`,
      },
    },
    {
      pattern: /^The (?<name>.+) is precision-crafted at our Namangan facility for international jewelry partners and discerning customers worldwide\.$/,
      render: {
        ru: ({ name }) => `${name} изготавливается с высокой точностью на нашем предприятии в Намангане для международных ювелирных партнёров и взыскательных клиентов по всему миру.`,
        uz: ({ name }) => `${name} Namangandagi korxonamizda xalqaro zargarlik hamkorlari va butun dunyodagi talabchan mijozlar uchun yuqori aniqlikda tayyorlanadi.`,
        ar: ({ name }) => `يتم تصنيع ${name} بدقة عالية في منشأتنا في نمنغان لشركاء المجوهرات الدوليين والعملاء المميزين حول العالم.`,
        tr: ({ name }) => `${name}, Namangan'daki tesisimizde uluslararası mücevher ortakları ve dünya genelindeki seçkin müşteriler için hassasiyetle üretilmektedir.`,
      },
    },
  ],
  shortDescription: [
    {
      pattern: /^Professional (?<karat>\d+K) gold (?<type>chain|bangle) — manufactured by Modern Gold for international buyers\.$/,
      render: {
        ru: ({ karat, type }) => `${TYPE_TERMS[type].ru.one} ${karat} — производство Modern Gold для международных покупателей.`,
        uz: ({ karat, type }) => `Professional ${karat} ${TYPE_TERMS[type].uz.one} — xalqaro xaridorlar uchun Modern Gold tomonidan ishlab chiqarilgan.`,
        ar: ({ karat, type }) => `${TYPE_TERMS[type].ar.one} عيار ${karat} — من تصنيع Modern Gold للمشترين الدوليين.`,
        tr: ({ karat, type }) => `Profesyonel ${karat} ${TYPE_TERMS[type].tr.one} — uluslararası alıcılar için Modern Gold tarafından üretilmiştir.`,
      },
    },
    {
      pattern: /^Premium Gold (?<type>chains|bangles) — manufactured by Modern Gold Jewelry\.$/,
      render: {
        ru: ({ type }) => `${TYPE_TERMS[type].ru.premium} — производство Modern Gold Jewelry.`,
        uz: ({ type }) => `Premium ${TYPE_TERMS[type].uz.many} — Modern Gold Jewelry ishlab chiqarishi.`,
        ar: ({ type }) => `${TYPE_TERMS[type].ar.premium} — من تصنيع Modern Gold Jewelry.`,
        tr: ({ type }) => `Premium ${TYPE_TERMS[type].tr.many} — Modern Gold Jewelry üretimi.`,
      },
    },
  ],
  seoTitle: [
    {
      pattern: /^(?<name>.+) \| (?<brand>Modern Gold(?: Jewelry)?)$/,
      render: {
        ru: ({ name, brand }) => `${name} | ${brand}`,
        uz: ({ name, brand }) => `${name} | ${brand}`,
        ar: ({ name, brand }) => `${name} | ${brand}`,
        tr: ({ name, brand }) => `${name} | ${brand}`,
      },
    },
  ],
  seoDescription: [
    {
      pattern: /^(?<name>.+) — (?<karat>\d+K) gold (?<type>chains|bangles) from Modern Gold, Central Asia\.$/,
      render: {
        ru: ({ name, karat, type }) => `${name} — ${TYPE_TERMS[type].ru.many} ${karat} от Modern Gold, Центральная Азия.`,
        uz: ({ name, karat, type }) => `${name} — Modern Gold'dan ${karat} ${TYPE_TERMS[type].uz.many}, Markaziy Osiyo.`,
        ar: ({ name, karat, type }) => `${name} — ${TYPE_TERMS[type].ar.many} عيار ${karat} من Modern Gold، آسيا الوسطى.`,
        tr: ({ name, karat, type }) => `${name} — Modern Gold'dan ${karat} ${TYPE_TERMS[type].tr.many}, Orta Asya.`,
      },
    },
    {
      pattern: /^Shop (?<name>.+) — premium Gold (?<type>chains|bangles) from Modern Gold Jewelry Manufacturing, Uzbekistan\.$/,
      render: {
        ru: ({ name, type }) => `Купите ${name} — ${TYPE_TERMS[type].ru.shopMany} от Modern Gold Jewelry Manufacturing, Узбекистан.`,
        uz: ({ name, type }) => `${name} xarid qiling — Modern Gold Jewelry Manufacturing'dan premium ${TYPE_TERMS[type].uz.many}, O'zbekiston.`,
        ar: ({ name, type }) => `تسوّق ${name} — ${TYPE_TERMS[type].ar.premium} من Modern Gold Jewelry Manufacturing، أوزبكستان.`,
        tr: ({ name, type }) => `${name} satın alın — Modern Gold Jewelry Manufacturing'den premium ${TYPE_TERMS[type].tr.many}, Özbekistan.`,
      },
    },
  ],
};

const BLOG_POSTS = {
  'choose-perfect-engagement-ring': {
    en: { title: 'How to Choose the Perfect Engagement Ring' },
    ru: {
      title: 'Как выбрать идеальное помолвочное кольцо',
      excerpt: 'Руководство по выбору помолвочного кольца для вашей коллекции.',
      content: 'Выбор помолвочного кольца — одно из самых значимых решений для ювелирных ритейлеров и партнёров. Modern Gold Jewelry предлагает точно изготовленные кольца-солитеры и кольца с бриллиантами, произведённые в Узбекистане для международных рынков.',
    },
    uz: {
      title: 'Ideal unashuv uzugini qanday tanlash kerak',
      excerpt: "Kolleksiyangiz uchun unashuv uzugini tanlash bo'yicha qo'llanma.",
      content: "Unashuv uzugini tanlash zargarlik chakana sotuvchilari va hamkorlari uchun eng muhim qarorlardan biridir. Modern Gold Jewelry O'zbekistonda xalqaro bozorlar uchun yuqori aniqlikda ishlab chiqarilgan solitar va olmosli uzuklarni taklif etadi.",
    },
    ar: {
      title: 'كيف تختار خاتم الخطوبة المثالي',
      excerpt: 'دليل لاختيار خاتم الخطوبة لمجموعتك.',
      content: 'يُعد اختيار خاتم الخطوبة من أهم القرارات لتجار المجوهرات وشركائهم. تقدم Modern Gold Jewelry خواتم سوليتير وخواتم ألماس مصنوعة بدقة في أوزبكستان للأسواق الدولية.',
    },
    tr: {
      title: 'Mükemmel Nişan Yüzüğü Nasıl Seçilir',
      excerpt: 'Koleksiyonunuz için nişan yüzüğü seçme rehberi.',
      content: "Nişan yüzüğü seçmek, mücevher perakendecileri ve iş ortakları için en anlamlı kararlardan biridir. Modern Gold Jewelry, uluslararası pazarlar için Özbekistan'da hassasiyetle üretilmiş tek taş ve pırlanta yüzükler sunar.",
    },
  },
  'gold-jewellery-care-tips': {
    en: { title: 'Gold Jewelry Care Tips' },
    ru: {
      title: 'Советы по уходу за золотыми украшениями',
      excerpt: 'Сохраняйте блеск золотых украшений на долгие годы.',
      content: 'Правильный уход помогает золотым украшениям сохранять блеск. Поделитесь этими советами с клиентами, чтобы сохранить премиальное качество изделий Modern Gold Jewelry.',
    },
    uz: {
      title: "Oltin taqinchoqlarni parvarish qilish bo'yicha maslahatlar",
      excerpt: 'Oltin taqinchoqlaringiz yillar davomida yaltirab tursin.',
      content: "To'g'ri parvarish oltin taqinchoqlarning jilosini saqlaydi. Modern Gold Jewelry buyumlarining premium sifatini saqlash uchun ushbu maslahatlarni mijozlaringiz bilan baham ko'ring.",
    },
    ar: {
      title: 'نصائح للعناية بالمجوهرات الذهبية',
      excerpt: 'حافظ على لمعان مجوهراتك الذهبية لسنوات.',
      content: 'العناية الصحيحة تحافظ على بريق المجوهرات الذهبية. شارك هذه النصائح مع عملائك للحفاظ على الجودة الفاخرة لقطع Modern Gold Jewelry.',
    },
    tr: {
      title: 'Altın Mücevher Bakım İpuçları',
      excerpt: 'Altın mücevherlerinizin yıllarca parlamasını sağlayın.',
      content: 'Doğru bakım, altın mücevherlerin parlaklığını korumasını sağlar. Modern Gold Jewelry parçalarının premium kalitesini korumak için bu ipuçlarını müşterilerinizle paylaşın.',
    },
  },
  'international-jewelry-trends': {
    en: { title: 'International Jewelry Manufacturing Trends' },
    ru: {
      title: 'Международные тренды ювелирного производства',
      excerpt: 'Тренды, формирующие мировое ювелирное производство.',
      content: 'От минималистичных дизайнов до эффектных свадебных коллекций — международные ювелирные рынки продолжают развиваться. Modern Gold Jewelry остаётся в авангарде производственного мастерства.',
    },
    uz: {
      title: 'Xalqaro zargarlik ishlab chiqarishi tendensiyalari',
      excerpt: 'Jahon zargarlik ishlab chiqarishini shakllantirayotgan tendensiyalar.',
      content: "Minimalistik dizaynlardan tortib ko'zga tashlanadigan kelinlik kolleksiyalarigacha — xalqaro zargarlik bozorlari rivojlanishda davom etmoqda. Modern Gold Jewelry ishlab chiqarish mukammalligida yetakchi bo'lib qolmoqda.",
    },
    ar: {
      title: 'اتجاهات تصنيع المجوهرات الدولية',
      excerpt: 'الاتجاهات التي تشكّل صناعة المجوهرات عالميًا.',
      content: 'من التصاميم البسيطة إلى مجموعات الزفاف اللافتة، تواصل أسواق المجوهرات الدولية تطورها. وتبقى Modern Gold Jewelry في طليعة التميز في التصنيع.',
    },
    tr: {
      title: 'Uluslararası Mücevher Üretim Trendleri',
      excerpt: 'Küresel mücevher üretimini şekillendiren trendler.',
      content: 'Minimalist tasarımlardan gösterişli gelin koleksiyonlarına kadar uluslararası mücevher pazarları gelişmeye devam ediyor. Modern Gold Jewelry, üretim mükemmelliğinde öncü olmaya devam ediyor.',
    },
  },
  'choose-perfect-gold-chain': {
    en: { title: 'How to Choose the Perfect Gold Chain' },
    ru: {
      title: 'Как выбрать идеальную золотую цепь',
      excerpt: 'Руководство по выбору золотых цепей для вашей коллекции.',
      content: 'Выбор золотой цепи зависит от длины, типа плетения и пробы. Modern Gold Jewelry производит в Намангане цепи плетений «корда», «кубинское», «фигаро» и «венецианка» для международных рынков.',
    },
    uz: {
      title: 'Ideal oltin zanjirni qanday tanlash kerak',
      excerpt: "Kolleksiyangiz uchun oltin zanjir tanlash bo'yicha qo'llanma.",
      content: "Oltin zanjirni tanlash uzunlik, to'qima turi va karatga bog'liq. Modern Gold Jewelry Namanganda xalqaro bozorlar uchun arqon, kuba, figaro va kvadrat zanjirlar ishlab chiqaradi.",
    },
    ar: {
      title: 'كيف تختار السلسلة الذهبية المثالية',
      excerpt: 'دليل لاختيار السلاسل الذهبية لمجموعتك.',
      content: 'يعتمد اختيار السلسلة الذهبية على الطول ونوع الحلقات والعيار. تصنع Modern Gold Jewelry في نمنغان السلاسل المجدولة والكوبية والفيغارو والصندوقية للأسواق الدولية.',
    },
    tr: {
      title: 'Mükemmel Altın Zincir Nasıl Seçilir',
      excerpt: 'Koleksiyonunuz için altın zincir seçme rehberi.',
      content: "Altın zincir seçimi uzunluğa, örgü stiline ve ayara bağlıdır. Modern Gold Jewelry, uluslararası pazarlar için Namangan'da halat, Küba, figaro ve kutu zincirler üretir.",
    },
  },
  'gold-chain-bangle-care-tips': {
    en: { title: 'Gold Chain & Bangle Care Tips' },
    ru: {
      title: 'Советы по уходу за золотыми цепями и браслетами',
      excerpt: 'Сохраняйте блеск золотых цепей и браслетов на долгие годы.',
      content: 'Правильный уход помогает золотым цепям и браслетам сохранять блеск. Поделитесь этими советами с клиентами, чтобы сохранить премиальное качество изделий Modern Gold Jewelry.',
    },
    uz: {
      title: "Oltin zanjir va bilaguzuklarni parvarish qilish bo'yicha maslahatlar",
      excerpt: 'Oltin zanjir va bilaguzuklaringiz yillar davomida yaltirab tursin.',
      content: "To'g'ri parvarish oltin zanjir va bilaguzuklarning jilosini saqlaydi. Modern Gold Jewelry buyumlarining premium sifatini saqlash uchun ushbu maslahatlarni mijozlaringiz bilan baham ko'ring.",
    },
    ar: {
      title: 'نصائح للعناية بالسلاسل والأساور الذهبية',
      excerpt: 'حافظ على لمعان سلاسلك وأساورك الذهبية لسنوات.',
      content: 'العناية الصحيحة تحافظ على بريق السلاسل والأساور الذهبية. شارك هذه النصائح مع عملائك للحفاظ على الجودة الفاخرة لقطع Modern Gold Jewelry.',
    },
    tr: {
      title: 'Altın Zincir ve Bilezik Bakım İpuçları',
      excerpt: 'Altın zincir ve bileziklerinizin yıllarca parlamasını sağlayın.',
      content: 'Doğru bakım, altın zincir ve bileziklerin parlaklığını korumasını sağlar. Modern Gold Jewelry parçalarının premium kalitesini korumak için bu ipuçlarını müşterilerinizle paylaşın.',
    },
  },
  'international-chain-bangle-trends': {
    en: { title: 'International Chain & Bangle Trends' },
    ru: {
      title: 'Международные тренды цепей и браслетов',
      excerpt: 'Тренды, формирующие мировое производство золотых цепей и браслетов.',
      content: 'От кубинских цепей до комбинируемых браслетов — международные ювелирные рынки продолжают развиваться. Modern Gold Jewelry специализируется на цепях и браслетах, изготовленных в Узбекистане.',
    },
    uz: {
      title: 'Xalqaro zanjir va bilaguzuk tendensiyalari',
      excerpt: 'Jahon oltin zanjir va bilaguzuk ishlab chiqarishini shakllantirayotgan tendensiyalar.',
      content: "Kuba zanjirlaridan tortib ustma-ust taqiladigan bilaguzuklargacha — xalqaro zargarlik bozorlari rivojlanishda davom etmoqda. Modern Gold Jewelry O'zbekistonda tayyorlangan zanjir va bilaguzuklarga ixtisoslashgan.",
    },
    ar: {
      title: 'اتجاهات السلاسل والأساور الدولية',
      excerpt: 'الاتجاهات التي تشكّل صناعة السلاسل والأساور الذهبية عالميًا.',
      content: 'من السلاسل الكوبية إلى الأساور القابلة للتنسيق، تواصل أسواق المجوهرات الدولية تطورها. وتتخصص Modern Gold Jewelry في السلاسل والأساور المصنوعة في أوزبكستان.',
    },
    tr: {
      title: 'Uluslararası Zincir ve Bilezik Trendleri',
      excerpt: 'Küresel altın zincir ve bilezik üretimini şekillendiren trendler.',
      content: "Küba zincirlerinden kombinlenebilir bileziklere kadar uluslararası mücevher pazarları gelişmeye devam ediyor. Modern Gold Jewelry, Özbekistan'da üretilen zincir ve bileziklerde uzmanlaşmıştır.",
    },
  },
};

function renderProductText(field, englishText, englishName, lang) {
  if (!englishText) return undefined;
  for (const template of PRODUCT_TEXT_TEMPLATES[field] || []) {
    const match = englishText.match(template.pattern);
    if (!match) continue;
    const groups = { ...match.groups };
    if (groups.name !== undefined && groups.name !== englishName) continue;
    if (groups.type) groups.type = typeOf(groups.type);
    groups.name = PRODUCT_NAMES[englishName][lang];
    return template.render[lang](groups);
  }
  return undefined;
}

function buildProductTranslation(product, lang) {
  const name = PRODUCT_NAMES[product.name]?.[lang];
  if (!name) return null;
  const result = { name };
  for (const field of ['description', 'shortDescription', 'seoTitle', 'seoDescription']) {
    const text = renderProductText(field, product[field], product.name, lang);
    if (text) result[field] = text;
  }
  return result;
}

function buildBlogTranslation(blog, lang) {
  const entry = BLOG_POSTS[blog.slug];
  if (!entry || entry.en.title !== blog.title) return null;
  return entry[lang] || null;
}

module.exports = {
  TRANSLATED_LANGS,
  PRODUCT_NAMES,
  PRODUCT_TEXT_TEMPLATES,
  BLOG_POSTS,
  buildProductTranslation,
  buildBlogTranslation,
};
