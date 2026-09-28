// ─────────────────────────────────────────────────────────────────────────────
// KrishiDrishti — All-India Mock Data Generator
// 8 states × 2 districts × 6 blocks × 4 panchayats = 384 panchayats
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

// ── State definitions with districts ────────────────────────────────────────
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
          { id: 'chakrata', name: 'Chakrata', nameHi: 'चकराता', row: 2, col: 0, baseElev: 2100, elevVar: 400, tempAdj: -10, rainAdj: 6, landTypes: ['dense_forest','sparse_forest','alpine_meadow','mixed_agriculture'], pNames: [{name:'Deoban',nameHi:'देओबन'},{name:'Lokhandi',nameHi:'लोखंडी'},{name:'Kimona',nameHi:'किमोना'},{name:'Budher',nameHi:'बुधेर'}] },
          { id: 'kalsi', name: 'Kalsi', nameHi: 'कालसी', row: 2, col: 1, baseElev: 850, elevVar: 250, tempAdj: -2, rainAdj: 2, landTypes: ['river_valley','mixed_agriculture','sparse_forest','terrace_farming'], pNames: [{name:'Sahiya',nameHi:'साहिया'},{name:'Kheri',nameHi:'खेरी'},{name:'Badasi',nameHi:'बदासी'},{name:'Mohand',nameHi:'मोहंड'}] },
          { id: 'vikasnagar', name: 'Vikasnagar', nameHi: 'विकासनगर', row: 1, col: 0, baseElev: 620, elevVar: 180, tempAdj: 1, rainAdj: 0, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Thalisain',nameHi:'थालीसैन'},{name:'Badsahikhera',nameHi:'बादशाहीखेरा'},{name:'Selaqui',nameHi:'सेलाकुई'},{name:'Raiwala',nameHi:'रायवाला'}] },
          { id: 'sahaspur', name: 'Sahaspur', nameHi: 'सहसपुर', row: 1, col: 1, baseElev: 520, elevVar: 150, tempAdj: 3, rainAdj: -2, landTypes: ['periurban','irrigated_cropland','wetland','mixed_agriculture'], pNames: [{name:'Mothronwala',nameHi:'मोठरोंवाला'},{name:'Lacchiwala',nameHi:'लच्छीवाला'},{name:'Hariyawala',nameHi:'हरियावाला'},{name:'Premnagar',nameHi:'प्रेमनगर'}] },
          { id: 'raipur', name: 'Raipur', nameHi: 'रायपुर', row: 0, col: 1, baseElev: 430, elevVar: 100, tempAdj: 5, rainAdj: -4, landTypes: ['urban','periurban','irrigated_cropland','scrubland'], pNames: [{name:'Pondha',nameHi:'पोंधा'},{name:'Guniyal Gaon',nameHi:'गुणियाल गाँव'},{name:'Jolly Grant',nameHi:'जॉली ग्रांट'},{name:'Daat Kali',nameHi:'दात काली'}] },
          { id: 'doiwala', name: 'Doiwala', nameHi: 'डोईवाला', row: 0, col: 0, baseElev: 380, elevVar: 80, tempAdj: 6, rainAdj: -5, landTypes: ['irrigated_cropland','rainfed_cropland','plantation','periurban'], pNames: [{name:'Bhagwanpur',nameHi:'भगवानपुर'},{name:'Nepali Farm',nameHi:'नेपाली फार्म'},{name:'Shyampur',nameHi:'श्यामपुर'},{name:'Rajeev Nagar',nameHi:'राजीव नगर'}] },
        ],
      },
      {
        id: 'haridwar', name: 'Haridwar', nameHi: 'हरिद्वार',
        center: [29.95, 78.16], zoom: 10,
        bounds: { minLat: 29.65, maxLat: 30.25, minLng: 77.80, maxLng: 78.40 },
        climate: { baseTempH: 34, baseTempL: 22, baseRain: 8, zone: 'gangetic_plain' },
        blocks: [
          { id: 'roorkee', name: 'Roorkee', nameHi: 'रुड़की', row: 2, col: 0, baseElev: 268, elevVar: 40, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','urban','periurban','mixed_agriculture'], pNames: [{name:'Manglaur',nameHi:'मंगलौर'},{name:'Landhaura',nameHi:'लंढौरा'},{name:'Bhagwanpur',nameHi:'भगवानपुर'},{name:'Jhabrehra',nameHi:'झबरेहरा'}] },
          { id: 'laksar', name: 'Laksar', nameHi: 'लक्सर', row: 2, col: 1, baseElev: 230, elevVar: 30, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','wetland','mixed_agriculture'], pNames: [{name:'Sultanpur',nameHi:'सुल्तानपुर'},{name:'Pathri',nameHi:'पथरी'},{name:'Shahpur',nameHi:'शाहपुर'},{name:'Libarheri',nameHi:'लिबड़हेड़ी'}] },
          { id: 'narsan', name: 'Narsan', nameHi: 'नारसन', row: 1, col: 0, baseElev: 290, elevVar: 50, tempAdj: -1, rainAdj: 2, landTypes: ['mixed_agriculture','river_valley','irrigated_cropland','plantation'], pNames: [{name:'Kankhal',nameHi:'कनखल'},{name:'Aurangabad',nameHi:'औरंगाबाद'},{name:'Shivrajpur',nameHi:'शिवराजपुर'},{name:'Bahadurpur',nameHi:'बहादुरपुर'}] },
          { id: 'bhagwanpur_h', name: 'Bhagwanpur', nameHi: 'भगवानपुर', row: 1, col: 1, baseElev: 245, elevVar: 35, tempAdj: 2, rainAdj: -2, landTypes: ['irrigated_cropland','rainfed_cropland','periurban','scrubland'], pNames: [{name:'Biharigarh',nameHi:'बिहारीगढ़'},{name:'Rasoolpur',nameHi:'रसूलपुर'},{name:'Mohabewala',nameHi:'मोहबेवाला'},{name:'Daulatpur',nameHi:'दौलतपुर'}] },
          { id: 'bahadrabad', name: 'Bahadrabad', nameHi: 'बहादराबाद', row: 0, col: 0, baseElev: 255, elevVar: 45, tempAdj: 0, rainAdj: 1, landTypes: ['mixed_agriculture','irrigated_cropland','river_valley','periurban'], pNames: [{name:'BHEL Township',nameHi:'भेल टाउनशिप'},{name:'Sidcul',nameHi:'सिडकुल'},{name:'Roshnabad',nameHi:'रोशनाबाद'},{name:'Jamalpur',nameHi:'जमालपुर'}] },
          { id: 'khanpur', name: 'Khanpur', nameHi: 'खानपुर', row: 0, col: 1, baseElev: 240, elevVar: 30, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Sherpur',nameHi:'शेरपुर'},{name:'Alipur',nameHi:'अलीपुर'},{name:'Nagla Imarti',nameHi:'नगला इमारती'},{name:'Maheshwala',nameHi:'महेशवाला'}] },
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
          { id: 'ludhiana_e', name: 'Ludhiana East', nameHi: 'लुधियाना पूर्व', row: 2, col: 0, baseElev: 244, elevVar: 20, tempAdj: 1, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Salem Tabri',nameHi:'सलेम टाबरी'},{name:'Haibowal',nameHi:'हैबोवाल'},{name:'Dhandari',nameHi:'धंधारी'},{name:'Gill Village',nameHi:'गिल गाँव'}] },
          { id: 'ludhiana_w', name: 'Ludhiana West', nameHi: 'लुधियाना पश्चिम', row: 2, col: 1, baseElev: 248, elevVar: 15, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','urban','mixed_agriculture','plantation'], pNames: [{name:'Jagraon',nameHi:'जगराओं'},{name:'Raikot',nameHi:'रायकोट'},{name:'Mullanpur',nameHi:'मुल्लांपुर'},{name:'Dakha',nameHi:'दाखा'}] },
          { id: 'khanna', name: 'Khanna', nameHi: 'खन्ना', row: 1, col: 0, baseElev: 260, elevVar: 25, tempAdj: -1, rainAdj: 1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','periurban'], pNames: [{name:'Samrala',nameHi:'समराला'},{name:'Doraha',nameHi:'दोराहा'},{name:'Payal',nameHi:'पायल'},{name:'Machiwara',nameHi:'माछीवाड़ा'}] },
          { id: 'jagraon', name: 'Jagraon', nameHi: 'जगराओं', row: 1, col: 1, baseElev: 232, elevVar: 18, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','rainfed_cropland','scrubland'], pNames: [{name:'Sidhwan Bet',nameHi:'सिधवां बेट'},{name:'Sudhar',nameHi:'सुधार'},{name:'Lohian',nameHi:'लोहियां'},{name:'Hathur',nameHi:'हठूर'}] },
          { id: 'sahnewal', name: 'Sahnewal', nameHi: 'सहनेवाल', row: 0, col: 0, baseElev: 250, elevVar: 20, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','periurban','mixed_agriculture','plantation'], pNames: [{name:'Lalton Kalan',nameHi:'लालटोन कलां'},{name:'Mundian',nameHi:'मुंडियां'},{name:'Koom Kalan',nameHi:'कूम कलां'},{name:'Mangli',nameHi:'मंगली'}] },
          { id: 'mangat', name: 'Mangat', nameHi: 'मंगट', row: 0, col: 1, baseElev: 240, elevVar: 15, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Bassian',nameHi:'बस्सियां'},{name:'Maloud',nameHi:'मालौद'},{name:'Katani',nameHi:'कटानी'},{name:'Ranwan',nameHi:'रणवां'}] },
        ],
      },
      {
        id: 'amritsar', name: 'Amritsar', nameHi: 'अमृतसर',
        center: [31.63, 74.87], zoom: 10,
        bounds: { minLat: 31.33, maxLat: 31.93, minLng: 74.57, maxLng: 75.17 },
        climate: { baseTempH: 37, baseTempL: 25, baseRain: 4, zone: 'indo_gangetic' },
        blocks: [
          { id: 'amritsar_n', name: 'Amritsar North', nameHi: 'अमृतसर उत्तर', row: 2, col: 0, baseElev: 234, elevVar: 15, tempAdj: -1, rainAdj: 1, landTypes: ['irrigated_cropland','urban','periurban','mixed_agriculture'], pNames: [{name:'Verka',nameHi:'वेरका'},{name:'Chogawan',nameHi:'छोगावां'},{name:'Lopoke',nameHi:'लोपोके'},{name:'Majitha',nameHi:'मजीठा'}] },
          { id: 'amritsar_s', name: 'Amritsar South', nameHi: 'अमृतसर दक्षिण', row: 2, col: 1, baseElev: 228, elevVar: 12, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','rainfed_cropland','periurban'], pNames: [{name:'Attari',nameHi:'अटारी'},{name:'Jandiala',nameHi:'जंडियाला'},{name:'Baba Bakala',nameHi:'बाबा बकाला'},{name:'Rayya',nameHi:'रैय्या'}] },
          { id: 'tarn_taran', name: 'Tarn Taran', nameHi: 'तरन तारन', row: 1, col: 0, baseElev: 220, elevVar: 18, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Patti',nameHi:'पट्टी'},{name:'Khem Karan',nameHi:'खेम करण'},{name:'Bhikhiwind',nameHi:'भिखीविंड'},{name:'Naushera Pannuan',nameHi:'नौशेरा पन्नुआं'}] },
          { id: 'ajnala', name: 'Ajnala', nameHi: 'अजनाला', row: 1, col: 1, baseElev: 225, elevVar: 14, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','rainfed_cropland','river_valley'], pNames: [{name:'Ramdass',nameHi:'रामदास'},{name:'Gharinda',nameHi:'घरिंडा'},{name:'Fatehpur',nameHi:'फतेहपुर'},{name:'Dera Baba Nanak',nameHi:'डेरा बाबा नानक'}] },
          { id: 'harsha_cheena', name: 'Harsha Cheena', nameHi: 'हरशा छीना', row: 0, col: 0, baseElev: 230, elevVar: 16, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','scrubland'], pNames: [{name:'Naushehra',nameHi:'नौशेहरा'},{name:'Khalchian',nameHi:'खालचियां'},{name:'Chola Sahib',nameHi:'छोला साहिब'},{name:'Kathunangal',nameHi:'कठुनंगल'}] },
          { id: 'mehta', name: 'Mehta', nameHi: 'मेहता', row: 0, col: 1, baseElev: 222, elevVar: 12, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Sri Hargobindpur',nameHi:'श्री हरगोबिंदपुर'},{name:'Butala',nameHi:'बुटाला'},{name:'Sarhali Mandan',nameHi:'सरहाली मंडन'},{name:'Nagoke',nameHi:'नगोके'}] },
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
          { id: 'amber', name: 'Amber', nameHi: 'आमेर', row: 2, col: 0, baseElev: 480, elevVar: 60, tempAdj: -2, rainAdj: 1, landTypes: ['scrubland','mixed_agriculture','rainfed_cropland','periurban'], pNames: [{name:'Nahargarh',nameHi:'नाहरगढ़'},{name:'Jaigarh',nameHi:'जयगढ़'},{name:'Kunda',nameHi:'कुंडा'},{name:'Kukas',nameHi:'कुकस'}] },
          { id: 'jamwa_ramgarh', name: 'Jamwa Ramgarh', nameHi: 'जमवा रामगढ़', row: 2, col: 1, baseElev: 420, elevVar: 50, tempAdj: 0, rainAdj: 0, landTypes: ['rainfed_cropland','scrubland','mixed_agriculture','sparse_forest'], pNames: [{name:'Ramgarh Lake',nameHi:'रामगढ़ झील'},{name:'Talvriksha',nameHi:'तालवृक्ष'},{name:'Nangal Choudhary',nameHi:'नांगल चौधरी'},{name:'Achrol',nameHi:'आचरोल'}] },
          { id: 'sanganer', name: 'Sanganer', nameHi: 'सांगानेर', row: 1, col: 0, baseElev: 390, elevVar: 30, tempAdj: 2, rainAdj: -1, landTypes: ['urban','periurban','irrigated_cropland','scrubland'], pNames: [{name:'Jagatpura',nameHi:'जगतपुरा'},{name:'Pratap Nagar',nameHi:'प्रताप नगर'},{name:'Sitapura',nameHi:'सीतापुरा'},{name:'Vatika',nameHi:'वाटिका'}] },
          { id: 'chaksu', name: 'Chaksu', nameHi: 'चाकसू', row: 1, col: 1, baseElev: 360, elevVar: 35, tempAdj: 1, rainAdj: 0, landTypes: ['rainfed_cropland','irrigated_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Mauzamabad',nameHi:'मौजमाबाद'},{name:'Tigariya',nameHi:'तिगरिया'},{name:'Bassi',nameHi:'बस्सी'},{name:'Dausa Road',nameHi:'दौसा रोड'}] },
          { id: 'phagi', name: 'Phagi', nameHi: 'फागी', row: 0, col: 0, baseElev: 370, elevVar: 40, tempAdj: 1, rainAdj: -1, landTypes: ['rainfed_cropland','scrubland','mixed_agriculture','irrigated_cropland'], pNames: [{name:'Dhanakya',nameHi:'धनक्या'},{name:'Peelwa',nameHi:'पीलवा'},{name:'Renwal',nameHi:'रेणवाल'},{name:'Kishangarh Bas',nameHi:'किशनगढ़ बास'}] },
          { id: 'kotputli', name: 'Kotputli', nameHi: 'कोटपूतली', row: 0, col: 1, baseElev: 410, elevVar: 45, tempAdj: -1, rainAdj: 1, landTypes: ['mixed_agriculture','rainfed_cropland','scrubland','plantation'], pNames: [{name:'Bansur',nameHi:'बानसूर'},{name:'Viratnagar',nameHi:'विराटनगर'},{name:'Mundawar',nameHi:'मुंडावर'},{name:'Govindgarh',nameHi:'गोविंदगढ़'}] },
        ],
      },
      {
        id: 'jodhpur', name: 'Jodhpur', nameHi: 'जोधपुर',
        center: [26.29, 73.02], zoom: 10,
        bounds: { minLat: 25.99, maxLat: 26.59, minLng: 72.72, maxLng: 73.32 },
        climate: { baseTempH: 42, baseTempL: 29, baseRain: 2, zone: 'desert' },
        blocks: [
          { id: 'jodhpur_n', name: 'Jodhpur North', nameHi: 'जोधपुर उत्तर', row: 2, col: 0, baseElev: 250, elevVar: 30, tempAdj: -1, rainAdj: 1, landTypes: ['scrubland','rainfed_cropland','urban','periurban'], pNames: [{name:'Mandore',nameHi:'मंडोर'},{name:'Pal',nameHi:'पाल'},{name:'Basni',nameHi:'बासनी'},{name:'Khetolai',nameHi:'खेतोलाई'}] },
          { id: 'osian', name: 'Osian', nameHi: 'ओसियां', row: 2, col: 1, baseElev: 220, elevVar: 20, tempAdj: 2, rainAdj: -1, landTypes: ['scrubland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Osian Temple',nameHi:'ओसियां मंदिर'},{name:'Bhopalgarh',nameHi:'भोपालगढ़'},{name:'Mathania',nameHi:'मथानिया'},{name:'Tinwari',nameHi:'तिनवारी'}] },
          { id: 'luni', name: 'Luni', nameHi: 'लूणी', row: 1, col: 0, baseElev: 210, elevVar: 25, tempAdj: 1, rainAdj: 0, landTypes: ['rainfed_cropland','scrubland','mixed_agriculture','river_valley'], pNames: [{name:'Salawas',nameHi:'सालावास'},{name:'Bhopalgarh',nameHi:'भोपालगढ़'},{name:'Kaparda',nameHi:'कापरड़ा'},{name:'Bilara',nameHi:'बिलाड़ा'}] },
          { id: 'phalodi', name: 'Phalodi', nameHi: 'फलौदी', row: 1, col: 1, baseElev: 200, elevVar: 15, tempAdj: 3, rainAdj: -1, landTypes: ['scrubland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Bap',nameHi:'बाप'},{name:'Lohawat',nameHi:'लोहावट'},{name:'Shergarh',nameHi:'शेरगढ़'},{name:'Dechu',nameHi:'डेचू'}] },
          { id: 'shergarh', name: 'Shergarh', nameHi: 'शेरगढ़', row: 0, col: 0, baseElev: 230, elevVar: 28, tempAdj: 0, rainAdj: 0, landTypes: ['rainfed_cropland','scrubland','mixed_agriculture','irrigated_cropland'], pNames: [{name:'Bawdi',nameHi:'बावड़ी'},{name:'Pipar City',nameHi:'पीपाड़ सिटी'},{name:'Bhavi',nameHi:'भावी'},{name:'Balesar',nameHi:'बालेसर'}] },
          { id: 'baori', name: 'Baori', nameHi: 'बावड़ी', row: 0, col: 1, baseElev: 215, elevVar: 18, tempAdj: 1, rainAdj: -1, landTypes: ['scrubland','rainfed_cropland','plantation','mixed_agriculture'], pNames: [{name:'Rohat',nameHi:'रोहट'},{name:'Setrawa',nameHi:'सेतरावा'},{name:'Aau',nameHi:'आउ'},{name:'Dhanana',nameHi:'धनाना'}] },
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
          { id: 'haveli', name: 'Haveli', nameHi: 'हवेली', row: 2, col: 0, baseElev: 560, elevVar: 80, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Wagholi',nameHi:'वाघोली'},{name:'Lohegaon',nameHi:'लोहेगांव'},{name:'Kharadi',nameHi:'खराडी'},{name:'Mundhwa',nameHi:'मुंढवा'}] },
          { id: 'mulshi', name: 'Mulshi', nameHi: 'मुळशी', row: 2, col: 1, baseElev: 620, elevVar: 120, tempAdj: -2, rainAdj: 5, landTypes: ['dense_forest','sparse_forest','mixed_agriculture','terrace_farming'], pNames: [{name:'Pirangut',nameHi:'पिरंगुट'},{name:'Paud',nameHi:'पौड'},{name:'Hinjewadi',nameHi:'हिंजेवाडी'},{name:'Lavale',nameHi:'लवळे'}] },
          { id: 'maval', name: 'Maval', nameHi: 'मावळ', row: 1, col: 0, baseElev: 580, elevVar: 100, tempAdj: -1, rainAdj: 3, landTypes: ['mixed_agriculture','irrigated_cropland','sparse_forest','plantation'], pNames: [{name:'Talegaon',nameHi:'तळेगाव'},{name:'Vadgaon',nameHi:'वडगाव'},{name:'Kanhe',nameHi:'कान्हे'},{name:'Dehu',nameHi:'देहू'}] },
          { id: 'baramati', name: 'Baramati', nameHi: 'बारामती', row: 1, col: 1, baseElev: 540, elevVar: 60, tempAdj: 2, rainAdj: -3, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Indapur',nameHi:'इंदापूर'},{name:'Morgaon',nameHi:'मोरगाव'},{name:'Katraj',nameHi:'कात्रज'},{name:'Jejuri',nameHi:'जेजुरी'}] },
          { id: 'junnar', name: 'Junnar', nameHi: 'जुन्नर', row: 0, col: 0, baseElev: 650, elevVar: 130, tempAdj: -3, rainAdj: 6, landTypes: ['dense_forest','mixed_agriculture','terrace_farming','sparse_forest'], pNames: [{name:'Otur',nameHi:'ओतूर'},{name:'Narayangaon',nameHi:'नारायणगाव'},{name:'Alephata',nameHi:'आळेफाटा'},{name:'Ozar',nameHi:'ओझर'}] },
          { id: 'bhor', name: 'Bhor', nameHi: 'भोर', row: 0, col: 1, baseElev: 600, elevVar: 110, tempAdj: -2, rainAdj: 4, landTypes: ['sparse_forest','mixed_agriculture','irrigated_cropland','plantation'], pNames: [{name:'Nasrapur',nameHi:'नसरापूर'},{name:'Velhe',nameHi:'वेल्हे'},{name:'Kikvi',nameHi:'किकवी'},{name:'Roha',nameHi:'रोहा'}] },
        ],
      },
      {
        id: 'nashik', name: 'Nashik', nameHi: 'नासिक',
        center: [20.0, 73.79], zoom: 10,
        bounds: { minLat: 19.70, maxLat: 20.30, minLng: 73.49, maxLng: 74.09 },
        climate: { baseTempH: 35, baseTempL: 20, baseRain: 8, zone: 'deccan' },
        blocks: [
          { id: 'nashik_city', name: 'Nashik City', nameHi: 'नासिक शहर', row: 2, col: 0, baseElev: 585, elevVar: 50, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','mixed_agriculture'], pNames: [{name:'Panchavati',nameHi:'पंचवटी'},{name:'Satpur',nameHi:'सातपूर'},{name:'Deolali',nameHi:'देवळाली'},{name:'Cidco',nameHi:'सिडको'}] },
          { id: 'trimbak', name: 'Trimbak', nameHi: 'त्र्यंबकेश्वर', row: 2, col: 1, baseElev: 700, elevVar: 160, tempAdj: -4, rainAdj: 8, landTypes: ['dense_forest','sparse_forest','mixed_agriculture','terrace_farming'], pNames: [{name:'Anjaneri',nameHi:'अंजनेरी'},{name:'Harsul',nameHi:'हरसूल'},{name:'Brahmagiri',nameHi:'ब्रह्मगिरी'},{name:'Ghoti',nameHi:'घोटी'}] },
          { id: 'niphad', name: 'Niphad', nameHi: 'निफाड', row: 1, col: 0, baseElev: 500, elevVar: 40, tempAdj: 2, rainAdj: -2, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','plantation'], pNames: [{name:'Ozar Mig',nameHi:'ओझर मिग'},{name:'Lasalgaon',nameHi:'लासलगांव'},{name:'Pimpalgaon',nameHi:'पिंपळगांव'},{name:'Vinchur',nameHi:'विंचूर'}] },
          { id: 'dindori', name: 'Dindori', nameHi: 'दिंडोरी', row: 1, col: 1, baseElev: 630, elevVar: 80, tempAdj: -1, rainAdj: 3, landTypes: ['mixed_agriculture','irrigated_cropland','sparse_forest','terrace_farming'], pNames: [{name:'Vani',nameHi:'वणी'},{name:'Surgana',nameHi:'सुरगाणा'},{name:'Peth',nameHi:'पेठ'},{name:'Wavi',nameHi:'वावी'}] },
          { id: 'sinnar', name: 'Sinnar', nameHi: 'सिन्नर', row: 0, col: 0, baseElev: 550, elevVar: 60, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','scrubland'], pNames: [{name:'Sinnar Town',nameHi:'सिन्नर शहर'},{name:'Nandur',nameHi:'नांदूर'},{name:'Dabhadi',nameHi:'दभाडी'},{name:'Pathardi',nameHi:'पाथर्डी'}] },
          { id: 'igatpuri', name: 'Igatpuri', nameHi: 'इगतपुरी', row: 0, col: 1, baseElev: 680, elevVar: 150, tempAdj: -3, rainAdj: 7, landTypes: ['dense_forest','sparse_forest','terrace_farming','mixed_agriculture'], pNames: [{name:'Ghoti Budruk',nameHi:'घोटी बुद्रुक'},{name:'Kasara Ghat',nameHi:'कसारा घाट'},{name:'Bhavli',nameHi:'भावली'},{name:'Talegaon N',nameHi:'तळेगाव एन'}] },
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
          { id: 'coimbatore_n', name: 'Coimbatore North', nameHi: 'कोयंबटूर उत्तर', row: 2, col: 0, baseElev: 420, elevVar: 60, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','plantation'], pNames: [{name:'Peelamedu',nameHi:'पीलमेडु'},{name:'Singanallur',nameHi:'सिंगानल्लूर'},{name:'Ganapathy',nameHi:'गणपति'},{name:'Saravanampatti',nameHi:'सरवनमपट्टी'}] },
          { id: 'mettupalayam', name: 'Mettupalayam', nameHi: 'मेट्टुपालयम', row: 2, col: 1, baseElev: 600, elevVar: 200, tempAdj: -4, rainAdj: 5, landTypes: ['dense_forest','plantation','mixed_agriculture','terrace_farming'], pNames: [{name:'Karamadai',nameHi:'करमदई'},{name:'Annur',nameHi:'अन्नूर'},{name:'Sirumugai',nameHi:'सिरुमुगई'},{name:'Alandurai',nameHi:'अलंदुरई'}] },
          { id: 'pollachi', name: 'Pollachi', nameHi: 'पोल्लाची', row: 1, col: 0, baseElev: 350, elevVar: 80, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','plantation','mixed_agriculture','rainfed_cropland'], pNames: [{name:'Valparai',nameHi:'वालपाराई'},{name:'Udumalpet',nameHi:'उडुमलपेट'},{name:'Kinathukadavu',nameHi:'किनत्तुकडवु'},{name:'Negamam',nameHi:'नेगमम'}] },
          { id: 'sulur', name: 'Sulur', nameHi: 'सूलुर', row: 1, col: 1, baseElev: 380, elevVar: 50, tempAdj: 1, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','plantation'], pNames: [{name:'Kaniyur',nameHi:'कनियूर'},{name:'Madukkarai',nameHi:'मडुक्करई'},{name:'Vellalore',nameHi:'वेल्लालोर'},{name:'Perur',nameHi:'पेरूर'}] },
          { id: 'thondamuthur', name: 'Thondamuthur', nameHi: 'थोंडमुत्तूर', row: 0, col: 0, baseElev: 450, elevVar: 100, tempAdj: -1, rainAdj: 3, landTypes: ['sparse_forest','mixed_agriculture','plantation','irrigated_cropland'], pNames: [{name:'Narasipuram',nameHi:'नरसीपुरम'},{name:'Ikkaduthangal',nameHi:'इक्कडुथंगल'},{name:'Boluvampatti',nameHi:'बोलुवमपट्टी'},{name:'Periyanaickenpalayam',nameHi:'पेरियनइकनपालयम'}] },
          { id: 'anamalai', name: 'Anamalai', nameHi: 'अनामलाई', row: 0, col: 1, baseElev: 520, elevVar: 180, tempAdj: -3, rainAdj: 6, landTypes: ['dense_forest','plantation','terrace_farming','mixed_agriculture'], pNames: [{name:'TopSlip',nameHi:'टॉपस्लिप'},{name:'Sholayar',nameHi:'शोलयर'},{name:'Aaliyar',nameHi:'अलियार'},{name:'Manamboli',nameHi:'मनंबोली'}] },
        ],
      },
      {
        id: 'thanjavur', name: 'Thanjavur', nameHi: 'तंजावुर',
        center: [10.79, 79.14], zoom: 10,
        bounds: { minLat: 10.49, maxLat: 11.09, minLng: 78.84, maxLng: 79.44 },
        climate: { baseTempH: 35, baseTempL: 25, baseRain: 7, zone: 'cauvery_delta' },
        blocks: [
          { id: 'thanjavur_blk', name: 'Thanjavur', nameHi: 'तंजावुर ब्लॉक', row: 2, col: 0, baseElev: 60, elevVar: 10, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','urban','wetland','mixed_agriculture'], pNames: [{name:'Mariamman Kovil',nameHi:'मारियम्मन कोविल'},{name:'Pillaiyarpatti',nameHi:'पिल्लैयारपट्टी'},{name:'Vallam',nameHi:'वल्लम'},{name:'Nanjikottai',nameHi:'नंजिकोट्टै'}] },
          { id: 'kumbakonam', name: 'Kumbakonam', nameHi: 'कुम्भकोणम', row: 2, col: 1, baseElev: 45, elevVar: 8, tempAdj: 1, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','plantation'], pNames: [{name:'Swamimalai',nameHi:'स्वामिमलै'},{name:'Thiruvidaimaruthur',nameHi:'तिरुविडैमरुथूर'},{name:'Patteswaram',nameHi:'पट्टीश्वरम'},{name:'Darasuram',nameHi:'दारासुरम'}] },
          { id: 'papanasam', name: 'Papanasam', nameHi: 'पापनासम', row: 1, col: 0, baseElev: 55, elevVar: 12, tempAdj: 0, rainAdj: 2, landTypes: ['irrigated_cropland','wetland','river_valley','mixed_agriculture'], pNames: [{name:'Ayyampettai',nameHi:'अय्यमपेट्टै'},{name:'Thirukattupalli',nameHi:'तिरुकट्टुपल्ली'},{name:'Thiruvaiyaru',nameHi:'तिरुवैयारु'},{name:'Ammapettai',nameHi:'अम्मापेट्टै'}] },
          { id: 'orathanadu', name: 'Orathanadu', nameHi: 'ओरत्तनाडु', row: 1, col: 1, baseElev: 50, elevVar: 10, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Madukkur',nameHi:'मडुक्कुर'},{name:'Peravurani',nameHi:'पेरवुरणी'},{name:'Aranthangi',nameHi:'अरन्ठांगी'},{name:'Gandarvakottai',nameHi:'गंदर्वकोट्टै'}] },
          { id: 'thiruvidaimaruthur', name: 'Thiruvidaimaruthur', nameHi: 'तिरुविडैमरुथूर', row: 0, col: 0, baseElev: 40, elevVar: 8, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','plantation'], pNames: [{name:'Kuthalam',nameHi:'कुथालम'},{name:'Mayiladuthurai',nameHi:'मयिलादुतुरै'},{name:'Sirkali',nameHi:'सिरकाळी'},{name:'Poompuhar',nameHi:'पूम्पुहार'}] },
          { id: 'budalur', name: 'Budalur', nameHi: 'बुदलूर', row: 0, col: 1, baseElev: 48, elevVar: 9, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','wetland','rainfed_cropland'], pNames: [{name:'Ammachatram',nameHi:'अम्माचत्रम'},{name:'Saliyamangalam',nameHi:'सलियमंगलम'},{name:'Aduthurai',nameHi:'अडुत्तुरै'},{name:'Annamalai Nagar',nameHi:'अन्नामलै नगर'}] },
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
          { id: 'bardhaman_blk', name: 'Bardhaman City', nameHi: 'बर्धमान शहर', row: 2, col: 0, baseElev: 30, elevVar: 8, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','wetland'], pNames: [{name:'Saktigarh',nameHi:'शक्तिगढ़'},{name:'Raina',nameHi:'रैना'},{name:'Khandaghosh',nameHi:'खंडघोष'},{name:'Jamalpur',nameHi:'जमालपुर'}] },
          { id: 'durgapur', name: 'Durgapur', nameHi: 'दुर्गापुर', row: 2, col: 1, baseElev: 65, elevVar: 20, tempAdj: -1, rainAdj: 1, landTypes: ['periurban','irrigated_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Andal',nameHi:'अंडाल'},{name:'Pandabeswar',nameHi:'पांडबेश्वर'},{name:'Faridpur',nameHi:'फरीदपुर'},{name:'Ukhra',nameHi:'उखरा'}] },
          { id: 'memari', name: 'Memari', nameHi: 'मेमारी', row: 1, col: 0, baseElev: 22, elevVar: 5, tempAdj: 1, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','rainfed_cropland'], pNames: [{name:'Bud Bud',nameHi:'बुद बुद'},{name:'Galsi',nameHi:'गलसी'},{name:'Ketugram',nameHi:'केतुग्राम'},{name:'Mongalkote',nameHi:'मोंगलकोट'}] },
          { id: 'katwa', name: 'Katwa', nameHi: 'कटवा', row: 1, col: 1, baseElev: 18, elevVar: 6, tempAdj: 0, rainAdj: 2, landTypes: ['irrigated_cropland','wetland','river_valley','mixed_agriculture'], pNames: [{name:'Dainhat',nameHi:'दैनहाट'},{name:'Purbasthali',nameHi:'पूर्बस्थली'},{name:'Nadanghat',nameHi:'नदांघाट'},{name:'Kalna',nameHi:'कालना'}] },
          { id: 'asansol', name: 'Asansol', nameHi: 'आसनसोल', row: 0, col: 0, baseElev: 90, elevVar: 30, tempAdj: -1, rainAdj: -1, landTypes: ['urban','periurban','scrubland','mixed_agriculture'], pNames: [{name:'Raniganj',nameHi:'रानीगंज'},{name:'Kulti',nameHi:'कुल्टी'},{name:'Barakar',nameHi:'बराकर'},{name:'Jamuria',nameHi:'जमुरिया'}] },
          { id: 'ausgram', name: 'Ausgram', nameHi: 'औसग्राम', row: 0, col: 1, baseElev: 45, elevVar: 15, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','rainfed_cropland','plantation'], pNames: [{name:'Bhatar',nameHi:'भातार'},{name:'Mangalkot',nameHi:'मंगलकोट'},{name:'Kanksa',nameHi:'कांक्सा'},{name:'Salanpur',nameHi:'सालनपुर'}] },
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
          { id: 'huzur', name: 'Huzur', nameHi: 'हुज़ूर', row: 2, col: 0, baseElev: 500, elevVar: 40, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','irrigated_cropland','wetland'], pNames: [{name:'Kolar',nameHi:'कोलार'},{name:'Misrod',nameHi:'मिसरोद'},{name:'Bairagarh',nameHi:'बैरागढ़'},{name:'Karond',nameHi:'करोंद'}] },
          { id: 'berasia', name: 'Berasia', nameHi: 'बैरसिया', row: 2, col: 1, baseElev: 480, elevVar: 50, tempAdj: 1, rainAdj: -1, landTypes: ['rainfed_cropland','mixed_agriculture','scrubland','sparse_forest'], pNames: [{name:'Salamatpur',nameHi:'सलामतपुर'},{name:'Shahpura',nameHi:'शाहपुरा'},{name:'Khajuri Sadak',nameHi:'खजूरी सड़क'},{name:'Nariyal Kheda',nameHi:'नारियल खेड़ा'}] },
          { id: 'sehore', name: 'Sehore', nameHi: 'सीहोर', row: 1, col: 0, baseElev: 520, elevVar: 60, tempAdj: -1, rainAdj: 2, landTypes: ['mixed_agriculture','irrigated_cropland','sparse_forest','rainfed_cropland'], pNames: [{name:'Ashta',nameHi:'आष्टा'},{name:'Ichhawar',nameHi:'इछावर'},{name:'Nasrullaganj',nameHi:'नसरुल्लागंज'},{name:'Budni',nameHi:'बुदनी'}] },
          { id: 'phanda', name: 'Phanda', nameHi: 'फंदा', row: 1, col: 1, baseElev: 490, elevVar: 45, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','wetland'], pNames: [{name:'Ratibad',nameHi:'रातीबाद'},{name:'Lambakheda',nameHi:'लाम्बाखेडा'},{name:'Neelbad',nameHi:'नीलबाड'},{name:'Chuna Bhatti',nameHi:'चूना भट्टी'}] },
          { id: 'raisen', name: 'Raisen', nameHi: 'रायसेन', row: 0, col: 0, baseElev: 510, elevVar: 70, tempAdj: -1, rainAdj: 1, landTypes: ['mixed_agriculture','sparse_forest','rainfed_cropland','irrigated_cropland'], pNames: [{name:'Sanchi',nameHi:'सांची'},{name:'Bareli',nameHi:'बारेली'},{name:'Silwani',nameHi:'सिलवानी'},{name:'Udaipura',nameHi:'उदयपुरा'}] },
          { id: 'vidisha_area', name: 'Vidisha', nameHi: 'विदिशा', row: 0, col: 1, baseElev: 430, elevVar: 40, tempAdj: 1, rainAdj: -1, landTypes: ['irrigated_cropland','rainfed_cropland','mixed_agriculture','scrubland'], pNames: [{name:'Gyaraspur',nameHi:'ग्यारसपुर'},{name:'Kurwai',nameHi:'कुरवाई'},{name:'Lateri',nameHi:'लटेरी'},{name:'Basoda',nameHi:'बासोदा'}] },
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
          { id: 'guwahati', name: 'Guwahati', nameHi: 'गुवाहाटी', row: 2, col: 0, baseElev: 55, elevVar: 30, tempAdj: 0, rainAdj: 0, landTypes: ['urban','periurban','wetland','mixed_agriculture'], pNames: [{name:'Dispur',nameHi:'दिसपुर'},{name:'Paltan Bazaar',nameHi:'पलटन बाजार'},{name:'Beltola',nameHi:'बेलतोला'},{name:'Jalukbari',nameHi:'जालुकबाड़ी'}] },
          { id: 'hajo', name: 'Hajo', nameHi: 'हाजो', row: 2, col: 1, baseElev: 45, elevVar: 20, tempAdj: 0, rainAdj: 2, landTypes: ['irrigated_cropland','wetland','mixed_agriculture','river_valley'], pNames: [{name:'Hajo Town',nameHi:'हाजो शहर'},{name:'Sualkuchi',nameHi:'सुआलकुची'},{name:'Boko',nameHi:'बोको'},{name:'Chaygaon',nameHi:'चयगाँव'}] },
          { id: 'rangia', name: 'Rangia', nameHi: 'रंगिया', row: 1, col: 0, baseElev: 50, elevVar: 15, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','wetland','plantation'], pNames: [{name:'Nalbari Road',nameHi:'नलबाड़ी रोड'},{name:'Kamalpur',nameHi:'कमलपुर'},{name:'Baihata',nameHi:'बैहटा'},{name:'Tamulpur',nameHi:'तमुलपुर'}] },
          { id: 'palasbari', name: 'Palasbari', nameHi: 'पलासबारी', row: 1, col: 1, baseElev: 40, elevVar: 12, tempAdj: 1, rainAdj: 1, landTypes: ['irrigated_cropland','wetland','river_valley','mixed_agriculture'], pNames: [{name:'Mirza',nameHi:'मिर्ज़ा'},{name:'Nagarbera',nameHi:'नगरबेड़ा'},{name:'Chamaria',nameHi:'चमारिया'},{name:'Kukurmara',nameHi:'कुकुरमारा'}] },
          { id: 'kamalpur_a', name: 'Kamalpur', nameHi: 'कमलपुर', row: 0, col: 0, baseElev: 48, elevVar: 18, tempAdj: -1, rainAdj: 3, landTypes: ['dense_forest','mixed_agriculture','wetland','plantation'], pNames: [{name:'Chandrapur',nameHi:'चंद्रपुर'},{name:'Goroimari',nameHi:'गोरोईमारी'},{name:'Bezera',nameHi:'बेज़ेरा'},{name:'Dimoria',nameHi:'डिमोरिया'}] },
          { id: 'sonapur', name: 'Sonapur', nameHi: 'सोनापुर', row: 0, col: 1, baseElev: 60, elevVar: 25, tempAdj: -1, rainAdj: 2, landTypes: ['mixed_agriculture','sparse_forest','irrigated_cropland','plantation'], pNames: [{name:'Khetri',nameHi:'खेतड़ी'},{name:'Tepesia',nameHi:'तेपेसिया'},{name:'Byrnihat',nameHi:'बिरनिहाट'},{name:'Amingaon',nameHi:'अमिनगांव'}] },
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
          { id: 'devanahalli', name: 'Devanahalli', nameHi: 'देवनहल्ली', row: 2, col: 0, baseElev: 900, elevVar: 50, tempAdj: -1, rainAdj: 1, landTypes: ['mixed_agriculture','periurban','irrigated_cropland','plantation'], pNames: [{name:'KIA Road',nameHi:'KIA रोड'},{name:'Vijayapura',nameHi:'विजयपुरा'},{name:'Sadahalli',nameHi:'सदहल्ली'},{name:'Kodigehalli',nameHi:'कोडिगेहल्ली'}] },
          { id: 'doddaballapur', name: 'Doddaballapur', nameHi: 'दोड्डबल्लपुर', row: 2, col: 1, baseElev: 870, elevVar: 40, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','plantation','rainfed_cropland'], pNames: [{name:'Tubgere',nameHi:'तुबगेरे'},{name:'Ghati Subramanya',nameHi:'घाटी सुब्रह्मण्य'},{name:'Mylanahalli',nameHi:'मैलनहल्ली'},{name:'Sasalu',nameHi:'ससालु'}] },
          { id: 'nelamangala', name: 'Nelamangala', nameHi: 'नेलमंगला', row: 1, col: 0, baseElev: 910, elevVar: 45, tempAdj: -1, rainAdj: 1, landTypes: ['irrigated_cropland','periurban','mixed_agriculture','sparse_forest'], pNames: [{name:'Solur',nameHi:'सोलूर'},{name:'Tyamagondlu',nameHi:'त्यामगोंडलु'},{name:'Thippasandra',nameHi:'तिप्पसंद्र'},{name:'Dabaspet',nameHi:'दबसपेट'}] },
          { id: 'hosakote', name: 'Hosakote', nameHi: 'होसकोटे', row: 1, col: 1, baseElev: 880, elevVar: 35, tempAdj: 0, rainAdj: 0, landTypes: ['irrigated_cropland','mixed_agriculture','periurban','scrubland'], pNames: [{name:'Nandagudi',nameHi:'नंदागुडी'},{name:'Anugondanahalli',nameHi:'अनुगोंडनहल्ली'},{name:'Pillagumpe',nameHi:'पिल्लागुंपे'},{name:'Sulibele',nameHi:'सुलिबेले'}] },
          { id: 'anekal', name: 'Anekal', nameHi: 'अनेकल', row: 0, col: 0, baseElev: 920, elevVar: 60, tempAdj: -2, rainAdj: 2, landTypes: ['mixed_agriculture','irrigated_cropland','sparse_forest','plantation'], pNames: [{name:'Sarjapura',nameHi:'सर्जापुरा'},{name:'Attibele',nameHi:'अत्तिबेले'},{name:'Jigani',nameHi:'जिगणी'},{name:'Chandapura',nameHi:'चंदापुरा'}] },
          { id: 'kanakapura_area', name: 'Kanakapura', nameHi: 'कनकपुरा', row: 0, col: 1, baseElev: 850, elevVar: 55, tempAdj: 0, rainAdj: 1, landTypes: ['irrigated_cropland','mixed_agriculture','plantation','sparse_forest'], pNames: [{name:'Harohalli',nameHi:'हरोहल्ली'},{name:'Sathanur',nameHi:'साथनूर'},{name:'Ramanagara',nameHi:'रामनगर'},{name:'Malavalli',nameHi:'मालवल्ली'}] },
        ],
      },
    ],
  },
];

// ── Generate all data hierarchically ────────────────────────────────────────
const ROWS = 3, COLS = 2;

function makeBlockPoly(bounds, row, col) {
  const latStep = (bounds.maxLat - bounds.minLat) / ROWS;
  const lngStep = (bounds.maxLng - bounds.minLng) / COLS;
  const j = () => (rand() - 0.5) * 0.012;
  const s = bounds.minLat + row * latStep, n = s + latStep;
  const w = bounds.minLng + col * lngStep, e = w + lngStep;
  return [[w+j(),s+j()],[e+j(),s+j()],[e+j(),n+j()],[w+j(),n+j()],[w+j(),s+j()]]
    .map(([lng,lat]) => [+(lng.toFixed(4)), +(lat.toFixed(4))]);
}

function subdividePoly(bounds, bRow, bCol, pIdx) {
  const latStep = (bounds.maxLat - bounds.minLat) / ROWS / 2;
  const lngStep = (bounds.maxLng - bounds.minLng) / COLS / 2;
  const pRow = Math.floor(pIdx / 2), pCol = pIdx % 2;
  const j = () => (rand() - 0.5) * 0.006;
  const bLatStep = (bounds.maxLat - bounds.minLat) / ROWS;
  const bLngStep = (bounds.maxLng - bounds.minLng) / COLS;
  const s = bounds.minLat + bRow * bLatStep + pRow * latStep;
  const n = s + latStep;
  const w = bounds.minLng + bCol * bLngStep + pCol * lngStep;
  const e = w + lngStep;
  return [[w+j(),s+j()],[e+j(),s+j()],[e+j(),n+j()],[w+j(),n+j()],[w+j(),s+j()]]
    .map(([lng,lat]) => [+(lng.toFixed(4)), +(lat.toFixed(4))]);
}

function polyCenter(coords) {
  const c = coords.slice(0, -1);
  return [c.reduce((a,p)=>a+p[1],0)/c.length, c.reduce((a,p)=>a+p[0],0)/c.length];
}

const cropAdvisories = {
  en: [
    { icon: '💧', text: 'Delay irrigation by 1 day — rain expected tomorrow.' },
    { icon: '🌾', text: 'Good window for paddy transplanting in the next 2 days.' },
    { icon: '❄️', text: 'Risk of frost tonight. Cover nursery beds with mulch.' },
    { icon: '🌡️', text: 'Heatwave alert: avoid pesticide spraying between 11 AM–3 PM.' },
    { icon: '🌧️', text: 'Heavy rain likely. Ensure field drainage channels are clear.' },
    { icon: '☀️', text: 'Dry spell expected. Schedule drip irrigation for wheat crop.' },
    { icon: '🍃', text: 'Wind advisory: postpone foliar spray application.' },
    { icon: '🌿', text: 'Optimal conditions for sowing rabi crops this week.' },
  ],
  hi: [
    { icon: '💧', text: 'सिंचाई 1 दिन टालें — कल बारिश की संभावना है।' },
    { icon: '🌾', text: 'अगले 2 दिनों में धान रोपाई के लिए अच्छी स्थिति।' },
    { icon: '❄️', text: 'आज रात पाले का खतरा। नर्सरी की क्यारियों को मल्च से ढकें।' },
    { icon: '🌡️', text: 'लू चेतावनी: 11 AM–3 PM के बीच कीटनाशक छिड़काव न करें।' },
    { icon: '🌧️', text: 'भारी बारिश की संभावना। जल निकासी नालियाँ साफ रखें।' },
    { icon: '☀️', text: 'सूखे का दौर अपेक्षित। ड्रिप सिंचाई की योजना बनाएं।' },
    { icon: '🍃', text: 'हवा चेतावनी: पर्णीय छिड़काव स्थगित करें।' },
    { icon: '🌿', text: 'इस सप्ताह रबी फसलों की बुवाई के लिए अनुकूल स्थिति।' },
  ],
};

function generateFiveDayForecast(baseTH, baseTL, baseRain, elev) {
  const base = new Date('2026-09-28');
  return Array.from({length:5}, (_,d) => {
    const date = new Date(base); date.setDate(date.getDate()+d);
    const v = (rand()-0.5)*4;
    const tH = +(baseTH+v).toFixed(1), tL = +(baseTL+v*0.6).toFixed(1);
    const rain = +Math.max(0, baseRain+(rand()-0.3)*15).toFixed(1);
    const u = 1+d*0.15+(elev/5000);
    const conf = randInt(62,95);
    return {
      date: date.toISOString().split('T')[0],
      dateLabel: date.toLocaleDateString('en-IN',{weekday:'short',month:'short',day:'numeric'}),
      tempHigh:tH, tempLow:tL,
      tempHighUpper:+(tH+1.5*u).toFixed(1), tempHighLower:+(tH-1.5*u).toFixed(1),
      tempLowUpper:+(tL+1.2*u).toFixed(1), tempLowLower:+(tL-1.2*u).toFixed(1),
      rainfall:rain, rainfallUpper:+(rain+5*u).toFixed(1), rainfallLower:+Math.max(0,rain-4*u).toFixed(1),
      humidity:randInt(45,92), windSpeed:randInt(5,28), confidence:conf,
      icon: rain>10?'🌧️':rain>3?'🌦️':tH>38?'🌡️':tL<10?'❄️':'☀️',
    };
  });
}

// ── Build all data ──────────────────────────────────────────────────────────
export const allStates = [];
export const allDistricts = [];
export const allBlocks = [];
export const allPanchayats = [];
let advIdx = 0;

stateDefinitions.forEach(sd => {
  const stateObj = { id: sd.id, name: sd.name, nameHi: sd.nameHi, center: sd.center, zoom: sd.zoom, districtIds: [] };

  sd.districts.forEach(dd => {
    const distObj = { id: dd.id, stateId: sd.id, stateName: sd.name, stateNameHi: sd.nameHi, name: dd.name, nameHi: dd.nameHi, center: dd.center, zoom: dd.zoom, bounds: dd.bounds, climate: dd.climate, blockIds: [] };
    const distBlockGeo = { type: 'FeatureCollection', features: [] };
    const distPanchGeo = { type: 'FeatureCollection', features: [] };

    dd.blocks.forEach(bd => {
      const bCoords = makeBlockPoly(dd.bounds, bd.row, bd.col);
      const bCenter = polyCenter(bCoords);
      const tH = +(dd.climate.baseTempH + bd.tempAdj).toFixed(1);
      const tL = +(dd.climate.baseTempL + bd.tempAdj * 0.6).toFixed(1);
      const rain = +(dd.climate.baseRain + bd.rainAdj).toFixed(1);
      const blockObj = {
        id: `${dd.id}_${bd.id}`, blockId: bd.id, districtId: dd.id, stateId: sd.id,
        name: bd.name, nameHi: bd.nameHi, center: bCenter, elevation: bd.baseElev,
        forecast: { tempHigh: tH, tempLow: tL, rainfall: rain, humidity: randInt(55,80), windSpeed: randInt(8,22) },
        geojson: { type:'Feature', properties:{ id:`${dd.id}_${bd.id}`, name:bd.name, nameHi:bd.nameHi, type:'block' }, geometry:{ type:'Polygon', coordinates:[bCoords] } },
        panchayatIds: [],
      };
      distBlockGeo.features.push(blockObj.geojson);

      bd.pNames.forEach((pn, pIdx) => {
        const pCoords = subdividePoly(dd.bounds, bd.row, bd.col, pIdx);
        const pCenter = polyCenter(pCoords);
        const elev = Math.round(bd.baseElev + (rand()-0.5)*bd.elevVar*2);
        const lu = bd.landTypes[pIdx % bd.landTypes.length];
        const dtw = +(randRange(0.3,12)).toFixed(1);
        const eEff = -(elev-bd.baseElev)*0.006;
        const wEff = dtw<2?1.5:dtw<5?0.5:-0.5;
        const lEff = ['dense_forest','wetland'].includes(lu)?-1.2:['urban','periurban'].includes(lu)?1.8:0;
        const rBoost = ['river_valley','wetland'].includes(lu)?3:elev>1500?5:0;
        const pTH = +(tH+eEff+lEff+(rand()-0.5)*2).toFixed(1);
        const pTL = +(tL+eEff*0.7+wEff+(rand()-0.5)*1.5).toFixed(1);
        const pRain = +Math.max(0,rain+rBoost+(rand()-0.5)*6).toFixed(1);
        const conf = randInt(62,96);
        const pId = `${dd.id}_${bd.id}_${pn.name.toLowerCase().replace(/\s+/g,'_')}`;

        const pObj = {
          id: pId, blockId: `${dd.id}_${bd.id}`, districtId: dd.id, stateId: sd.id,
          blockName: bd.name, blockNameHi: bd.nameHi, districtName: dd.name, districtNameHi: dd.nameHi,
          stateName: sd.name, stateNameHi: sd.nameHi,
          name: pn.name, nameHi: pn.nameHi, center: pCenter, elevation: elev, landUse: lu, distToWater: dtw,
          forecast: { tempHigh:pTH, tempLow:pTL, rainfall:pRain, humidity:randInt(50,90), windSpeed:randInt(5,25), confidence:conf },
          fiveDayForecast: generateFiveDayForecast(pTH, pTL, pRain, elev),
          deviation: { tempOffset:+(pTH-tH).toFixed(1), rainfallOffset:+(pRain-rain).toFixed(1),
            factors: { elevation:{value:elev,effect:+(eEff).toFixed(1),label:`${elev}m`}, distToWater:{value:dtw,effect:+(wEff).toFixed(1),label:`${dtw} km`}, landUse:{value:lu,effect:+(lEff).toFixed(1)} }
          },
          advisory: { en:cropAdvisories.en[advIdx%8], hi:cropAdvisories.hi[advIdx%8] },
        };
        advIdx++;
        allPanchayats.push(pObj);
        blockObj.panchayatIds.push(pId);
        distPanchGeo.features.push({ type:'Feature', properties:{ id:pId,name:pn.name,nameHi:pn.nameHi,blockId:`${dd.id}_${bd.id}`,blockName:bd.name,blockNameHi:bd.nameHi,tempHigh:pTH,tempLow:pTL,rainfall:pRain,elevation:elev,landUse:lu,confidence:conf,type:'panchayat' }, geometry:{type:'Polygon',coordinates:[pCoords]} });
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

// ── Convenience: default district for initial load ──────────────────────────
export const defaultDistrictId = 'dehradun';
export function getDistrict(id) { return allDistricts.find(d => d.id === id); }
export function getDistrictBlocks(distId) { return allBlocks.filter(b => b.districtId === distId); }
export function getDistrictPanchayats(distId) { return allPanchayats.filter(p => p.districtId === distId); }
export function getBlockPanchayats(blockId) { return allPanchayats.filter(p => p.blockId === blockId); }
export function findNearestPanchayat(lat, lng) {
  let nearest = null, minDist = Infinity;
  for (const p of allPanchayats) {
    const d = Math.hypot(p.center[0]-lat, p.center[1]-lng);
    if (d < minDist) { minDist = d; nearest = p; }
  }
  return nearest;
}

// ── Color scales (unchanged) ────────────────────────────────────────────────
export function tempToColor(t) { return t<=10?'#3B82F6':t<=18?'#06B6D4':t<=24?'#22C55E':t<=30?'#EAB308':t<=35?'#F97316':'#EF4444'; }
export function rainToColor(r) { return r<=2?'#FEF3C7':r<=8?'#A7F3D0':r<=15?'#6EE7B7':r<=25?'#3B82F6':'#1D4ED8'; }
export function confidenceToColor(c) { return c>=85?'#22C55E':c>=70?'#EAB308':'#EF4444'; }
export const tempLegend = [{label:'≤10°C',color:'#3B82F6'},{label:'10–18°C',color:'#06B6D4'},{label:'18–24°C',color:'#22C55E'},{label:'24–30°C',color:'#EAB308'},{label:'30–35°C',color:'#F97316'},{label:'>35°C',color:'#EF4444'}];
export const rainLegend = [{label:'0–2 mm',color:'#FEF3C7'},{label:'2–8 mm',color:'#A7F3D0'},{label:'8–15 mm',color:'#6EE7B7'},{label:'15–25 mm',color:'#3B82F6'},{label:'>25 mm',color:'#1D4ED8'}];

// ── KPI stats ───────────────────────────────────────────────────────────────
export const platformStats = {
  totalStates: allStates.length,
  totalDistricts: allDistricts.length,
  totalBlocks: allBlocks.length,
  totalPanchayats: allPanchayats.length,
  farmersReached: '1.2L+',
  forecastAccuracy: '82.4%',
};

// ── Admin / feedback data ───────────────────────────────────────────────────
export const weatherLabels = {
  en: { rained:'It Rained',no_rain:'No Rain',frost:'Frost',heatwave:'Heatwave',normal:'Normal',heavy_rain:'Heavy Rain' },
  hi: { rained:'बारिश हुई',no_rain:'बारिश नहीं',frost:'पाला',heatwave:'लू',normal:'सामान्य',heavy_rain:'भारी बारिश' },
};

export const feedbackData = [];
const weatherEvents = ['rained','no_rain','frost','heatwave','normal','heavy_rain'];
const fbBase = new Date('2026-09-01');
for (let i=0; i<120; i++) {
  const p = allPanchayats[randInt(0,allPanchayats.length-1)];
  const d = new Date(fbBase); d.setDate(d.getDate()+randInt(0,26));
  feedbackData.push({ id:`fb_${i}`, panchayatId:p.id, panchayatName:p.name, blockName:p.blockName, districtName:p.districtName, date:d.toISOString().split('T')[0], event:pick(weatherEvents), notes:'', verified:rand()>0.3 });
}

export function generateAccuracyTrend() {
  const data=[]; const base=new Date('2026-08-28'); let acc=72;
  for(let d=0;d<30;d++){ const dt=new Date(base); dt.setDate(dt.getDate()+d); acc=Math.min(98,Math.max(60,acc+(rand()-0.4)*4));
    data.push({date:dt.toISOString().split('T')[0], dateShort:`${dt.getDate()}/${dt.getMonth()+1}`, accuracy:+(acc.toFixed(1)), reports:randInt(3,18)}); }
  return data;
}

export const adminStats = { totalPanchayats:allPanchayats.length, verifiedReports:feedbackData.filter(f=>f.verified).length, avgAccuracy:82.4, activeAlerts:randInt(5,15), lastUpdated:'2026-09-27 18:30 IST' };

export const verificationRows = allPanchayats.slice(0,50).map(p => {
  const aTH = +(p.forecast.tempHigh+(rand()-0.5)*4).toFixed(1);
  const aR = +Math.max(0,p.forecast.rainfall+(rand()-0.5)*8).toFixed(1);
  const err = Math.abs(aTH-p.forecast.tempHigh);
  return { id:p.id, panchayat:p.name, panchayatHi:p.nameHi, block:p.blockName, blockHi:p.blockNameHi, district:p.districtName, state:p.stateName, forecastedTemp:p.forecast.tempHigh, actualTemp:aTH, forecastedRain:p.forecast.rainfall, actualRain:aR, confidence:p.forecast.confidence, status:err<1.5?'verified':err<3?'pending':'alert' };
});

// ── Backward compat aliases (so existing imports keep working) ──────────────
export const district = { name:'Dehradun', nameHi:'देहरादून', state:'Uttarakhand', stateHi:'उत्तराखंड', center:[30.35,78.0], zoom:10 };
export const blocks = getDistrictBlocks('dehradun');
export const panchayats = getDistrictPanchayats('dehradun');
export const panchayatGeoJSON = getDistrict('dehradun')?.panchayatGeoJSON || {type:'FeatureCollection',features:[]};
export const blockGeoJSON = getDistrict('dehradun')?.blockGeoJSON || {type:'FeatureCollection',features:[]};
