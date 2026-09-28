const fs = require('fs');
const path = require('path');

const fileContent = `// ─────────────────────────────────────────────────────────────────────────────
// KrishiDrishti — All-India Comprehensive Agro-Meteorological Mock Data
// 12 States × 2 Districts × 6 Blocks × 4 Panchayats = 576 Panchayats
// Covering Himalayan, Indo-Gangetic, Central, Deccan, Ghats, Delta & Northeast
// ─────────────────────────────────────────────────────────────────────────────

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const randRange = (min, max) => min + rand() * (max - min);
const randInt = (min, max) => Math.round(randRange(min, max));
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

// ── 12 States & 24 Districts across all Indian agro-climatic zones ───────────
export const stateDefinitions = [
  {
    id: 'uttarakhand', name: 'Uttarakhand', nameHi: 'उत्तराखंड',
    center: [30.07, 79.0], zoom: 8,
    districts: [
      {
        id: 'dehradun', name: 'Dehradun', nameHi: 'देहरादून',
        center: [30.35, 78.0], zoom: 10,
        bounds: { minLat: 30.10, maxLat: 30.70, minLng: 77.62, maxLng: 78.22 },
        climate: { baseTempH: 30, baseTempL: 18, baseRain: 12, zone: 'sub_himalayan' },
        blocks: [
          { id: 'chakrata', name: 'Chakrata', nameHi: 'चकराता', sector: [0.35, -0.15], baseElev: 2100, elevVar: 400, tempAdj: -10, rainAdj: 6, landTypes: ['dense_forest','sparse_forest','alpine_meadow','mixed_agriculture'], pNames: [{name:'Deoban',nameHi:'देओबन'},{name:'Lokhandi',nameHi:'लोखंडी'},{name:'Kimona',nameHi:'किमोना'},{name:'Budher',nameHi:'बुधेर'}] },
          { id: 'kalsi', name: 'Kalsi', nameHi: 'कालसी', sector: [0.25, 0.2], baseElev: 850, elevVar: 250, tempAdj: -2, rainAdj: 2, landTypes: ['river_valley','mixed_agriculture','sparse_forest','terrace_farming'], pNames: [{name:'Sahiya',nameHi:'साहिया'},{name:'Kheri',nameHi:'खेरी'},{name:'Badasi',nameHi:'बदासी'},{name:'Mohand',nameHi:'मोहंड'}] },
          { id: 'vikasnagar', name: 'Vikasnagar', nameHi: 'विकासनगर', sector: [0.0, -0.3], baseElev: 620, elevVar: 180, tempAdj: 1, rainAdj: 0, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Thalisain',nameHi:'थालीसैन'},{name:'Badsahikhera',nameHi:'बादशाहीखेरा'},{name:'Selaqui',nameHi:'सेलाकुई'},{name:'Raiwala',nameHi:'रायवाला'}] },
          { id: 'sahaspur', name: 'Sahaspur', nameHi: 'सहसपुर', sector: [0.05, 0.05], baseElev: 520, elevVar: 150, tempAdj: 3, rainAdj: -2, landTypes: ['periurban','irrigated_cropland','wetland','mixed_agriculture'], pNames: [{name:'Mothronwala',nameHi:'मोठरोंवाला'},{name:'Lacchiwala',nameHi:'लच्छीवाला'},{name:'Hariyawala',nameHi:'हरियावाला'},{name:'Premnagar',nameHi:'प्रेमनगर'}] },
          { id: 'raipur', name: 'Raipur', nameHi: 'रायपुर', sector: [-0.25, 0.25], baseElev: 430, elevVar: 100, tempAdj: 5, rainAdj: -4, landTypes: ['urban','periurban','irrigated_cropland','scrubland'], pNames: [{name:'Pondha',nameHi:'पोंधा'},{name:'Guniyal Gaon',nameHi:'गुणियाल गाँव'},{name:'Jolly Grant',nameHi:'जॉली ग्रांट'},{name:'Daat Kali',nameHi:'दात काली'}] },
          { id: 'doiwala', name: 'Doiwala', nameHi: 'डोईवाला', sector: [-0.35, -0.15], baseElev: 380, elevVar: 80, tempAdj: 6, rainAdj: -5, landTypes: ['irrigated_cropland','rainfed_cropland','plantation','periurban'], pNames: [{name:'Bhagwanpur',nameHi:'भगवानपुर'},{name:'Nepali Farm',nameHi:'नेपाली फार्म'},{name:'Shyampur',nameHi:'श्यामपुर'},{name:'Rajeev Nagar',nameHi:'राजीव नगर'}] },
        ],
      },
      {
        id: 'haridwar', name: 'Haridwar', nameHi: 'हरिद्वार',
        center: [29.95, 78.16], zoom: 10,
        bounds: { minLat: 29.65, maxLat: 30.25, minLng: 77.80, maxLng: 78.40 },
        climate: { baseTempH: 34, baseTempL: 22, baseRain: 8, zone: 'gangetic_plain' },
        blocks: [
          { id: 'roorkee', name: 'Roorkee', nameHi: 'रुड़की', sector: [0.25, -0.2], baseElev: 268, elevVar: 40, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','urban','periurban','mixed_agriculture'], pNames: [{name:'Manglaur',nameHi:'मंगलौर'},{name:'Landhaura',nameHi:'लंढौरा'},{name:'Bhagwanpur',nameHi:'भगवानपुर'},{name:'Jhabrehra',nameHi:'झबरेहरा'}] },
          { id: 'laksar', name: 'Laksar', nameHi: 'लक्सर', sector: [0.25, 0.25], baseElev: 230, elevVar: 30, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','wetland','mixed_agriculture'], pNames: [{name:'Sultanpur',nameHi:'सुल्तानपुर'},{name:'Pathri',nameHi:'पथरी'},{name:'Shahpur',nameHi:'शाहपुर'},{name:'Libarheri',nameHi:'लिबड़हेड़ी'}] },
          { id: 'narsan', name: 'Narsan', nameHi: 'नारसन', sector: [-0.05, -0.25], baseElev: 290, elevVar: 50, tempAdj: -1, rainAdj: 2, landTypes: ['mixed_agriculture','river_valley','irrigated_cropland','plantation'], pNames: [{name:'Kankhal',nameHi:'कनखल'},{name:'Aurangabad',nameHi:'औरंगाबाद'},{name:'Shivrajpur',nameHi:'शिवराजपुर'},{name:'Bahadurpur',nameHi:'बहादुरपुर'}] },
          { id: 'bhagwanpur_h', name: 'Bhagwanpur', nameHi: 'भगवानपुर', sector: [-0.05, 0.2], baseElev: 245, elevVar: 35, tempAdj: 2, rainAdj: -2, landTypes: ['irrigated_cropland','rainfed_cropland','periurban','scrubland'], pNames: [{name:'Biharigarh',nameHi:'बिहारीगढ़'},{name:'Rasoolpur',nameHi:'रसूलपुर'},{name:'Mohabewala',nameHi:'मोहबेवाला'},{name:'Daulatpur',nameHi:'दौलतपुर'}] },
          { id: 'bahadrabad', name: 'Bahadrabad', nameHi: 'बहादराबाद', sector: [-0.3, -0.15], baseElev: 255, elevVar: 45, tempAdj: 0, rainAdj: 1, landTypes: ['mixed_agriculture','irrigated_cropland','river_valley','periurban'], pNames: [{name:'BHEL Township',nameHi:'भेल टाउनशिप'},{name:'Sidcul',nameHi:'सिडकुल'},{name:'Roshnabad',nameHi:'रोशनाबाद'},{name:'Jamalpur',nameHi:'जमालपुर'}] },
          { id: 'khanpur', name: 'Khanpur', nameHi: 'खानपुर', sector: [-0.3, 0.25], baseElev: 240, elevVar: 30, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Sherpur',nameHi:'शेरपुर'},{name:'Alipur',nameHi:'अलीपुर'},{name:'Nagla Imarti',nameHi:'नगला इमारती'},{name:'Maheshwala',nameHi:'महेशवाला'}] },
        ],
      },
    ],
  },
  {
    id: 'punjab', name: 'Punjab', nameHi: 'पंजाब',
    center: [31.15, 75.34], zoom: 8,
    districts: [
      {
        id: 'ludhiana', name: 'Ludhiana', nameHi: 'लुधियाना',
        center: [30.9, 75.85], zoom: 10,
        bounds: { minLat: 30.60, maxLat: 31.20, minLng: 75.50, maxLng: 76.10 },
        climate: { baseTempH: 36, baseTempL: 24, baseRain: 5, zone: 'indo_gangetic' },
        blocks: [
          { id: 'ludhiana_e', name: 'Ludhiana East', nameHi: 'लुधियाना पूर्व', sector: [0.25, 0.2], baseElev: 244, elevVar: 20, tempAdj: 1, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Salem Tabri',nameHi:'सलेम टाबरी'},{name:'Haibowal',nameHi:'हैबोवाल'},{name:'Dhandari',nameHi:'धंधारी'},{name:'Gill Village',nameHi:'गिल गाँव'}] },
          { id: 'ludhiana_w', name: 'Ludhiana West', nameHi: 'लुधियाना पश्चिम', sector: [0.25, -0.2], baseElev: 248, elevVar: 15, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','urban','mixed_agriculture','plantation'], pNames: [{name:'Jagraon',nameHi:'जगराओं'},{name:'Raikot',nameHi:'रायकोट'},{name:'Mullanpur',nameHi:'मुल्लांपुर'},{name:'Dakha',nameHi:'दाखा'}] },
          { id: 'khanna', name: 'Khanna', nameHi: 'खन्ना', sector: [-0.05, 0.25], baseElev: 260, elevVar: 25, tempAdj: -1, rainAdj: 1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','periurban'], pNames: [{name:'Samrala',nameHi:'समराला'},{name:'Doraha',nameHi:'दोराहा'},{name:'Payal',nameHi:'पायल'},{name:'Machiwara',nameHi:'माछीवाड़ा'}] },
          { id: 'jagraon', name: 'Jagraon', nameHi: 'जगराओं', sector: [-0.05, -0.25], baseElev: 232, elevVar: 18, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','rainfed_cropland','scrubland'], pNames: [{name:'Sidhwan Bet',nameHi:'सिधवां बेट'},{name:'Sudhar',nameHi:'सुधार'},{name:'Lohian',nameHi:'लोहियां'},{name:'Hathur',nameHi:'हठूर'}] },
          { id: 'sahnewal', name: 'Sahnewal', nameHi: 'सहनेवाल', sector: [-0.3, 0.15], baseElev: 250, elevVar: 20, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','periurban','mixed_agriculture','plantation'], pNames: [{name:'Lalton Kalan',nameHi:'लालटोन कलां'},{name:'Mundian',nameHi:'मुंडियां'},{name:'Koom Kalan',nameHi:'कूम कलां'},{name:'Mangli',nameHi:'मंगली'}] },
          { id: 'mangat', name: 'Mangat', nameHi: 'मंगट', sector: [-0.3, -0.15], baseElev: 240, elevVar: 15, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Bassian',nameHi:'बस्सियां'},{name:'Maloud',nameHi:'मालौद'},{name:'Katani',nameHi:'कटानी'},{name:'Ranwan',nameHi:'रणवां'}] },
        ],
      },
      {
        id: 'amritsar', name: 'Amritsar', nameHi: 'अमृतसर',
        center: [31.63, 74.87], zoom: 10,
        bounds: { minLat: 31.33, maxLat: 31.93, minLng: 74.57, maxLng: 75.17 },
        climate: { baseTempH: 37, baseTempL: 25, baseRain: 4, zone: 'indo_gangetic' },
        blocks: [
          { id: 'amritsar_n', name: 'Amritsar North', nameHi: 'अमृतसर उत्तर', sector: [0.3, 0.0], baseElev: 234, elevVar: 15, tempAdj: -1, rainAdj: 1, landTypes: ['irrigated_cropland','urban','periurban','mixed_agriculture'], pNames: [{name:'Verka',nameHi:'वेरका'},{name:'Chogawan',nameHi:'छोगावां'},{name:'Lopoke',nameHi:'लोपोके'},{name:'Majitha',nameHi:'मजीठा'}] },
          { id: 'amritsar_s', name: 'Amritsar South', nameHi: 'अमृतसर दक्षिण', sector: [-0.3, 0.0], baseElev: 228, elevVar: 12, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','rainfed_cropland','periurban'], pNames: [{name:'Attari',nameHi:'अटारी'},{name:'Jandiala',nameHi:'जंडियाला'},{name:'Baba Bakala',nameHi:'बाबा बकाला'},{name:'Rayya',nameHi:'रैय्या'}] },
          { id: 'tarn_taran', name: 'Tarn Taran', nameHi: 'तरन तारन', sector: [-0.1, -0.25], baseElev: 220, elevVar: 18, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Patti',nameHi:'पट्टी'},{name:'Khem Karan',nameHi:'खेम करण'},{name:'Bhikhiwind',nameHi:'भिखीविंड'},{name:'Naushera Pannuan',nameHi:'नौशेरा पन्नुआं'}] },
          { id: 'ajnala', name: 'Ajnala', nameHi: 'अजनाला', sector: [0.15, -0.25], baseElev: 225, elevVar: 14, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','rainfed_cropland','river_valley'], pNames: [{name:'Ramdass',nameHi:'रामदास'},{name:'Gharinda',nameHi:'घरिंडा'},{name:'Fatehpur',nameHi:'फतेहपुर'},{name:'Dera Baba Nanak',nameHi:'डेरा बाबा नानक'}] },
          { id: 'harsha_cheena', name: 'Harsha Cheena', nameHi: 'हरशा छीना', sector: [0.15, 0.25], baseElev: 230, elevVar: 16, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','scrubland'], pNames: [{name:'Naushehra',nameHi:'नौशेहरा'},{name:'Khalchian',nameHi:'खालचियां'},{name:'Chola Sahib',nameHi:'छोला साहिब'},{name:'Kathunangal',nameHi:'कठुनंगल'}] },
          { id: 'mehta', name: 'Mehta', nameHi: 'मेहता', sector: [-0.15, 0.25], baseElev: 222, elevVar: 12, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Sri Hargobindpur',nameHi:'श्री हरगोबिंदपुर'},{name:'Butala',nameHi:'बुटाला'},{name:'Sarhali Mandan',nameHi:'सरहाली मंडन'},{name:'Nagoke',nameHi:'नगोके'}] },
        ],
      },
    ],
  },
  {
    id: 'uttar_pradesh', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश',
    center: [26.85, 80.95], zoom: 7,
    districts: [
      {
        id: 'lucknow', name: 'Lucknow', nameHi: 'लखनऊ',
        center: [26.85, 80.95], zoom: 10,
        bounds: { minLat: 26.55, maxLat: 27.15, minLng: 80.65, maxLng: 81.25 },
        climate: { baseTempH: 36, baseTempL: 23, baseRain: 9, zone: 'central_plain' },
        blocks: [
          { id: 'bakshi_talab', name: 'Bakshi Ka Talab', nameHi: 'बख्शी का तालाब', sector: [0.25, -0.15], baseElev: 123, elevVar: 15, tempAdj: -1, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','periurban','mixed_agriculture'], pNames: [{name:'Itaunja',nameHi:'इटौंजा'},{name:'Kathwara',nameHi:'कठवारा'},{name:'Mahona',nameHi:'महोना'},{name:'Bhaisamau',nameHi:'भैसामऊ'}] },
          { id: 'chinhat', name: 'Chinhat', nameHi: 'चिनहट', sector: [0.15, 0.25], baseElev: 120, elevVar: 12, tempAdj: 1, rainAdj: -1, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Gauri',nameHi:'गौरी'},{name:'Juggaur',nameHi:'जुग्गौर'},{name:'Uattardhona',nameHi:'उत्तरधौना'},{name:'Malhaur',nameHi:'मल्हौर'}] },
          { id: 'sarojininagar', name: 'Sarojini Nagar', nameHi: 'सरोजिनी नगर', sector: [-0.15, -0.2], baseElev: 122, elevVar: 10, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','plantation'], pNames: [{name:'Banthra',nameHi:'बंथरा'},{name:'Piparsand',nameHi:'पीपरसंड'},{name:'Harakh',nameHi:'हरख'},{name:'Bhatgaon',nameHi:'भातगाँव'}] },
          { id: 'mohanlalganj', name: 'Mohanlalganj', nameHi: 'मोहनलालगंज', sector: [-0.25, 0.15], baseElev: 118, elevVar: 14, tempAdj: 1, rainAdj: 1, landTypes: ['irrigated_cropland','rainfed_cropland','wetland','mixed_agriculture'], pNames: [{name:'Nagram',nameHi:'नग्राम'},{name:'Kalli Paschim',nameHi:'कल्ली पश्चिम'},{name:'Khujauli',nameHi:'खुजौली'},{name:'Sissendi',nameHi:'सिसेंडी'}] },
          { id: 'malihabad', name: 'Malihabad', nameHi: 'मलीहाबाद', sector: [0.1, -0.3], baseElev: 126, elevVar: 20, tempAdj: -1, rainAdj: 2, landTypes: ['plantation','mixed_agriculture','irrigated_cropland','sparse_forest'], pNames: [{name:'Kasmandi Kalan',nameHi:'कसमंडी कलां'},{name:'Saspan',nameHi:'ससपन'},{name:'Mirzapur',nameHi:'मिर्जापुर'},{name:'Bakhtiyarnagar',nameHi:'बख्तियारनगर'}] },
          { id: 'goshainganj', name: 'Gosainganj', nameHi: 'गोसाईगंज', sector: [-0.1, 0.3], baseElev: 119, elevVar: 12, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','river_valley','plantation'], pNames: [{name:'Amethi',nameHi:'अमेठी'},{name:'Kala Kanker',nameHi:'काला कांकर'},{name:'Rahimabad',nameHi:'रहीमाबाद'},{name:'Mati',nameHi:'माती'}] },
        ],
      },
      {
        id: 'varanasi', name: 'Varanasi', nameHi: 'वाराणसी',
        center: [25.32, 82.97], zoom: 10,
        bounds: { minLat: 25.02, maxLat: 25.62, minLng: 82.67, maxLng: 83.27 },
        climate: { baseTempH: 35, baseTempL: 24, baseRain: 11, zone: 'eastern_gangetic' },
        blocks: [
          { id: 'kashi_vidyapeeth', name: 'Kashi Vidyapeeth', nameHi: 'काशी विद्यापीठ', sector: [0.1, -0.1], baseElev: 82, elevVar: 10, tempAdj: 1, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Manduadih',nameHi:'मंडुवाडीह'},{name:'Shivpur',nameHi:'शिवपुर'},{name:'Lohta',nameHi:'लोहता'},{name:'Chandpur',nameHi:'चांदपुर'}] },
          { id: 'pindra', name: 'Pindra', nameHi: 'पिंडरा', sector: [0.28, -0.15], baseElev: 86, elevVar: 12, tempAdj: -1, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','rainfed_cropland','plantation'], pNames: [{name:'Phoolpur',nameHi:'फूलपुर'},{name:'Sindhora',nameHi:'सिंधोरा'},{name:'Baburi',nameHi:'बाबुरी'},{name:'Khalispur',nameHi:'खालिसपुर'}] },
          { id: 'chiraigaon', name: 'Chiraigaon', nameHi: 'चिरईगांव', sector: [0.2, 0.25], baseElev: 78, elevVar: 8, tempAdj: 0, rainAdj: 2, landTypes: ['river_valley','wetland','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Chaubepur',nameHi:'चौबेपुर'},{name:'Rajwari',nameHi:'राजवारी'},{name:'Sarnath',nameHi:'सारनाथ'},{name:'Dhuria',nameHi:'धुरिया'}] },
          { id: 'baragaon', name: 'Baragaon', nameHi: 'बड़ागांव', sector: [-0.05, -0.3], baseElev: 84, elevVar: 14, tempAdj: 0, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','plantation','scrubland'], pNames: [{name:'Babatpur',nameHi:'बाबतपुर'},{name:'Harahua',nameHi:'हरहुआ'},{name:'Bhitari',nameHi:'भितरी'},{name:'Bhikharipur',nameHi:'भिखारीपुर'}] },
          { id: 'cholapur', name: 'Cholapur', nameHi: 'चोलापुर', sector: [0.0, 0.28], baseElev: 80, elevVar: 10, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','wetland'], pNames: [{name:'Ajagara',nameHi:'अजगरा'},{name:'Gaur',nameHi:'गौड़'},{name:'Bojhi',nameHi:'बोझी'},{name:'Piyar',nameHi:'पियार'}] },
          { id: 'sevapuri', name: 'Sevapuri', nameHi: 'सेवापुरी', sector: [-0.25, 0.0], baseElev: 83, elevVar: 11, tempAdj: 1, rainAdj: 0, landTypes: ['mixed_agriculture','irrigated_cropland','rainfed_cropland','periurban'], pNames: [{name:'Kapsethi',nameHi:'कपसेठी'},{name:'Hathiar',nameHi:'हथियार'},{name:'Kalyanpur',nameHi:'कल्याणपुर'},{name:'Bhadohi Road',nameHi:'भदोही रोड'}] },
        ],
      },
    ],
  },
  {
    id: 'rajasthan', name: 'Rajasthan', nameHi: 'राजस्थान',
    center: [27.02, 74.22], zoom: 7,
    districts: [
      {
        id: 'jaipur', name: 'Jaipur', nameHi: 'जयपुर',
        center: [26.92, 75.78], zoom: 10,
        bounds: { minLat: 26.62, maxLat: 27.22, minLng: 75.48, maxLng: 76.08 },
        climate: { baseTempH: 40, baseTempL: 27, baseRain: 3, zone: 'arid' },
        blocks: [
          { id: 'amber', name: 'Amber', nameHi: 'आमेर', sector: [0.28, -0.15], baseElev: 480, elevVar: 60, tempAdj: -2, rainAdj: 1, landTypes: ['scrubland','mixed_agriculture','rainfed_cropland','periurban'], pNames: [{name:'Nahargarh',nameHi:'नाहरगढ़'},{name:'Jaigarh',nameHi:'जयगढ़'},{name:'Kunda',nameHi:'कुंडा'},{name:'Kukas',nameHi:'कुकस'}] },
          { id: 'jamwa_ramgarh', name: 'Jamwa Ramgarh', nameHi: 'जमवा रामगढ़', sector: [0.2, 0.25], baseElev: 420, elevVar: 50, tempAdj: 0, rainAdj: 0, landTypes: ['rainfed_cropland','scrubland','mixed_agriculture','sparse_forest'], pNames: [{name:'Ramgarh Lake',nameHi:'रामगढ़ झील'},{name:'Talvriksha',nameHi:'तालवृक्ष'},{name:'Nangal Choudhary',nameHi:'नांगल चौधरी'},{name:'Achrol',nameHi:'आचरोल'}] },
          { id: 'sanganer', name: 'Sanganer', nameHi: 'सांगानेर', sector: [-0.15, -0.15], baseElev: 390, elevVar: 30, tempAdj: 2, rainAdj: -1, landTypes: ['urban','periurban','irrigated_cropland','scrubland'], pNames: [{name:'Jagatpura',nameHi:'जगतपुरा'},{name:'Pratap Nagar',nameHi:'प्रताप नगर'},{name:'Sitapura',nameHi:'सीतापुरा'},{name:'Vatika',nameHi:'वाटिका'}] },
          { id: 'chaksu', name: 'Chaksu', nameHi: 'चाकसू', sector: [-0.3, 0.1], baseElev: 360, elevVar: 35, tempAdj: 1, rainAdj: 0, landTypes: ['rainfed_cropland','irrigated_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Mauzamabad',nameHi:'मौजमाबाद'},{name:'Tigariya',nameHi:'तिगरिया'},{name:'Bassi',nameHi:'बस्सी'},{name:'Dausa Road',nameHi:'दौसा रोड'}] },
          { id: 'phagi', name: 'Phagi', nameHi: 'फागी', sector: [-0.1, -0.3], baseElev: 370, elevVar: 40, tempAdj: 1, rainAdj: -1, landTypes: ['rainfed_cropland','scrubland','mixed_agriculture','irrigated_cropland'], pNames: [{name:'Dhanakya',nameHi:'धनक्या'},{name:'Peelwa',nameHi:'पीलवा'},{name:'Renwal',nameHi:'रेणवाल'},{name:'Kishangarh Bas',nameHi:'किशनगढ़ बास'}] },
          { id: 'kotputli', name: 'Kotputli', nameHi: 'कोटपूतली', sector: [0.05, 0.25], baseElev: 410, elevVar: 45, tempAdj: -1, rainAdj: 1, landTypes: ['mixed_agriculture','rainfed_cropland','scrubland','plantation'], pNames: [{name:'Bansur',nameHi:'बानसूर'},{name:'Viratnagar',nameHi:'विराटनगर'},{name:'Mundawar',nameHi:'मुंडावर'},{name:'Govindgarh',nameHi:'गोविंदगढ़'}] },
        ],
      },
      {
        id: 'jodhpur', name: 'Jodhpur', nameHi: 'जोधपुर',
        center: [26.29, 73.02], zoom: 10,
        bounds: { minLat: 25.99, maxLat: 26.59, minLng: 72.72, maxLng: 73.32 },
        climate: { baseTempH: 42, baseTempL: 29, baseRain: 2, zone: 'desert' },
        blocks: [
          { id: 'jodhpur_n', name: 'Jodhpur North', nameHi: 'जोधपुर उत्तर', sector: [0.25, -0.15], baseElev: 250, elevVar: 30, tempAdj: -1, rainAdj: 1, landTypes: ['scrubland','rainfed_cropland','urban','periurban'], pNames: [{name:'Mandore',nameHi:'मंडोर'},{name:'Pal',nameHi:'पाल'},{name:'Basni',nameHi:'बासनी'},{name:'Khetolai',nameHi:'खेतोलाई'}] },
          { id: 'osian', name: 'Osian', nameHi: 'ओसियां', sector: [0.25, 0.2], baseElev: 220, elevVar: 20, tempAdj: 2, rainAdj: -1, landTypes: ['scrubland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Osian Temple',nameHi:'ओसियां मंदिर'},{name:'Bhopalgarh',nameHi:'भोपालगढ़'},{name:'Mathania',nameHi:'मथानिया'},{name:'Tinwari',nameHi:'तिनवारी'}] },
          { id: 'luni', name: 'Luni', nameHi: 'लूणी', sector: [-0.05, -0.25], baseElev: 210, elevVar: 25, tempAdj: 1, rainAdj: 0, landTypes: ['rainfed_cropland','scrubland','mixed_agriculture','river_valley'], pNames: [{name:'Salawas',nameHi:'सालावास'},{name:'Bhopalgarh',nameHi:'भोपालगढ़'},{name:'Kaparda',nameHi:'कापरड़ा'},{name:'Bilara',nameHi:'बिलाड़ा'}] },
          { id: 'phalodi', name: 'Phalodi', nameHi: 'फलौदी', sector: [-0.05, 0.25], baseElev: 200, elevVar: 15, tempAdj: 3, rainAdj: -1, landTypes: ['scrubland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Bap',nameHi:'बाप'},{name:'Lohawat',nameHi:'लोहावट'},{name:'Shergarh',nameHi:'शेरगढ़'},{name:'Dechu',nameHi:'डेचू'}] },
          { id: 'shergarh', name: 'Shergarh', nameHi: 'शेरगढ़', sector: [-0.28, -0.1], baseElev: 230, elevVar: 28, tempAdj: 0, rainAdj: 0, landTypes: ['rainfed_cropland','scrubland','mixed_agriculture','irrigated_cropland'], pNames: [{name:'Bawdi',nameHi:'बावड़ी'},{name:'Pipar City',nameHi:'पीपाड़ सिटी'},{name:'Bhavi',nameHi:'भावी'},{name:'Balesar',nameHi:'बालेसर'}] },
          { id: 'baori', name: 'Baori', nameHi: 'बावड़ी', sector: [-0.25, 0.2], baseElev: 215, elevVar: 18, tempAdj: 1, rainAdj: -1, landTypes: ['scrubland','rainfed_cropland','plantation','mixed_agriculture'], pNames: [{name:'Rohat',nameHi:'रोहट'},{name:'Setrawa',nameHi:'सेतरावा'},{name:'Aau',nameHi:'आउ'},{name:'Dhanana',nameHi:'धनाना'}] },
        ],
      },
    ],
  },
  {
    id: 'gujarat', name: 'Gujarat', nameHi: 'गुजरात',
    center: [22.25, 71.19], zoom: 7,
    districts: [
      {
        id: 'ahmedabad', name: 'Ahmedabad', nameHi: 'अहमदाबाद',
        center: [23.02, 72.57], zoom: 10,
        bounds: { minLat: 22.72, maxLat: 23.32, minLng: 72.27, maxLng: 72.87 },
        climate: { baseTempH: 38, baseTempL: 26, baseRain: 7, zone: 'semi_arid' },
        blocks: [
          { id: 'daskroi', name: 'Daskroi', nameHi: 'दस्क्रोई', sector: [0.15, -0.1], baseElev: 53, elevVar: 12, tempAdj: 1, rainAdj: 0, landTypes: ['irrigated_cropland','urban','periurban','mixed_agriculture'], pNames: [{name:'Sanand Road',nameHi:'साणंद रोड'},{name:'Khatraj',nameHi:'खतराज'},{name:'Bareja',nameHi:'बरेजा'},{name:'Aslali',nameHi:'असलाली'}] },
          { id: 'sanand', name: 'Sanand', nameHi: 'साणंद', sector: [0.1, -0.28], baseElev: 57, elevVar: 15, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','periurban','plantation','rainfed_cropland'], pNames: [{name:'Chekhla',nameHi:'चेखला'},{name:'Nal Sarovar',nameHi:'नल सरोवर'},{name:'Nidhrad',nameHi:'निधराद'},{name:'Moraiya',nameHi:'मोरैया'}] },
          { id: 'dholka', name: 'Dholka', nameHi: 'धोलका', sector: [-0.2, -0.15], baseElev: 48, elevVar: 10, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Koth',nameHi:'कोठ'},{name:'Gundi',nameHi:'गुंडी'},{name:'Bavla',nameHi:'बावला'},{name:'Chaloda',nameHi:'चलोडा'}] },
          { id: 'degham', name: 'Dehgam', nameHi: 'दहेगाम', sector: [0.25, 0.2], baseElev: 62, elevVar: 18, tempAdj: -1, rainAdj: 1, landTypes: ['mixed_agriculture','irrigated_cropland','river_valley','plantation'], pNames: [{name:'Bahiyal',nameHi:'बहियाल'},{name:'Sampa',nameHi:'सम्पा'},{name:'Rakhial',nameHi:'राखियाल'},{name:'Kadadara',nameHi:'कडदरा'}] },
          { id: 'viramgam', name: 'Viramgam', nameHi: 'विरामगाम', sector: [0.28, -0.25], baseElev: 55, elevVar: 12, tempAdj: 2, rainAdj: -2, landTypes: ['rainfed_cropland','scrubland','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Mandal',nameHi:'मांडल'},{name:'Detroj',nameHi:'देट्रोज'},{name:'Hansalpur',nameHi:'हंसलपुर'},{name:'Jakhwada',nameHi:'जखवाडा'}] },
          { id: 'dhandhuka', name: 'Dhandhuka', nameHi: 'धंधुका', sector: [-0.25, 0.2], baseElev: 42, elevVar: 8, tempAdj: 1, rainAdj: 0, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','scrubland'], pNames: [{name:'Ranpur',nameHi:'राणपुर'},{name:'Fedra',nameHi:'फेदरा'},{name:'Tagdi',nameHi:'तगडी'},{name:'Dholera',nameHi:'धोलेरा'}] },
        ],
      },
      {
        id: 'rajkot', name: 'Rajkot', nameHi: 'राजकोट',
        center: [22.30, 70.80], zoom: 10,
        bounds: { minLat: 22.00, maxLat: 22.60, minLng: 70.50, maxLng: 71.10 },
        climate: { baseTempH: 37, baseTempL: 25, baseRain: 6, zone: 'saurashtra' },
        blocks: [
          { id: 'rajkot_taluka', name: 'Rajkot Taluka', nameHi: 'राजकोट तालुका', sector: [0.1, -0.1], baseElev: 135, elevVar: 20, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Kuvadva',nameHi:'कुवाडवा'},{name:'Bedipara',nameHi:'बेडीपारा'},{name:'Kankot',nameHi:'कनकोट'},{name:'Metoda',nameHi:'मेटोडा'}] },
          { id: 'gondal', name: 'Gondal', nameHi: 'गोंडल', sector: [-0.2, -0.15], baseElev: 145, elevVar: 25, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','plantation','mixed_agriculture','rainfed_cropland'], pNames: [{name:'Derdi',nameHi:'देरडी'},{name:'Vasavad',nameHi:'वासवड़'},{name:'Gomta',nameHi:'गोमटा'},{name:'Ribda',nameHi:'रिबड़ा'}] },
          { id: 'jasdan', name: 'Jasdan', nameHi: 'जसदन', sector: [-0.05, 0.25], baseElev: 160, elevVar: 30, tempAdj: -1, rainAdj: 1, landTypes: ['rainfed_cropland','scrubland','mixed_agriculture','sparse_forest'], pNames: [{name:'Atkot',nameHi:'अतकोट'},{name:'Vinchhiya',nameHi:'विंछिया'},{name:'Sompipaliya',nameHi:'सोमपिपलिया'},{name:'Ghela Somnath',nameHi:'घेला सोमनाथ'}] },
          { id: 'dhoraji', name: 'Dhoraji', nameHi: 'धोराजी', sector: [-0.28, -0.2], baseElev: 120, elevVar: 18, tempAdj: 1, rainAdj: 0, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Jamkandorna',nameHi:'जामकंडोरणा'},{name:'Upleta Road',nameHi:'उपलेटा रोड'},{name:'Chhatrasa',nameHi:'छत्रासा'},{name:'Patwa',nameHi:'पटवा'}] },
          { id: 'morbi_road', name: 'Padadhari', nameHi: 'पडाधरी', sector: [0.25, -0.2], baseElev: 130, elevVar: 15, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','scrubland','rainfed_cropland'], pNames: [{name:'Targhadi',nameHi:'तरघडी'},{name:'Nyari',nameHi:'न्यरी'},{name:'Bodabhun',nameHi:'बोड़ाभुण'},{name:'Hadmatiya',nameHi:'हड़मतिया'}] },
          { id: 'kotda_sangani', name: 'Kotda Sangani', nameHi: 'कोटडा सांगाणी', sector: [-0.15, 0.15], baseElev: 150, elevVar: 22, tempAdj: 0, rainAdj: 0, landTypes: ['mixed_agriculture','irrigated_cropland','scrubland','plantation'], pNames: [{name:'Solsumba',nameHi:'सोलसुम्बा'},{name:'Anida',nameHi:'अनिडा'},{name:'Rajpara',nameHi:'राजपारा'},{name:'Mahuva Road',nameHi:'महुवा रोड'}] },
        ],
      },
    ],
  },
  {
    id: 'maharashtra', name: 'Maharashtra', nameHi: 'महाराष्ट्र',
    center: [19.75, 75.71], zoom: 7,
    districts: [
      {
        id: 'pune', name: 'Pune', nameHi: 'पुणे',
        center: [18.52, 73.85], zoom: 10,
        bounds: { minLat: 18.22, maxLat: 18.82, minLng: 73.55, maxLng: 74.15 },
        climate: { baseTempH: 33, baseTempL: 21, baseRain: 10, zone: 'deccan' },
        blocks: [
          { id: 'haveli', name: 'Haveli', nameHi: 'हवेली', sector: [0.1, 0.05], baseElev: 560, elevVar: 80, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Wagholi',nameHi:'वाघोली'},{name:'Lohegaon',nameHi:'लोहेगांव'},{name:'Kharadi',nameHi:'खराडी'},{name:'Mundhwa',nameHi:'मुंढवा'}] },
          { id: 'mulshi', name: 'Mulshi', nameHi: 'मुळशी', sector: [0.25, -0.2], baseElev: 620, elevVar: 120, tempAdj: -2, rainAdj: 5, landTypes: ['dense_forest','sparse_forest','mixed_agriculture','terrace_farming'], pNames: [{name:'Pirangut',nameHi:'पिरंगुट'},{name:'Paud',nameHi:'पौड'},{name:'Hinjewadi',nameHi:'हिंजेवाडी'},{name:'Lavale',nameHi:'लवळे'}] },
          { id: 'maval', name: 'Maval', nameHi: 'मावळ', sector: [0.28, 0.15], baseElev: 580, elevVar: 100, tempAdj: -1, rainAdj: 3, landTypes: ['mixed_agriculture','irrigated_cropland','sparse_forest','plantation'], pNames: [{name:'Talegaon',nameHi:'तळेगाव'},{name:'Vadgaon',nameHi:'वडगाव'},{name:'Kanhe',nameHi:'कान्हे'},{name:'Dehu',nameHi:'देहू'}] },
          { id: 'baramati', name: 'Baramati', nameHi: 'बारामती', sector: [-0.25, 0.2], baseElev: 540, elevVar: 60, tempAdj: 2, rainAdj: -3, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Indapur',nameHi:'इंदापूर'},{name:'Morgaon',nameHi:'मोरगाव'},{name:'Katraj',nameHi:'कात्रज'},{name:'Jejuri',nameHi:'जेजुरी'}] },
          { id: 'junnar', name: 'Junnar', nameHi: 'जुन्नर', sector: [0.35, 0.0], baseElev: 650, elevVar: 130, tempAdj: -3, rainAdj: 6, landTypes: ['dense_forest','mixed_agriculture','terrace_farming','sparse_forest'], pNames: [{name:'Otur',nameHi:'ओतूर'},{name:'Narayangaon',nameHi:'नारायणगाव'},{name:'Alephata',nameHi:'आळेफाटा'},{name:'Ozar',nameHi:'ओझर'}] },
          { id: 'bhor', name: 'Bhor', nameHi: 'भोर', sector: [-0.25, -0.2], baseElev: 600, elevVar: 110, tempAdj: -2, rainAdj: 4, landTypes: ['sparse_forest','mixed_agriculture','irrigated_cropland','plantation'], pNames: [{name:'Nasrapur',nameHi:'नसरापूर'},{name:'Velhe',nameHi:'वेल्हे'},{name:'Kikvi',nameHi:'किकवी'},{name:'Roha',nameHi:'रोहा'}] },
        ],
      },
      {
        id: 'nashik', name: 'Nashik', nameHi: 'नासिक',
        center: [20.0, 73.79], zoom: 10,
        bounds: { minLat: 19.70, maxLat: 20.30, minLng: 73.49, maxLng: 74.09 },
        climate: { baseTempH: 35, baseTempL: 20, baseRain: 8, zone: 'deccan' },
        blocks: [
          { id: 'nashik_city', name: 'Nashik City', nameHi: 'नासिक शहर', sector: [0.05, 0.0], baseElev: 585, elevVar: 50, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Panchavati',nameHi:'पंचवटी'},{name:'Satpur',nameHi:'सातपूर'},{name:'Deolali',nameHi:'देवळाली'},{name:'Cidco',nameHi:'सिडको'}] },
          { id: 'trimbak', name: 'Trimbak', nameHi: 'त्र्यंबकेश्वर', sector: [0.15, -0.28], baseElev: 700, elevVar: 160, tempAdj: -4, rainAdj: 8, landTypes: ['dense_forest','sparse_forest','mixed_agriculture','terrace_farming'], pNames: [{name:'Anjaneri',nameHi:'अंजनेरी'},{name:'Harsul',nameHi:'हरसूल'},{name:'Brahmagiri',nameHi:'ब्रह्मगिरी'},{name:'Ghoti',nameHi:'घोटी'}] },
          { id: 'niphad', name: 'Niphad', nameHi: 'निफाड', sector: [0.1, 0.25], baseElev: 500, elevVar: 40, tempAdj: 2, rainAdj: -2, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Ozar Mig',nameHi:'ओझर मिग'},{name:'Lasalgaon',nameHi:'लासलगांव'},{name:'Pimpalgaon',nameHi:'पिंपळगांव'},{name:'Vinchur',nameHi:'विंचूर'}] },
          { id: 'dindori', name: 'Dindori', nameHi: 'दिंडोरी', sector: [0.3, 0.05], baseElev: 630, elevVar: 80, tempAdj: -1, rainAdj: 3, landTypes: ['mixed_agriculture','irrigated_cropland','sparse_forest','terrace_farming'], pNames: [{name:'Vani',nameHi:'वणी'},{name:'Surgana',nameHi:'सुरगाणा'},{name:'Peth',nameHi:'पेठ'},{name:'Wavi',nameHi:'वावी'}] },
          { id: 'sinnar', name: 'Sinnar', nameHi: 'सिन्नर', sector: [-0.2, 0.2], baseElev: 550, elevVar: 60, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','scrubland'], pNames: [{name:'Sinnar Town',nameHi:'सिन्नर शहर'},{name:'Nandur',nameHi:'नांदूर'},{name:'Dabhadi',nameHi:'दभाडी'},{name:'Pathardi',nameHi:'पाथर्डी'}] },
          { id: 'igatpuri', name: 'Igatpuri', nameHi: 'इगतपुरी', sector: [-0.25, -0.2], baseElev: 680, elevVar: 150, tempAdj: -3, rainAdj: 7, landTypes: ['dense_forest','sparse_forest','terrace_farming','mixed_agriculture'], pNames: [{name:'Ghoti Budruk',nameHi:'घोटी बुद्रुक'},{name:'Kasara Ghat',nameHi:'कसारा घाट'},{name:'Bhavli',nameHi:'भावली'},{name:'Talegaon N',nameHi:'तळेगाव एन'}] },
        ],
      },
    ],
  },
  {
    id: 'madhya_pradesh', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश',
    center: [23.47, 77.95], zoom: 7,
    districts: [
      {
        id: 'bhopal', name: 'Bhopal', nameHi: 'भोपाल',
        center: [23.26, 77.41], zoom: 10,
        bounds: { minLat: 22.96, maxLat: 23.56, minLng: 77.11, maxLng: 77.71 },
        climate: { baseTempH: 37, baseTempL: 24, baseRain: 8, zone: 'central_highlands' },
        blocks: [
          { id: 'huzur', name: 'Huzur', nameHi: 'हुज़ूर', sector: [0.05, -0.05], baseElev: 500, elevVar: 40, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','wetland'], pNames: [{name:'Kolar',nameHi:'कोलार'},{name:'Misrod',nameHi:'मिसरोद'},{name:'Bairagarh',nameHi:'बैरागढ़'},{name:'Karond',nameHi:'करोंद'}] },
          { id: 'berasia', name: 'Berasia', nameHi: 'बैरसिया', sector: [0.28, 0.1], baseElev: 480, elevVar: 50, tempAdj: 1, rainAdj: -1, landTypes: ['rainfed_cropland','mixed_agriculture','scrubland','sparse_forest'], pNames: [{name:'Salamatpur',nameHi:'सलामतपुर'},{name:'Shahpura',nameHi:'शाहपुरा'},{name:'Khajuri Sadak',nameHi:'खजूरी सड़क'},{name:'Nariyal Kheda',nameHi:'नारियल खेड़ा'}] },
          { id: 'sehore', name: 'Sehore', nameHi: 'सीहोर', sector: [-0.1, -0.28], baseElev: 520, elevVar: 60, tempAdj: -1, rainAdj: 2, landTypes: ['mixed_agriculture','irrigated_cropland','sparse_forest','rainfed_cropland'], pNames: [{name:'Ashta',nameHi:'आष्टा'},{name:'Ichhawar',nameHi:'इछावर'},{name:'Nasrullaganj',nameHi:'नसरुल्लागंज'},{name:'Budni',nameHi:'बुदनी'}] },
          { id: 'phanda', name: 'Phanda', nameHi: 'फंदा', sector: [-0.2, 0.05], baseElev: 490, elevVar: 45, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','wetland'], pNames: [{name:'Ratibad',nameHi:'रातीबाद'},{name:'Lambakheda',nameHi:'लाम्बाखेडा'},{name:'Neelbad',nameHi:'नीलबाड'},{name:'Chuna Bhatti',nameHi:'चूना भट्टी'}] },
          { id: 'raisen', name: 'Raisen', nameHi: 'रायसेन', sector: [0.1, 0.28], baseElev: 510, elevVar: 70, tempAdj: -1, rainAdj: 1, landTypes: ['mixed_agriculture','sparse_forest','rainfed_cropland','irrigated_cropland'], pNames: [{name:'Sanchi',nameHi:'सांची'},{name:'Bareli',nameHi:'बारेली'},{name:'Silwani',nameHi:'सिलवानी'},{name:'Udaipura',nameHi:'उदयपुरा'}] },
          { id: 'vidisha_area', name: 'Vidisha', nameHi: 'विदिशा', sector: [0.3, -0.15], baseElev: 430, elevVar: 40, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Gyaraspur',nameHi:'ग्यारसपुर'},{name:'Kurwai',nameHi:'कुरवाई'},{name:'Lateri',nameHi:'लटेरी'},{name:'Basoda',nameHi:'बासोदा'}] },
        ],
      },
      {
        id: 'indore', name: 'Indore', nameHi: 'इंदौर',
        center: [22.72, 75.86], zoom: 10,
        bounds: { minLat: 22.42, maxLat: 23.02, minLng: 75.56, maxLng: 76.16 },
        climate: { baseTempH: 36, baseTempL: 22, baseRain: 9, zone: 'malwa_plateau' },
        blocks: [
          { id: 'indore_blk', name: 'Indore Urban', nameHi: 'इंदौर शहरी', sector: [0.05, 0.0], baseElev: 553, elevVar: 30, tempAdj: 1, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Rau',nameHi:'राऊ'},{name:'Kanadia',nameHi:'कनाडिया'},{name:'Harsola',nameHi:'हरसोला'},{name:'Machal',nameHi:'माचल'}] },
          { id: 'mhow', name: 'Mhow (Dr. Ambedkar Nagar)', nameHi: 'महू', sector: [-0.25, -0.15], baseElev: 580, elevVar: 60, tempAdj: -2, rainAdj: 2, landTypes: ['sparse_forest','mixed_agriculture','rainfed_cropland','terrace_farming'], pNames: [{name:'Badgonda',nameHi:'बड़गोंदा'},{name:'Patalpani',nameHi:'पातालपानी'},{name:'Hasalpur',nameHi:'हसलपुर'},{name:'Manpur',nameHi:'मानपुर'}] },
          { id: 'depalpur', name: 'Depalpur', nameHi: 'देपालपुर', sector: [0.2, -0.25], baseElev: 535, elevVar: 25, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','wetland','mixed_agriculture'], pNames: [{name:'Betma',nameHi:'बेतमा'},{name:'Gautampura',nameHi:'गौतमपुरा'},{name:'Rala',nameHi:'राला'},{name:'Runija',nameHi:'रुणीजा'}] },
          { id: 'sanwer', name: 'Sanwer', nameHi: 'सांवेर', sector: [0.28, 0.15], baseElev: 540, elevVar: 20, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','plantation','periurban'], pNames: [{name:'Dharmat',nameHi:'धरमत'},{name:'Kshipra',nameHi:'क्षिप्रा'},{name:'Ajnod',nameHi:'अजनोद'},{name:'Palasiya',nameHi:'पलासिया'}] },
          { id: 'hatod', name: 'Hatod', nameHi: 'हातोद', sector: [0.05, -0.28], baseElev: 545, elevVar: 22, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','scrubland'], pNames: [{name:'Budhaniya',nameHi:'बुधानिया'},{name:'Palakhedi',nameHi:'पालखेड़ी'},{name:'Semda',nameHi:'सेमदा'},{name:'Kalyanpura',nameHi:'कल्याणपुरा'}] },
          { id: 'khudel', name: 'Khudel', nameHi: 'खुडैल', sector: [-0.15, 0.25], baseElev: 565, elevVar: 45, tempAdj: -1, rainAdj: 1, landTypes: ['mixed_agriculture','rainfed_cropland','sparse_forest','irrigated_cropland'], pNames: [{name:'Pedmi',nameHi:'पेड़मी'},{name:'Kampel',nameHi:'कंपेल'},{name:'Double Chowki',nameHi:'डबल चौकी'},{name:'Bicholi',nameHi:'बिचोली'}] },
        ],
      },
    ],
  },
  {
    id: 'west_bengal', name: 'West Bengal', nameHi: 'पश्चिम बंगाल',
    center: [22.99, 87.85], zoom: 7,
    districts: [
      {
        id: 'bardhaman', name: 'Bardhaman', nameHi: 'बर्धमान',
        center: [23.25, 87.85], zoom: 10,
        bounds: { minLat: 22.95, maxLat: 23.55, minLng: 87.55, maxLng: 88.15 },
        climate: { baseTempH: 34, baseTempL: 24, baseRain: 14, zone: 'gangetic_delta' },
        blocks: [
          { id: 'bardhaman_blk', name: 'Bardhaman City', nameHi: 'बर्धमान शहर', sector: [0.05, 0.0], baseElev: 30, elevVar: 8, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','wetland'], pNames: [{name:'Saktigarh',nameHi:'शक्तिगढ़'},{name:'Raina',nameHi:'रैना'},{name:'Khandaghosh',nameHi:'खंडघोष'},{name:'Jamalpur',nameHi:'जमालपुर'}] },
          { id: 'durgapur', name: 'Durgapur', nameHi: 'दुर्गापुर', sector: [0.2, -0.25], baseElev: 65, elevVar: 20, tempAdj: -1, rainAdj: 1, landTypes: ['periurban','irrigated_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Andal',nameHi:'अंडाल'},{name:'Pandabeswar',nameHi:'पांडबेश्वर'},{name:'Faridpur',nameHi:'फरीदपुर'},{name:'Ukhra',nameHi:'उखरा'}] },
          { id: 'memari', name: 'Memari', nameHi: 'मेमारी', sector: [-0.15, 0.2], baseElev: 22, elevVar: 5, tempAdj: 1, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','rainfed_cropland'], pNames: [{name:'Bud Bud',nameHi:'बुद बुद'},{name:'Galsi',nameHi:'गलसी'},{name:'Ketugram',nameHi:'केतुग्राम'},{name:'Mongalkote',nameHi:'मोंगलकोट'}] },
          { id: 'katwa', name: 'Katwa', nameHi: 'कटवा', sector: [0.25, 0.15], baseElev: 18, elevVar: 6, tempAdj: 0, rainAdj: 2, landTypes: ['irrigated_cropland','wetland','river_valley','mixed_agriculture'], pNames: [{name:'Dainhat',nameHi:'दैनहाट'},{name:'Purbasthali',nameHi:'पूर्बस्थली'},{name:'Nadanghat',nameHi:'नदांघाट'},{name:'Kalna',nameHi:'कालना'}] },
          { id: 'asansol', name: 'Asansol', nameHi: 'आसनसोल', sector: [0.3, -0.28], baseElev: 90, elevVar: 30, tempAdj: -1, rainAdj: -1, landTypes: ['urban','periurban','scrubland','mixed_agriculture'], pNames: [{name:'Raniganj',nameHi:'रानीगंज'},{name:'Kulti',nameHi:'कुल्टी'},{name:'Barakar',nameHi:'बराकर'},{name:'Jamuria',nameHi:'जमुरिया'}] },
          { id: 'ausgram', name: 'Ausgram', nameHi: 'औसग्राम', sector: [-0.2, -0.1], baseElev: 45, elevVar: 15, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','rainfed_cropland','plantation'], pNames: [{name:'Bhatar',nameHi:'भातार'},{name:'Mangalkot',nameHi:'मंगलकोट'},{name:'Kanksa',nameHi:'कांक्सा'},{name:'Salanpur',nameHi:'सालनपुर'}] },
        ],
      },
      {
        id: 'darjeeling', name: 'Darjeeling', nameHi: 'दार्जिलिंग',
        center: [27.04, 88.26], zoom: 10,
        bounds: { minLat: 26.74, maxLat: 27.34, minLng: 87.96, maxLng: 88.56 },
        climate: { baseTempH: 20, baseTempL: 11, baseRain: 22, zone: 'eastern_himalaya' },
        blocks: [
          { id: 'darjeeling_pulbazar', name: 'Darjeeling-Pulbazar', nameHi: 'दार्जिलिंग-पुलबाजार', sector: [0.15, -0.15], baseElev: 2050, elevVar: 500, tempAdj: -5, rainAdj: 4, landTypes: ['dense_forest','plantation','terrace_farming','alpine_meadow'], pNames: [{name:'Ghoom',nameHi:'घूम'},{name:'Bijanbari',nameHi:'बिजनबारी'},{name:'Lebong',nameHi:'लेबोंग'},{name:'Singamari',nameHi:'सिंगामारी'}] },
          { id: 'kurseong', name: 'Kurseong', nameHi: 'कुर्सियांग', sector: [-0.15, 0.05], baseElev: 1450, elevVar: 350, tempAdj: -2, rainAdj: 6, landTypes: ['plantation','dense_forest','terrace_farming','mixed_agriculture'], pNames: [{name:'Tung',nameHi:'तुंग'},{name:'Mahanadi',nameHi:'महानदी'},{name:'Tindharia',nameHi:'तिंधारिया'},{name:'Pankhabari',nameHi:'पंखबारी'}] },
          { id: 'mirik', name: 'Mirik', nameHi: 'मिरिक', sector: [-0.1, -0.28], baseElev: 1500, elevVar: 300, tempAdj: -2, rainAdj: 3, landTypes: ['plantation','sparse_forest','terrace_farming','wetland'], pNames: [{name:'Soureni',nameHi:'सौरेनी'},{name:'Thurbo',nameHi:'थुर्बो'},{name:'Phuguri',nameHi:'फूगुरी'},{name:'Gopal Dhara',nameHi:'गोपाल धारा'}] },
          { id: 'sukhiapokhri', name: 'Jorebunglow-Sukhiapokhri', nameHi: 'सुखियापोखरी', sector: [0.28, -0.2], baseElev: 2150, elevVar: 450, tempAdj: -6, rainAdj: 5, landTypes: ['dense_forest','alpine_meadow','terrace_farming','sparse_forest'], pNames: [{name:'Manebhanjan',nameHi:'मानेभंजन'},{name:'Batasi',nameHi:'बतासी'},{name:'Lepchajagat',nameHi:'लेप्चाजगत'},{name:'Pokhriabong',nameHi:'पोखरियाबोंग'}] },
          { id: 'siliguri_hills', name: 'Matigara (Foothills)', nameHi: 'माटीगाड़ा', sector: [-0.3, 0.2], baseElev: 130, elevVar: 40, tempAdj: 6, rainAdj: -4, landTypes: ['irrigated_cropland','periurban','mixed_agriculture','plantation'], pNames: [{name:'Bagdogra',nameHi:'बागडोगरा'},{name:'Shivmandir',nameHi:'शिवमंदिर'},{name:'Bidhannagar',nameHi:'बिधाननगर'},{name:'Kawa Khali',nameHi:'कावा खाली'}] },
          { id: 'naxalbari', name: 'Naxalbari', nameHi: 'नक्सलबाड़ी', sector: [-0.25, -0.1], baseElev: 150, elevVar: 50, tempAdj: 5, rainAdj: -2, landTypes: ['plantation','mixed_agriculture','irrigated_cropland','dense_forest'], pNames: [{name:'Bengai',nameHi:'बेंगाई'},{name:'Hatighisa',nameHi:'हातीघिसा'},{name:'Kamala',nameHi:'कमला'},{name:'Maniram',nameHi:'मणिराम'}] },
        ],
      },
    ],
  },
  {
    id: 'karnataka', name: 'Karnataka', nameHi: 'कर्नाटक',
    center: [15.32, 75.71], zoom: 7,
    districts: [
      {
        id: 'bengaluru_rural', name: 'Bengaluru Rural', nameHi: 'बेंगलुरु ग्रामीण',
        center: [13.23, 77.71], zoom: 10,
        bounds: { minLat: 12.93, maxLat: 13.53, minLng: 77.41, maxLng: 78.01 },
        climate: { baseTempH: 31, baseTempL: 20, baseRain: 9, zone: 'deccan_plateau' },
        blocks: [
          { id: 'devanahalli', name: 'Devanahalli', nameHi: 'देवनहल्ली', sector: [0.2, 0.05], baseElev: 900, elevVar: 50, tempAdj: -1, rainAdj: 1, landTypes: ['mixed_agriculture','periurban','irrigated_cropland','plantation'], pNames: [{name:'KIA Road',nameHi:'KIA रोड'},{name:'Vijayapura',nameHi:'विजयपुरा'},{name:'Sadahalli',nameHi:'सदहल्ली'},{name:'Kodigehalli',nameHi:'कोडिगेहल्ली'}] },
          { id: 'doddaballapur', name: 'Doddaballapur', nameHi: 'दोड्डबल्लपुर', sector: [0.28, -0.2], baseElev: 870, elevVar: 40, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','plantation','rainfed_cropland'], pNames: [{name:'Tubgere',nameHi:'तुबगेरे'},{name:'Ghati Subramanya',nameHi:'घाटी सुब्रह्मण्य'},{name:'Mylanahalli',nameHi:'मैलनहल्ली'},{name:'Sasalu',nameHi:'ससालु'}] },
          { id: 'nelamangala', name: 'Nelamangala', nameHi: 'नेलमंगला', sector: [-0.05, -0.28], baseElev: 910, elevVar: 45, tempAdj: -1, rainAdj: 1, landTypes: ['irrigated_cropland','periurban','mixed_agriculture','sparse_forest'], pNames: [{name:'Solur',nameHi:'सोलूर'},{name:'Tyamagondlu',nameHi:'त्यामगोंडलु'},{name:'Thippasandra',nameHi:'तिप्पसंद्र'},{name:'Dabaspet',nameHi:'दबसपेट'}] },
          { id: 'hosakote', name: 'Hosakote', nameHi: 'होसकोटे', sector: [0.05, 0.25], baseElev: 880, elevVar: 35, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','scrubland'], pNames: [{name:'Nandagudi',nameHi:'नंदागुडी'},{name:'Anugondanahalli',nameHi:'अनुगोंडनहल्ली'},{name:'Pillagumpe',nameHi:'पिल्लागुंपे'},{name:'Sulibele',nameHi:'सुलिबेले'}] },
          { id: 'anekal', name: 'Anekal', nameHi: 'अनेकल', sector: [-0.3, 0.05], baseElev: 920, elevVar: 60, tempAdj: -2, rainAdj: 2, landTypes: ['mixed_agriculture','irrigated_cropland','sparse_forest','plantation'], pNames: [{name:'Sarjapura',nameHi:'सर्जापुरा'},{name:'Attibele',nameHi:'अत्तिबेले'},{name:'Jigani',nameHi:'जिगणी'},{name:'Chandapura',nameHi:'चंदापुरा'}] },
          { id: 'kanakapura_area', name: 'Kanakapura', nameHi: 'कनकपुरा', sector: [-0.25, -0.2], baseElev: 850, elevVar: 55, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','plantation','sparse_forest'], pNames: [{name:'Harohalli',nameHi:'हरोहल्ली'},{name:'Sathanur',nameHi:'साथनूर'},{name:'Ramanagara',nameHi:'रामनगर'},{name:'Malavalli',nameHi:'मालवल्ली'}] },
        ],
      },
      {
        id: 'mysuru', name: 'Mysuru', nameHi: 'मैसूरु',
        center: [12.30, 76.64], zoom: 10,
        bounds: { minLat: 12.00, maxLat: 12.60, minLng: 76.34, maxLng: 76.94 },
        climate: { baseTempH: 32, baseTempL: 21, baseRain: 8, zone: 'southern_dry' },
        blocks: [
          { id: 'mysuru_taluk', name: 'Mysuru Taluk', nameHi: 'मैसूरु तालुक', sector: [0.05, 0.0], baseElev: 763, elevVar: 40, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Chamundi Hill',nameHi:'चामुंडी पहाड़ी'},{name:'Varuna',nameHi:'वरुणा'},{name:'Jayapura',nameHi:'जयपुरा'},{name:'Yelwal',nameHi:'येलवाल'}] },
          { id: 'nanjangud', name: 'Nanjangud', nameHi: 'नंजनगुडु', sector: [-0.25, 0.1], baseElev: 686, elevVar: 35, tempAdj: 1, rainAdj: 1, landTypes: ['irrigated_cropland','river_valley','mixed_agriculture','plantation'], pNames: [{name:'Badanaval',nameHi:'बदनवाल'},{name:'Debur',nameHi:'देबूर'},{name:'Hullahalli',nameHi:'हुल्लाहल्ली'},{name:'Kowlande',nameHi:'कवलंदे'}] },
          { id: 't_narasipura', name: 'T. Narasipura', nameHi: 'टी. नरसीपुर', sector: [-0.15, 0.28], baseElev: 650, elevVar: 30, tempAdj: 1, rainAdj: 2, landTypes: ['river_valley','wetland','irrigated_cropland','plantation'], pNames: [{name:'Bannur',nameHi:'बन्नूर'},{name:'Sosale',nameHi:'सोसले'},{name:'Mugur',nameHi:'मुगुर'},{name:'Talakadu',nameHi:'तलकाडू'}] },
          { id: 'hunsur', name: 'Hunsur', nameHi: 'हुनसूरु', sector: [0.1, -0.28], baseElev: 792, elevVar: 50, tempAdj: -1, rainAdj: 1, landTypes: ['mixed_agriculture','plantation','rainfed_cropland','sparse_forest'], pNames: [{name:'Bilikere',nameHi:'बिलीकेरे'},{name:'Gavadagere',nameHi:'गवदगेरे'},{name:'Hanagod',nameHi:'हनगोड'},{name:'Dharmapura',nameHi:'धर्मपुरा'}] },
          { id: 'kr_nagara', name: 'K.R. Nagara', nameHi: 'के.आर. नगर', sector: [0.28, -0.15], baseElev: 780, elevVar: 45, tempAdj: 0, rainAdj: 2, landTypes: ['irrigated_cropland','mixed_agriculture','river_valley','wetland'], pNames: [{name:'Saligrama',nameHi:'सालिग्राम'},{name:'Chunchanakatte',nameHi:'चुंचनकट्टे'},{name:'Mirle',nameHi:'मिर्ले'},{name:'Hebbal',nameHi:'हेब्बाल'}] },
          { id: 'periyapatna', name: 'Periyapatna', nameHi: 'पेरियापटना', sector: [-0.1, -0.3], baseElev: 840, elevVar: 60, tempAdj: -2, rainAdj: 3, landTypes: ['plantation','dense_forest','mixed_agriculture','rainfed_cropland'], pNames: [{name:'Bettadapura',nameHi:'बेट्टदपुरा'},{name:'Kittur',nameHi:'कित्तूर'},{name:'Ravandur',nameHi:'रावंदूर'},{name:'Bylakuppe',nameHi:'बैलकुप्पे'}] },
        ],
      },
    ],
  },
  {
    id: 'tamil_nadu', name: 'Tamil Nadu', nameHi: 'तमिल नाडु',
    center: [11.13, 78.66], zoom: 7,
    districts: [
      {
        id: 'coimbatore', name: 'Coimbatore', nameHi: 'कोयंबटूर',
        center: [11.0, 76.96], zoom: 10,
        bounds: { minLat: 10.70, maxLat: 11.30, minLng: 76.66, maxLng: 77.26 },
        climate: { baseTempH: 32, baseTempL: 22, baseRain: 6, zone: 'western_ghats' },
        blocks: [
          { id: 'coimbatore_n', name: 'Coimbatore North', nameHi: 'कोयंबटूर उत्तर', sector: [0.1, -0.05], baseElev: 420, elevVar: 60, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','plantation'], pNames: [{name:'Peelamedu',nameHi:'पीलमेडु'},{name:'Singanallur',nameHi:'सिंगानल्लूर'},{name:'Ganapathy',nameHi:'गणपति'},{name:'Saravanampatti',nameHi:'सरवनमपट्टी'}] },
          { id: 'mettupalayam', name: 'Mettupalayam', nameHi: 'मेट्टुपालयम', sector: [0.3, -0.15], baseElev: 600, elevVar: 200, tempAdj: -4, rainAdj: 5, landTypes: ['dense_forest','plantation','mixed_agriculture','terrace_farming'], pNames: [{name:'Karamadai',nameHi:'करमदई'},{name:'Annur',nameHi:'अन्नूर'},{name:'Sirumugai',nameHi:'सिरुमुगई'},{name:'Alandurai',nameHi:'अलंदुरई'}] },
          { id: 'pollachi', name: 'Pollachi', nameHi: 'पोल्लाची', sector: [-0.25, -0.15], baseElev: 350, elevVar: 80, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','plantation','mixed_agriculture','rainfed_cropland'], pNames: [{name:'Valparai',nameHi:'वालपाराई'},{name:'Udumalpet',nameHi:'उडुमलपेट'},{name:'Kinathukadavu',nameHi:'किनत्तुकडवु'},{name:'Negamam',nameHi:'नेगमम'}] },
          { id: 'sulur', name: 'Sulur', nameHi: 'सूलुर', sector: [0.05, 0.25], baseElev: 380, elevVar: 50, tempAdj: 1, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','plantation'], pNames: [{name:'Kaniyur',nameHi:'कनियूर'},{name:'Madukkarai',nameHi:'मडुक्करई'},{name:'Vellalore',nameHi:'वेल्लालोर'},{name:'Perur',nameHi:'पेरूर'}] },
          { id: 'thondamuthur', name: 'Thondamuthur', nameHi: 'थोंडमुत्तूर', sector: [-0.05, -0.28], baseElev: 450, elevVar: 100, tempAdj: -1, rainAdj: 3, landTypes: ['sparse_forest','mixed_agriculture','plantation','irrigated_cropland'], pNames: [{name:'Narasipuram',nameHi:'नरसीपुरम'},{name:'Ikkaduthangal',nameHi:'इक्कडुथंगल'},{name:'Boluvampatti',nameHi:'बोलुवमपट्टी'},{name:'Periyanaickenpalayam',nameHi:'पेरियनइकनपालयम'}] },
          { id: 'anamalai', name: 'Anamalai', nameHi: 'अनामलाई', sector: [-0.3, 0.15], baseElev: 520, elevVar: 180, tempAdj: -3, rainAdj: 6, landTypes: ['dense_forest','plantation','terrace_farming','mixed_agriculture'], pNames: [{name:'TopSlip',nameHi:'टॉपस्लिप'},{name:'Sholayar',nameHi:'शोलयर'},{name:'Aaliyar',nameHi:'अलियार'},{name:'Manamboli',nameHi:'मनंबोली'}] },
        ],
      },
      {
        id: 'thanjavur', name: 'Thanjavur', nameHi: 'तंजावुर',
        center: [10.79, 79.14], zoom: 10,
        bounds: { minLat: 10.49, maxLat: 11.09, minLng: 78.84, maxLng: 79.44 },
        climate: { baseTempH: 35, baseTempL: 25, baseRain: 7, zone: 'cauvery_delta' },
        blocks: [
          { id: 'thanjavur_blk', name: 'Thanjavur', nameHi: 'तंजावुर ब्लॉक', sector: [0.0, -0.05], baseElev: 60, elevVar: 10, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','urban','wetland','mixed_agriculture'], pNames: [{name:'Mariamman Kovil',nameHi:'मारियम्मन कोविल'},{name:'Pillaiyarpatti',nameHi:'पिल्लैयारपट्टी'},{name:'Vallam',nameHi:'वल्लम'},{name:'Nanjikottai',nameHi:'नंजिकोट्टै'}] },
          { id: 'kumbakonam', name: 'Kumbakonam', nameHi: 'कुम्भकोणम', sector: [0.28, 0.15], baseElev: 45, elevVar: 8, tempAdj: 1, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','plantation'], pNames: [{name:'Swamimalai',nameHi:'स्वामिमलै'},{name:'Thiruvidaimaruthur',nameHi:'तिरुविडैमरुथूर'},{name:'Patteswaram',nameHi:'पट्टीश्वरम'},{name:'Darasuram',nameHi:'दारासुरम'}] },
          { id: 'papanasam', name: 'Papanasam', nameHi: 'पापनासम', sector: [0.15, -0.25], baseElev: 55, elevVar: 12, tempAdj: 0, rainAdj: 2, landTypes: ['irrigated_cropland','wetland','river_valley','mixed_agriculture'], pNames: [{name:'Ayyampettai',nameHi:'अय्यमपेट्टै'},{name:'Thirukattupalli',nameHi:'तिरुकट्टुपल्ली'},{name:'Thiruvaiyaru',nameHi:'तिरुवैयारु'},{name:'Ammapettai',nameHi:'अम्मापेट्टै'}] },
          { id: 'orathanadu', name: 'Orathanadu', nameHi: 'ओरत्तनाडु', sector: [-0.25, 0.05], baseElev: 50, elevVar: 10, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Madukkur',nameHi:'मडुक्कुर'},{name:'Peravurani',nameHi:'पेरवुरणी'},{name:'Aranthangi',nameHi:'अरन्ठांगी'},{name:'Gandarvakottai',nameHi:'गंदर्वकोट्टै'}] },
          { id: 'thiruvidaimaruthur', name: 'Thiruvidaimaruthur', nameHi: 'तिरुविडैमरुथूर', sector: [0.25, -0.15], baseElev: 40, elevVar: 8, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','plantation'], pNames: [{name:'Kuthalam',nameHi:'कुथालम'},{name:'Mayiladuthurai',nameHi:'मयिलादुतुरै'},{name:'Sirkali',nameHi:'सिरकाळी'},{name:'Poompuhar',nameHi:'पूम्पुहार'}] },
          { id: 'budalur', name: 'Budalur', nameHi: 'बुदलूर', sector: [-0.15, -0.25], baseElev: 48, elevVar: 9, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','wetland','rainfed_cropland'], pNames: [{name:'Ammachatram',nameHi:'अम्माचत्रम'},{name:'Saliyamangalam',nameHi:'सलियमंगलम'},{name:'Aduthurai',nameHi:'अडुत्तुरै'},{name:'Annamalai Nagar',nameHi:'अन्नामलै नगर'}] },
        ],
      },
    ],
  },
  {
    id: 'kerala', name: 'Kerala', nameHi: 'केरल',
    center: [10.85, 76.27], zoom: 7,
    districts: [
      {
        id: 'wayanad', name: 'Wayanad', nameHi: 'वायनाड',
        center: [11.68, 76.13], zoom: 10,
        bounds: { minLat: 11.38, maxLat: 11.98, minLng: 75.83, maxLng: 76.43 },
        climate: { baseTempH: 27, baseTempL: 18, baseRain: 24, zone: 'highland_plantation' },
        blocks: [
          { id: 'kalpetta', name: 'Kalpetta', nameHi: 'कलपेट्टा', sector: [-0.05, -0.1], baseElev: 780, elevVar: 150, tempAdj: 0, rainAdj: 2, landTypes: ['plantation','dense_forest','mixed_agriculture','periurban'], pNames: [{name:'Meppadi',nameHi:'मेप्पाडी'},{name:'Vythiri',nameHi:'वैथिरी'},{name:'Pozhuthana',nameHi:'पोझुथाना'},{name:'Muttil',nameHi:'मुट्टिल'}] },
          { id: 'sulthan_bathery', name: 'Sulthan Bathery', nameHi: 'सुल्तान बथरी', sector: [0.1, 0.25], baseElev: 930, elevVar: 180, tempAdj: -2, rainAdj: -1, landTypes: ['plantation','sparse_forest','mixed_agriculture','irrigated_cropland'], pNames: [{name:'Ambalavayal',nameHi:'अंबालावायल'},{name:'Noolpuzha',nameHi:'नूलपुझा'},{name:'Nenmeni',nameHi:'नेनमेनी'},{name:'Mullankolly',nameHi:'मुल्लनकोल्ली'}] },
          { id: 'mananthavady', name: 'Mananthavady', nameHi: 'मानंतवाडी', sector: [0.28, -0.15], baseElev: 760, elevVar: 160, tempAdj: 1, rainAdj: 4, landTypes: ['plantation','river_valley','wetland','dense_forest'], pNames: [{name:'Thirunelli',nameHi:'तिरुनेल्ली'},{name:'Vellamunda',nameHi:'वेल्लामुंडा'},{name:'Thavinhal',nameHi:'थाविन्हाल्'},{name:'Edavaka',nameHi:'एडावाका'}] },
          { id: 'panamaram', name: 'Panamaram', nameHi: 'पनमरम', sector: [0.08, 0.02], baseElev: 740, elevVar: 90, tempAdj: 1, rainAdj: 3, landTypes: ['wetland','river_valley','mixed_agriculture','plantation'], pNames: [{name:'Kaniyambetta',nameHi:'कणियामबेटा'},{name:'Poothadi',nameHi:'पूथाडी'},{name:'Pulpally',nameHi:'पुलपल्ली'},{name:'Padinharethara',nameHi:'पदिन्हारेथारा'}] },
          { id: 'thirunelly_area', name: 'Tholpetty Wilds', nameHi: 'थोलपेट्टी', sector: [0.32, 0.1], baseElev: 850, elevVar: 220, tempAdj: -3, rainAdj: 5, landTypes: ['dense_forest','sparse_forest','terrace_farming','plantation'], pNames: [{name:'Bavali',nameHi:'बावली'},{name:'Appapara',nameHi:'अप्पापारा'},{name:'Begur',nameHi:'बेगुर'},{name:'Kattikulam',nameHi:'कट्टीकुलम'}] },
          { id: 'vythiri_hills', name: 'Lakkidi Valley', nameHi: 'लक्किडी', sector: [-0.25, -0.2], baseElev: 920, elevVar: 250, tempAdj: -4, rainAdj: 8, landTypes: ['dense_forest','plantation','terrace_farming','wetland'], pNames: [{name:'Chundale',nameHi:'चुंडाले'},{name:'Achanur',nameHi:'अचानूर'},{name:'Achooranam',nameHi:'अचूरनम'},{name:'Kunnathidavaka',nameHi:'कुन्नातिडावका'}] },
        ],
      },
      {
        id: 'palakkad', name: 'Palakkad', nameHi: 'पालक्काड',
        center: [10.78, 76.65], zoom: 10,
        bounds: { minLat: 10.48, maxLat: 11.08, minLng: 76.35, maxLng: 76.95 },
        climate: { baseTempH: 34, baseTempL: 23, baseRain: 14, zone: 'palakkad_gap' },
        blocks: [
          { id: 'palakkad_blk', name: 'Palakkad Town', nameHi: 'पालक्काड शहर', sector: [0.05, 0.0], baseElev: 84, elevVar: 15, tempAdj: 1, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Pirayiri',nameHi:'पिरायिरी'},{name:'Marutharode',nameHi:'मरुथारोड'},{name:'Kodumba',nameHi:'कोडुम्बा'},{name:'Kannadi',nameHi:'कन्नाडी'}] },
          { id: 'chittur', name: 'Chittur', nameHi: 'चित्तूर', sector: [-0.15, 0.22], baseElev: 130, elevVar: 25, tempAdj: 2, rainAdj: -3, landTypes: ['irrigated_cropland','rainfed_cropland','plantation','mixed_agriculture'], pNames: [{name:'Nallepilly',nameHi:'नल्लेपिल्ली'},{name:'Kozhinjampara',nameHi:'कोझिंजम्पारा'},{name:'Vandithavalam',nameHi:'वंदिथावलम'},{name:'Pattanchery',nameHi:'पट्टनचेरी'}] },
          { id: 'alathur', name: 'Alathur', nameHi: 'अलाथूर', sector: [-0.25, -0.1], baseElev: 95, elevVar: 20, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','plantation'], pNames: [{name:'Kavassery',nameHi:'कवस्सेरी'},{name:'Tarur',nameHi:'तरूर'},{name:'Melarcode',nameHi:'मेलारकोड'},{name:'Erimayur',nameHi:'एरिमायूर'}] },
          { id: 'ottapalam', name: 'Ottapalam', nameHi: 'ओट्टापालम', sector: [0.1, -0.28], baseElev: 54, elevVar: 18, tempAdj: -1, rainAdj: 3, landTypes: ['river_valley','wetland','plantation','irrigated_cropland'], pNames: [{name:'Ambalapara',nameHi:'अंबालापारा'},{name:'Vaniamkulam',nameHi:'वाणियमकुलम'},{name:'Ananganadi',nameHi:'अनंगनाडी'},{name:'Lakkidi-Perur',nameHi:'लक्किडी-पेरूर'}] },
          { id: 'mannarkkad', name: 'Mannarkkad', nameHi: 'मन्नारक्काड', sector: [0.28, -0.15], baseElev: 160, elevVar: 80, tempAdj: -2, rainAdj: 6, landTypes: ['dense_forest','plantation','terrace_farming','river_valley'], pNames: [{name:'Agali',nameHi:'अगाली'},{name:'Kanjirapuzha',nameHi:'कांजिरपुझा'},{name:'Alanallur',nameHi:'अलानल्लूर'},{name:'Kottoppadam',nameHi:'कोट्टोपाडम'}] },
          { id: 'kollengode', name: 'Kollengode', nameHi: 'कोल्लेनगोड़े', sector: [-0.28, 0.15], baseElev: 140, elevVar: 45, tempAdj: 0, rainAdj: 2, landTypes: ['mixed_agriculture','plantation','irrigated_cropland','sparse_forest'], pNames: [{name:'Nenmara',nameHi:'नेनमारा'},{name:'Ayiloor',nameHi:'अयिलूर'},{name:'Vadavannur',nameHi:'वडवन्नूर'},{name:'Pallassana',nameHi:'पल्लास्सना'}] },
        ],
      },
    ],
  },
  {
    id: 'assam', name: 'Assam', nameHi: 'असम',
    center: [26.2, 92.94], zoom: 7,
    districts: [
      {
        id: 'kamrup', name: 'Kamrup', nameHi: 'कामरूप',
        center: [26.14, 91.74], zoom: 10,
        bounds: { minLat: 25.84, maxLat: 26.44, minLng: 91.44, maxLng: 92.04 },
        climate: { baseTempH: 31, baseTempL: 22, baseRain: 20, zone: 'brahmaputra_valley' },
        blocks: [
          { id: 'guwahati', name: 'Guwahati', nameHi: 'गुवाहाटी', sector: [0.05, 0.0], baseElev: 55, elevVar: 30, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','wetland','mixed_agriculture'], pNames: [{name:'Dispur',nameHi:'दिसपुर'},{name:'Paltan Bazaar',nameHi:'पलटन बाजार'},{name:'Beltola',nameHi:'बेलतोला'},{name:'Jalukbari',nameHi:'जालुकबाड़ी'}] },
          { id: 'hajo', name: 'Hajo', nameHi: 'हाजो', sector: [0.15, -0.25], baseElev: 45, elevVar: 20, tempAdj: 0, rainAdj: 2, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','river_valley'], pNames: [{name:'Hajo Town',nameHi:'हाजो शहर'},{name:'Sualkuchi',nameHi:'सुआलकुची'},{name:'Boko',nameHi:'बोको'},{name:'Chaygaon',nameHi:'चयगाँव'}] },
          { id: 'rangia', name: 'Rangia', nameHi: 'रंगिया', sector: [0.28, -0.1], baseElev: 50, elevVar: 15, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','wetland','plantation'], pNames: [{name:'Nalbari Road',nameHi:'नलबाड़ी रोड'},{name:'Kamalpur',nameHi:'कमलपुर'},{name:'Baihata',nameHi:'बैहटा'},{name:'Tamulpur',nameHi:'तमुलपुर'}] },
          { id: 'palasbari', name: 'Palasbari', nameHi: 'पलासबारी', sector: [-0.15, -0.2], baseElev: 40, elevVar: 12, tempAdj: 1, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','river_valley','mixed_agriculture'], pNames: [{name:'Mirza',nameHi:'मिर्ज़ा'},{name:'Nagarbera',nameHi:'नगरबेड़ा'},{name:'Chamaria',nameHi:'चमारिया'},{name:'Kukurmara',nameHi:'कुकुरमारा'}] },
          { id: 'kamalpur_a', name: 'Kamalpur', nameHi: 'कमलपुर', sector: [0.22, 0.2], baseElev: 48, elevVar: 18, tempAdj: -1, rainAdj: 3, landTypes: ['dense_forest','mixed_agriculture','wetland','plantation'], pNames: [{name:'Chandrapur',nameHi:'चंद्रपुर'},{name:'Goroimari',nameHi:'गोरोईमारी'},{name:'Bezera',nameHi:'बेज़ेरा'},{name:'Dimoria',nameHi:'डिमोरिया'}] },
          { id: 'sonapur', name: 'Sonapur', nameHi: 'सोनापुर', sector: [-0.2, 0.25], baseElev: 60, elevVar: 25, tempAdj: -1, rainAdj: 2, landTypes: ['mixed_agriculture','sparse_forest','irrigated_cropland','plantation'], pNames: [{name:'Khetri',nameHi:'खेतड़ी'},{name:'Tepesia',nameHi:'तेपेसिया'},{name:'Byrnihat',nameHi:'बिरनिहाट'},{name:'Amingaon',nameHi:'अमिनगांव'}] },
        ],
      },
      {
        id: 'dibrugarh', name: 'Dibrugarh', nameHi: 'डिब्रूगढ़',
        center: [27.47, 94.91], zoom: 10,
        bounds: { minLat: 27.17, maxLat: 27.77, minLng: 94.61, maxLng: 95.21 },
        climate: { baseTempH: 30, baseTempL: 21, baseRain: 26, zone: 'upper_brahmaputra' },
        blocks: [
          { id: 'dibrugarh_blk', name: 'Dibrugarh Town', nameHi: 'डिब्रूगढ़ शहर', sector: [0.1, -0.1], baseElev: 108, elevVar: 12, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','river_valley','wetland'], pNames: [{name:'Chowkidinghee',nameHi:'चौकीडिंगी'},{name:'Naliapool',nameHi:'नालियापूल'},{name:'Maijan',nameHi:'माईजान'},{name:'Mornoi',nameHi:'मोरनोई'}] },
          { id: 'chabua', name: 'Chabua', nameHi: 'चाबुआ', sector: [0.25, 0.15], baseElev: 105, elevVar: 15, tempAdj: 0, rainAdj: 2, landTypes: ['plantation','irrigated_cropland','mixed_agriculture','wetland'], pNames: [{name:'Dikpm',nameHi:'दिक्पम'},{name:'Chabua Tea',nameHi:'चाबुआ टी'},{name:'Dinjoy Satra',nameHi:'दिनजॉय सत्र'},{name:'Niz Chabua',nameHi:'निज चाबुआ'}] },
          { id: 'tengakhat', name: 'Tengakhat', nameHi: 'तेंगाखात', sector: [0.0, 0.28], baseElev: 112, elevVar: 14, tempAdj: -1, rainAdj: 3, landTypes: ['plantation','dense_forest','mixed_agriculture','irrigated_cropland'], pNames: [{name:'Tiapok',nameHi:'तियापोक'},{name:'Bhadoi Panchali',nameHi:'भादोई पांचाली'},{name:'Tipling',nameHi:'तिपलिंग'},{name:'Chungijan',nameHi:'चुंगीजान'}] },
          { id: 'naharkatiya', name: 'Naharkatiya', nameHi: 'नाहरकटिया', sector: [-0.25, 0.2], baseElev: 120, elevVar: 25, tempAdj: -1, rainAdj: 4, landTypes: ['plantation','river_valley','dense_forest','mixed_agriculture'], pNames: [{name:'Duliajan',nameHi:'दुलियाजान'},{name:'Joypur',nameHi:'जॉयपुर'},{name:'Namrup',nameHi:'नामरूप'},{name:'Merbil',nameHi:'मेरबिल'}] },
          { id: 'moran', name: 'Moran', nameHi: 'मोरान', sector: [-0.25, -0.2], baseElev: 115, elevVar: 18, tempAdj: 1, rainAdj: 1, landTypes: ['plantation','irrigated_cropland','mixed_agriculture','rainfed_cropland'], pNames: [{name:'Moranhat',nameHi:'मोरानहाट'},{name:'Khowang',nameHi:'खोवांग'},{name:'Tiloi',nameHi:'तिलोई'},{name:'Sepon',nameHi:'सेपोन'}] },
          { id: 'barbaruah', name: 'Barbaruah', nameHi: 'बरबरुआ', sector: [-0.05, -0.28], baseElev: 104, elevVar: 10, tempAdj: 0, rainAdj: 2, landTypes: ['river_valley','wetland','irrigated_cropland','plantation'], pNames: [{name:'Lepetkata',nameHi:'लेपेतकाटा'},{name:'Bogibeel Ghat',nameHi:'बोगीबील घाट'},{name:'Borborooah',nameHi:'बरबरुआ'},{name:'Kotoha',nameHi:'कोतोहा'}] },
        ],
      },
    ],
  },
];

// ── Organic Land Boundary Generation ─────────────────────────────────────────
// Generates natural, non-rectangular polygons anchored to geographic sector coordinates
function makeOrganicPoly(centerLat, centerLng, radiusLat, radiusLng, seedOffset, numPoints = 12) {
  const coords = [];
  const startAngle = randRange(0, Math.PI / 4);
  for (let i = 0; i < numPoints; i++) {
    const angle = startAngle + (i / numPoints) * 2 * Math.PI;
    // Harmonic modulation creates natural, curved river/ridge boundaries
    const harmonic1 = Math.sin(angle * 3 + seedOffset) * 0.18;
    const harmonic2 = Math.cos(angle * 2 - seedOffset) * 0.12;
    const noise = (rand() - 0.5) * 0.08;
    const r = 1 + harmonic1 + harmonic2 + noise;
    
    const lat = centerLat + Math.sin(angle) * radiusLat * r;
    const lng = centerLng + Math.cos(angle) * radiusLng * r;
    coords.push([+(lng.toFixed(4)), +(lat.toFixed(4))]);
  }
  // Close polygon
  coords.push(coords[0]);
  return coords;
}

function polyCenter(coords) {
  const c = coords.slice(0, -1);
  return [+(c.reduce((a,p)=>a+p[1],0)/c.length).toFixed(4), +(c.reduce((a,p)=>a+p[0],0)/c.length).toFixed(4)];
}

const cropAdvisories = {
  en: [
    { icon: '💧', text: 'Delay irrigation by 1 day — light to moderate showers expected.' },
    { icon: '🌾', text: 'Good window for transplanting and weeding in the next 48 hours.' },
    { icon: '❄️', text: 'Night temperature dip detected. Cover vulnerable nursery beds.' },
    { icon: '🌡️', text: 'Heatwave warning: avoid afternoon pesticide spraying to prevent leaf scorch.' },
    { icon: '🌧️', text: 'Heavy rainfall alert. Keep field drainage channels clear of debris.' },
    { icon: '☀️', text: 'Clear sunny spell ahead. Ideal conditions for harvesting and sun-drying.' },
    { icon: '🍃', text: 'Gusty winds forecast: postpone foliar nutrient sprays.' },
    { icon: '🌿', text: 'Optimal soil moisture conditions for sowing season crops this week.' },
  ],
  hi: [
    { icon: '💧', text: 'सिंचाई 1 दिन टालें — हल्की से मध्यम बारिश की संभावना है।' },
    { icon: '🌾', text: 'अगले 48 घंटों में निराई-गुड़ाई और रोपाई के लिए अनुकूल समय।' },
    { icon: '❄️', text: 'रात के तापमान में गिरावट। कोमल नर्सरी पौधों को ढकें।' },
    { icon: '🌡️', text: 'लू चेतावनी: दोपहर में कीटनाशक छिड़काव न करें, पत्तियां झुलस सकती हैं।' },
    { icon: '🌧️', text: 'भारी बारिश की संभावना। जल निकासी नालियाँ साफ रखें।' },
    { icon: '☀️', text: 'धूप वाला मौसम। फसल कटाई और सुखाने के लिए आदर्श स्थिति।' },
    { icon: '🍃', text: 'तेज़ हवा की चेतावनी: पर्णीय पोषण छिड़काव स्थगित करें।' },
    { icon: '🌿', text: 'इस सप्ताह फसलों की बुवाई के लिए मिट्टी में अनुकूल नमी।' },
  ],
};

function generateFiveDayForecast(baseTH, baseTL, baseRain, elev) {
  const base = new Date('2026-09-28');
  return Array.from({length: 5}, (_, d) => {
    const date = new Date(base); date.setDate(date.getDate() + d);
    const v = (rand() - 0.5) * 3.5;
    const tH = +(baseTH + v).toFixed(1), tL = +(baseTL + v * 0.6).toFixed(1);
    const rain = +Math.max(0, baseRain + (rand() - 0.3) * 12).toFixed(1);
    const u = 1 + d * 0.15 + (elev / 5000);
    const conf = randInt(68, 96);
    return {
      date: date.toISOString().split('T')[0],
      dateLabel: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      tempHigh: tH, tempLow: tL,
      tempHighUpper: +(tH + 1.4 * u).toFixed(1), tempHighLower: +(tH - 1.4 * u).toFixed(1),
      tempLowUpper: +(tL + 1.1 * u).toFixed(1), tempLowLower: +(tL - 1.1 * u).toFixed(1),
      rainfall: rain, rainfallUpper: +(rain + 4 * u).toFixed(1), rainfallLower: +Math.max(0, rain - 3.5 * u).toFixed(1),
      humidity: randInt(45, 92), windSpeed: randInt(6, 26), confidence: conf,
      icon: rain > 12 ? '🌧️' : rain > 3 ? '🌦️' : tH > 37 ? '🌡️' : tL < 12 ? '❄️' : '☀️',
    };
  });
}

// ── Build hierarchical data structures ──────────────────────────────────────
export const allStates = [];
export const allDistricts = [];
export const allBlocks = [];
export const allPanchayats = [];
let advIdx = 0;

stateDefinitions.forEach((sd, sIdx) => {
  const stateObj = { id: sd.id, name: sd.name, nameHi: sd.nameHi, center: sd.center, zoom: sd.zoom, districtIds: [] };

  sd.districts.forEach((dd, dIdx) => {
    const distObj = { 
      id: dd.id, stateId: sd.id, stateName: sd.name, stateNameHi: sd.nameHi, 
      name: dd.name, nameHi: dd.nameHi, center: dd.center, zoom: dd.zoom, 
      bounds: dd.bounds, climate: dd.climate, blockIds: [] 
    };
    const distBlockGeo = { type: 'FeatureCollection', features: [] };
    const distPanchGeo = { type: 'FeatureCollection', features: [] };

    const latSpan = dd.bounds.maxLat - dd.bounds.minLat;
    const lngSpan = dd.bounds.maxLng - dd.bounds.minLng;
    const bRadLat = latSpan * 0.22;
    const bRadLng = lngSpan * 0.22;

    dd.blocks.forEach((bd, bIdx) => {
      // Natural block centroid based on sector orientation within district
      const bCenterLat = dd.center[0] + bd.sector[0] * latSpan;
      const bCenterLng = dd.center[1] + bd.sector[1] * lngSpan;
      const bCoords = makeOrganicPoly(bCenterLat, bCenterLng, bRadLat, bRadLng, sIdx * 10 + dIdx * 5 + bIdx, 14);
      const computedBCenter = polyCenter(bCoords);

      const tH = +(dd.climate.baseTempH + bd.tempAdj).toFixed(1);
      const tL = +(dd.climate.baseTempL + bd.tempAdj * 0.6).toFixed(1);
      const rain = +(dd.climate.baseRain + bd.rainAdj).toFixed(1);
      const bHumid = randInt(55, 82);
      const bWind = randInt(8, 22);

      const blockObj = {
        id: \`\${dd.id}_\${bd.id}\`, blockId: bd.id, districtId: dd.id, stateId: sd.id,
        name: bd.name, nameHi: bd.nameHi, districtName: dd.name, districtNameHi: dd.nameHi,
        stateName: sd.name, stateNameHi: sd.nameHi, center: computedBCenter, elevation: bd.baseElev,
        forecast: { tempHigh: tH, tempLow: tL, rainfall: rain, humidity: bHumid, windSpeed: bWind },
        geojson: { 
          type: 'Feature', 
          properties: { 
            id: \`\${dd.id}_\${bd.id}\`, 
            blockId: bd.id, 
            districtId: dd.id, 
            stateId: sd.id, 
            name: bd.name, 
            nameHi: bd.nameHi, 
            districtName: dd.name, 
            districtNameHi: dd.nameHi,
            stateName: sd.name, 
            stateNameHi: sd.nameHi,
            type: 'block', 
            tempHigh: tH, 
            tempLow: tL, 
            rainfall: rain, 
            elevation: bd.baseElev,
            humidity: bHumid, 
            windSpeed: bWind,
            panchayatCount: bd.pNames.length
          }, 
          geometry: { type: 'Polygon', coordinates: [bCoords] } 
        },
        panchayatIds: [],
      };
      distBlockGeo.features.push(blockObj.geojson);

      // Subdivide block into 4 organic panchayat territories
      const pRadLat = bRadLat * 0.48;
      const pRadLng = bRadLng * 0.48;
      const pOffsets = [[0.4, 0.4], [0.4, -0.4], [-0.4, -0.4], [-0.4, 0.4]];

      bd.pNames.forEach((pn, pIdx) => {
        const offset = pOffsets[pIdx % 4];
        const pCenterLat = computedBCenter[0] + offset[0] * bRadLat * 0.7;
        const pCenterLng = computedBCenter[1] + offset[1] * bRadLng * 0.7;
        const pCoords = makeOrganicPoly(pCenterLat, pCenterLng, pRadLat, pRadLng, bIdx * 8 + pIdx, 10);
        const computedPCenter = polyCenter(pCoords);

        const elev = Math.round(bd.baseElev + (rand() - 0.5) * bd.elevVar * 1.8);
        const lu = bd.landTypes[pIdx % bd.landTypes.length];
        const dtw = +(randRange(0.4, 9.5)).toFixed(1);
        const eEff = -(elev - bd.baseElev) * 0.006;
        const wEff = dtw < 2 ? 1.4 : dtw < 5 ? 0.5 : -0.5;
        const lEff = ['dense_forest','wetland'].includes(lu) ? -1.2 : ['urban','periurban'].includes(lu) ? 1.8 : 0;
        const rBoost = ['river_valley','wetland'].includes(lu) ? 2.8 : elev > 1200 ? 4.5 : 0;

        const pTH = +(tH + eEff + lEff + (rand() - 0.5) * 1.6).toFixed(1);
        const pTL = +(tL + eEff * 0.7 + wEff + (rand() - 0.5) * 1.4).toFixed(1);
        const pRain = +Math.max(0, rain + rBoost + (rand() - 0.5) * 5).toFixed(1);
        const conf = randInt(68, 96);
        const pHumid = randInt(50, 90);
        const pWind = randInt(6, 24);
        const pId = \`\${dd.id}_\${bd.id}_\${pn.name.toLowerCase().replace(/\\\\s+/g, '_')}\`;

        const pObj = {
          id: pId, blockId: \`\${dd.id}_\${bd.id}\`, districtId: dd.id, stateId: sd.id,
          blockName: bd.name, blockNameHi: bd.nameHi, districtName: dd.name, districtNameHi: dd.nameHi,
          stateName: sd.name, stateNameHi: sd.nameHi,
          name: pn.name, nameHi: pn.nameHi, center: computedPCenter, elevation: elev, landUse: lu, distToWater: dtw,
          forecast: { tempHigh: pTH, tempLow: pTL, rainfall: pRain, humidity: pHumid, windSpeed: pWind, confidence: conf },
          fiveDayForecast: generateFiveDayForecast(pTH, pTL, pRain, elev),
          deviation: { 
            tempOffset: +(pTH - tH).toFixed(1), 
            rainfallOffset: +(pRain - rain).toFixed(1),
            factors: { 
              elevation: { value: elev, effect: +(eEff).toFixed(1), label: \`\${elev}m\` }, 
              distToWater: { value: dtw, effect: +(wEff).toFixed(1), label: \`\${dtw} km\` }, 
              landUse: { value: lu, effect: +(lEff).toFixed(1) } 
            }
          },
          advisory: { en: cropAdvisories.en[advIdx % 8], hi: cropAdvisories.hi[advIdx % 8] },
        };
        advIdx++;
        allPanchayats.push(pObj);
        blockObj.panchayatIds.push(pId);
        
        distPanchGeo.features.push({ 
          type: 'Feature', 
          properties: { 
            id: pId, 
            name: pn.name, 
            nameHi: pn.nameHi, 
            blockId: \`\${dd.id}_\${bd.id}\`, 
            blockName: bd.name, 
            blockNameHi: bd.nameHi, 
            districtName: dd.name,
            districtNameHi: dd.nameHi,
            stateName: sd.name,
            stateNameHi: sd.nameHi,
            tempHigh: pTH, 
            tempLow: pTL, 
            rainfall: pRain, 
            elevation: elev, 
            landUse: lu, 
            confidence: conf, 
            type: 'panchayat' 
          }, 
          geometry: { type: 'Polygon', coordinates: [pCoords] } 
        });
      });
      allBlocks.push(blockObj);
      distObj.blockIds.push(blockObj.id);
    });

    distObj.blockGeoJSON = distBlockGeo;
    distObj.panchayatGeoJSON = distPanchGeo;
    allDistricts.push(distObj);
    stateObj.districtIds.push(dd.id);
  });
  allStates.push(stateObj);
});

// ── Query & lookup helpers ──────────────────────────────────────────────────
export const defaultDistrictId = 'dehradun';
export function getDistrict(id) { return allDistricts.find(d => d.id === id); }
export function getDistrictBlocks(distId) { return allBlocks.filter(b => b.districtId === distId); }
export function getDistrictPanchayats(distId) { return allPanchayats.filter(p => p.districtId === distId); }
export function getBlockPanchayats(blockId) { return allPanchayats.filter(p => p.blockId === blockId); }
export function findNearestPanchayat(lat, lng) {
  let nearest = null, minDist = Infinity;
  for (const p of allPanchayats) {
    const d = Math.hypot(p.center[0] - lat, p.center[1] - lng);
    if (d < minDist) { minDist = d; nearest = p; }
  }
  return nearest;
}

// ── Color scales ────────────────────────────────────────────────────────────
export function tempToColor(t) { return t <= 10 ? '#3B82F6' : t <= 18 ? '#06B6D4' : t <= 24 ? '#22C55E' : t <= 30 ? '#EAB308' : t <= 35 ? '#F97316' : '#EF4444'; }
export function rainToColor(r) { return r <= 2 ? '#FEF3C7' : r <= 8 ? '#A7F3D0' : r <= 15 ? '#6EE7B7' : r <= 25 ? '#3B82F6' : '#1D4ED8'; }
export function confidenceToColor(c) { return c >= 85 ? '#22C55E' : c >= 70 ? '#EAB308' : '#EF4444'; }
export const tempLegend = [{label:'≤10°C',color:'#3B82F6'},{label:'10–18°C',color:'#06B6D4'},{label:'18–24°C',color:'#22C55E'},{label:'24–30°C',color:'#EAB308'},{label:'30–35°C',color:'#F97316'},{label:'>35°C',color:'#EF4444'}];
export const rainLegend = [{label:'0–2 mm',color:'#FEF3C7'},{label:'2–8 mm',color:'#A7F3D0'},{label:'8–15 mm',color:'#6EE7B7'},{label:'15–25 mm',color:'#3B82F6'},{label:'>25 mm',color:'#1D4ED8'}];

// ── Platform-wide stats ─────────────────────────────────────────────────────
export const platformStats = {
  totalStates: allStates.length,
  totalDistricts: allDistricts.length,
  totalBlocks: allBlocks.length,
  totalPanchayats: allPanchayats.length,
  farmersReached: '2.4L+',
  forecastAccuracy: '84.2%',
};

// ── Feedback & Admin datasets ───────────────────────────────────────────────
export const weatherLabels = {
  en: { rained:'It Rained', no_rain:'No Rain', frost:'Frost', heatwave:'Heatwave', normal:'Normal', heavy_rain:'Heavy Rain' },
  hi: { rained:'बारिश हुई', no_rain:'बारिश नहीं', frost:'पाला', heatwave:'लू', normal:'सामान्य', heavy_rain:'भारी बारिश' },
};

export const feedbackData = [];
const weatherEvents = ['rained','no_rain','frost','heatwave','normal','heavy_rain'];
const fbBase = new Date('2026-09-01');
for (let i = 0; i < 150; i++) {
  const p = allPanchayats[randInt(0, allPanchayats.length - 1)];
  const d = new Date(fbBase); d.setDate(d.getDate() + randInt(0, 26));
  feedbackData.push({ 
    id: \`fb_\${i}\`, panchayatId: p.id, panchayatName: p.name, blockName: p.blockName, 
    districtName: p.districtName, stateName: p.stateName, date: d.toISOString().split('T')[0], 
    event: pick(weatherEvents), notes: '', verified: rand() > 0.28 
  });
}

export function generateAccuracyTrend() {
  const data = []; const base = new Date('2026-08-28'); let acc = 74;
  for (let d = 0; d < 30; d++) { 
    const dt = new Date(base); dt.setDate(dt.getDate() + d); 
    acc = Math.min(98, Math.max(62, acc + (rand() - 0.38) * 3.8));
    data.push({ date: dt.toISOString().split('T')[0], dateShort: \`\${dt.getDate()}/\${dt.getMonth() + 1}\`, accuracy: +(acc.toFixed(1)), reports: randInt(6, 28) }); 
  }
  return data;
}

export const adminStats = { 
  totalPanchayats: allPanchayats.length, 
  verifiedReports: feedbackData.filter(f => f.verified).length, 
  avgAccuracy: 84.2, 
  activeAlerts: randInt(8, 22), 
  lastUpdated: '2026-09-28 18:30 IST' 
};

export const verificationRows = allPanchayats.slice(0, 80).map(p => {
  const aTH = +(p.forecast.tempHigh + (rand() - 0.5) * 3.8).toFixed(1);
  const aR = +Math.max(0, p.forecast.rainfall + (rand() - 0.5) * 7).toFixed(1);
  const err = Math.abs(aTH - p.forecast.tempHigh);
  return { 
    id: p.id, panchayat: p.name, panchayatHi: p.nameHi, block: p.blockName, blockHi: p.blockNameHi, 
    district: p.districtName, districtHi: p.districtNameHi, state: p.stateName, stateHi: p.stateNameHi,
    forecastedTemp: p.forecast.tempHigh, actualTemp: aTH, forecastedRain: p.forecast.rainfall, 
    actualRain: aR, confidence: p.forecast.confidence, status: err < 1.4 ? 'verified' : err < 2.8 ? 'pending' : 'alert' 
  };
});

// ── Backward-compatible aliases ─────────────────────────────────────────────
export const district = { name: 'Dehradun', nameHi: 'देहरादून', state: 'Uttarakhand', stateHi: 'उत्तराखंड', center: [30.35, 78.0], zoom: 10 };
export const blocks = getDistrictBlocks('dehradun');
export const panchayats = getDistrictPanchayats('dehradun');
export const panchayatGeoJSON = getDistrict('dehradun')?.panchayatGeoJSON || { type: 'FeatureCollection', features: [] };
export const blockGeoJSON = getDistrict('dehradun')?.blockGeoJSON || { type: 'FeatureCollection', features: [] };
\`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'mockData.js'), fileContent, 'utf8');
console.log('Successfully generated comprehensive mockData.js with 12 states, 24 districts, organic polygons!');
