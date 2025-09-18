import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    gender: 'male'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const generateRandomReport = () => {
  // 生成五行比例数据（用于图表）
  const generateRandomRatios = () => {
    // 生成总和为100的五个随机数
    const ratios = [];
    let total = 0;
    
    // 生成前四个随机数
    for (let i = 0; i < 4; i++) {
      const ratio = Math.floor(Math.random() * 30) + 5; // 5-35之间的随机数
      ratios.push(ratio);
      total += ratio;
    }
    
    // 第五个数确保总和为100
    ratios.push(100 - total);
    
    // 随机打乱顺序
    return ratios.sort(() => 0.5 - Math.random());
  };
  
  // 使用generateRandomRatios函数确保数值总和为100
  const ratios = generateRandomRatios();
  const fiveElementsRatio = [
    { name: '金', value: ratios[0] }, 
    { name: '木', value: ratios[1] }, 
    { name: '水', value: ratios[2] }, 
    { name: '火', value: ratios[3] }, 
    { name:'土', value: ratios[4] }
  ];
  
   // 五行与健康数据 - 动态生成
  const generateHealthData = () => {
    const organs = ['肺', '肝', '肾', '心', '脾'];
    const conditions = [
      '功能良好，状态稳定',
      '基本正常，略有不足',
      '需要注意保养',
      '功能较弱，建议调理',
      '状态波动较大'
    ];
    const suggestions = [
      '注意日常保养，避免过度劳累',
      '保持良好生活习惯，规律作息',
      '适当运动，增强体质',
      '注意饮食调理，多食用有益食物',
      '保持心情舒畅，避免情绪波动'
    ];
    
    return {
      organ: organs[Math.floor(Math.random() * organs.length)],
      condition: `您的${organs[Math.floor(Math.random() * organs.length)]}功能${conditions[Math.floor(Math.random() * conditions.length)]}。`,
      suggestion: suggestions[Math.floor(Math.random() * suggestions.length)]
    };
  };
  
  const fiveElementsHealth = {
    metal: generateHealthData(),
    wood: generateHealthData(),
    water: generateHealthData(),
    fire: generateHealthData(),
    earth: generateHealthData()
  };
  
   // 根据强势元素生成幸运职业
  const careerSuggestionsByElement = {
    '金': ['金融分析师', '工程师', '律师', '会计师', '珠宝设计师'],
    '木': ['教师', '医生', '园艺师', '作家', '环保工作者'],
    '水': ['航海家', '心理学家', '销售', '旅游从业者', '艺术家'],
    '火': ['企业家', '演员', '运动员', '厨师', '能源工作者'],
    '土': ['建筑师', '农业专家', '房地产经纪人', '设计师', '管理人员']
  };
  
  // 随机选择五行元素
  const elements = ['金', '木', '水', '火', '土'];
  const strongElement = elements[Math.floor(Math.random() * elements.length)];
  let weakElement = elements[Math.floor(Math.random() * elements.length)];
  while (weakElement === strongElement) {
    weakElement = elements[Math.floor(Math.random() * elements.length)];
  }
  
  const luckyCareers = careerSuggestionsByElement[strongElement as keyof typeof careerSuggestionsByElement];
  

     // Personality traits pool - significantly expanded for more variety
    const personalityTraitsPool = [
      '为人正直，处事公正，有强烈的责任感',
      '聪明伶俐，学习能力强，富有创造力',
      '性格开朗，待人热情，善于沟通',
      '意志坚定，做事执着，不达目标不罢休',
      '心思细腻，观察敏锐，善于把握细节',
      '胸怀宽广，包容性强，能容人之短',
      '行动力强，雷厉风行，效率高',
      '情感丰富，体贴他人，富有同情心',
      '乐观积极，即使面对困难也能保持良好心态',
      '独立自主，有自己的见解和主张，不随波逐流',
      '沉稳冷静，遇到问题能够理性分析和解决',
      '好奇心强，对新鲜事物有浓厚兴趣，乐于学习',
      '有耐心，做事踏实认真，注重细节和质量',
      '慷慨大方，乐于助人，愿意分享自己的资源',
      '勇于创新，敢于尝试，不畏挑战',
      '善于总结经验，不断自我提升',
      '富有幽默感，能给周围人带来欢乐',
      '做事有条理，计划性强',
      '适应能力强，能快速融入新环境',
      '有领导才能，善于团结他人',
      '注重承诺，言出必行',
      '谦虚谨慎，不骄不躁',
      '富有远见，能看到长远发展',
      '勇于承担责任，不推诿',
      '善于倾听，能理解他人观点',
      '生活有情趣，懂得享受生活',
      '坚韧不拔，面对挫折不轻易放弃',
      '思维敏捷，反应迅速',
      '注重团队合作，能与他人良好协作',
      '有决断力，能果断做出决策'
    ];
    
    // Randomly select 5-7 personality traits (increased from 4-5)
    const shuffledTraits = [...personalityTraitsPool].sort(() => 0.5 - Math.random());

    // Fortune outlook options - expanded
     // 运势展望 - 增加更多变化和随机性
    const generalTrends = [
      '近期运势整体呈上升趋势，事业上会有新的机遇出现，若能把握机会，有望取得突破性进展。财运平稳，偏财方面有意外收获的可能。',
      '未来半年运势起伏较大，前期可能会遇到一些挑战和困难，但只要坚持下去，后期会迎来转机。人际关系方面会有新的拓展。',
      '近期运势较为平稳，适合稳扎稳打，不宜冒进。健康状况良好，但需注意休息，避免过度劳累。感情方面会有新的发展机会。',
      '运势呈上升态势，工作事业上会得到贵人相助，进展顺利。财运亨通，投资方面有良好回报。健康状况良好，精力充沛.',
      '未来一年贵人运旺盛，无论是工作还是生活中都会得到他人的帮助和支持。把握好人际关系，会为你带来意想不到的机遇.',
      '整体运势处于调整期，过去的一些努力将开始显现成果。虽然过程可能有些波折，但坚持下去终会有收获。',
      '运势如日方升，事业发展前景广阔，尤其适合开拓新领域或创业。个人能力将得到充分发挥，获得他人认可。',
      '近期运势有较大波动，需保持警惕，做好应对准备。事业上可能会遇到一些阻碍，但只要坚持不懈，终会克服困难。',
      '财运方面有较大提升空间，正财稳定，偏财有望获得意外惊喜。投资需谨慎，避免盲目跟风。',
      '感情运势向好，单身者有较大机会遇到理想伴侣，已有伴侣者感情更加深厚稳定。家庭生活幸福美满。',
      '健康运势良好，身体状况稳定。建议保持良好的生活习惯，适当锻炼，增强体质。',
      '事业运势处于上升期，工作表现得到认可，有晋升加薪的机会。需继续努力，把握机遇。',
      '人际关系运势较佳，容易得到他人的理解和支持。适合拓展人脉，为未来发展打下基础.',
      '学习运势强劲，思维敏捷，记忆力好，适合学习新知识、新技能。考试运佳，有望取得好成绩。'
    ];
    
    const recentHighlights = [
      '下个月在事业上会有贵人相助，若能把握机会，有望获得晋升或加薪。建议多主动与人沟通，拓展人脉资源。',
      '近期在学习和技能提升方面会有显著进步，适合报名参加培训课程或考取相关证书，对未来发展大有裨益。',
      '感情方面会有新的进展，单身者有望遇到心仪对象，已有伴侣者感情更加稳定甜蜜。家庭关系和睦，生活幸福美满。',
      '健康状况良好，适合进行适当的体育锻炼，增强体质。财运方面会有意外收获，可以考虑进行一些小额投资尝试。',
      '近期有远行或出差的机会，此行将为你带来新的视野和机遇，不妨积极把握。',
      '在财务规划方面会有好的想法和机会，合理配置资产将带来稳定收益。注意开源节流，财务状况将更加稳健。',
      '创意和灵感丰富，适合从事创意性工作或解决复杂问题。思维敏捷，能够快速找到问题的解决方案。',
      '近期会遇到一位重要的贵人，对方将在事业或生活上给予你很大帮助。要懂得珍惜和感恩。',
      '工作上会有新的任务或项目，虽然有一定挑战，但完成后会获得很大提升。要勇于接受挑战。',
      '健康方面需要注意休息，避免过度劳累。适当放松心情，保持良好心态。',
      '财运方面有意外收获，可以考虑为自己添置一些实用的物品或进行自我投资。',
      '人际关系方面会有新的突破，认识一些志同道合的朋友，拓展社交圈。',
      '学习上会有顿悟，之前困惑的问题迎刃而解。继续保持良好的学习状态。',
      '家庭生活温馨和睦，可能会有一些小的家庭聚会或活动，增进家人感情。',
      '有机会接触到新的领域或行业，开阔眼界，为未来发展提供更多可能。'
    ];

    // Added: Life stage fortune analysis
    const lifeStages = [
      {
        stage: '青年时期 (18-30岁)',
        description: [
          '此阶段是学习成长和积累经验的黄金时期，适合多尝试不同领域，找到自己真正热爱的事业方向。',
          '事业起步阶段，可能会面临一些挑战和困难，但这都是成长的必经之路，坚持下去终会有所收获。',
          '人际关系的建立尤为重要，积极拓展人脉资源，会为未来发展奠定良好基础。',
          '财运处于积累期，不宜过度消费，培养良好的理财习惯对未来至关重要。'
        ]
      },
      {
        stage: '中年时期 (31-50岁)',
        description: [
          '事业发展的关键时期，经过前期积累，此时应抓住机遇寻求突破，有望达到事业巅峰。',
          '家庭责任较重，需要平衡工作与家庭关系，保持和谐稳定的家庭环境对事业发展有积极影响。',
          '健康问题开始显现，注意劳逸结合，定期体检，保持良好的生活习惯。',
          '财务状况相对稳定，可以考虑进行一些稳健的投资，为退休生活做准备。'
        ]
      },
      {
        stage: '晚年时期 (51岁以后)',
        description: [
          '人生进入收获期，事业稳定，家庭和睦，应学会享受生活，保持积极乐观的心态。',
          '健康成为首要关注问题，适当运动，合理饮食，保持良好的精神状态。',
          '可以将经验传承给下一代，享受桃李满天下的成就感。',
          '财务状况稳健，可适当进行一些喜欢的投资或慈善活动，丰富晚年生活。'
        ]
      }
    ];

    // Added: Lucky elements
    const colors = ['红色', '黄色', '白色', '黑色', '绿色', '蓝色', '紫色'];
    const luckyColor = colors[Math.floor(Math.random() * colors.length)];
    const luckyNumber = Math.floor(Math.random() * 9) + 1; // 1-9
    const directions = ['东方', '南方', '西方', '北方', '东南', '西南', '东北', '西北', '中央'];
    const luckyDirection = directions[Math.floor(Math.random() * directions.length)];

    // Added: Element balance suggestions
     const elementBalanceSuggestions = [
      `由于您命局中${weakElement}元素较弱，可以多接触与${weakElement}相关的事物来调和五行。`,
      `${weakElement}元素代表的能量在您的命局中需要加强，建议在日常生活中增加相关元素的影响。`,
      `平衡${strongElement}元素过旺的情况，可以通过增加${weakElement}元素的能量来实现五行调和。`,
      `命局中${weakElement}元素不足，可通过颜色、方位和职业选择来弥补，以达到五行平衡的状态。`,
      `您的命局中${strongElement}元素过旺，建议适当增加${weakElement}元素的能量来平衡，可选择相关颜色的服饰或饰品。`,
      `${weakElement}元素在您的命局中较为薄弱，可通过居住环境的调整来增强其能量场，如在相应方位放置相关物品。`,
      `为了调和命局中的五行能量，建议您多参与与${weakElement}元素相关的活动，培养相关兴趣爱好。`,
      `在职业选择上，可以考虑与${weakElement}元素属性相关的行业，以弥补命局中的不足，促进五行平衡发展。`
    ];

    // Expanded: Compatibility analysis
    const compatibilityElements = [...elements].filter(el => el !== strongElement);
    const compatibleElement = compatibilityElements[Math.floor(Math.random() * compatibilityElements.length)];
     const compatibilityDescriptions = [
      `与${compatibleElement}元素较强的人相处会给您带来好运和帮助，他们能弥补您命局中的不足。`,
      `${compatibleElement}元素与您的${strongElement}元素相辅相成，形成良好的互补关系，这类人是您的贵人。`,
      `在团队中，${compatibleElement}元素特质的伙伴能与您形成良好配合，提高工作效率和成功率。`,
      `选择${compatibleElement}元素特质的伴侣或合作伙伴，能促进双方共同成长，实现共赢。`,
      `${compatibleElement}元素的人能为您带来新的思路和视角，激发您的潜能，促进您的发展。`,
      `与${compatibleElement}元素的人建立深厚关系，能形成良好的能量互动，对双方都有积极影响。`,
      `在${compatibleElement}元素能量较强的环境中工作和生活，能增强您的运势，带来更多机遇。`,
      `${compatibleElement}元素代表的能量与您的命局形成和谐共振，有助于您实现目标和理想。`
    ];

    // Suggestions options - expanded
     const careerSuggestions = [
      '适合从事需要创造力和想象力的工作，如设计、策划、写作等领域。在团队中能发挥领导才能，带领团队取得良好业绩。',
      '在技术研发或专业领域有较大发展潜力，建议深耕专业技能，成为行业专家。不宜频繁换工作，长期坚持必有收获。',
      '具备良好的沟通能力和人际关系处理能力，适合从事销售、公关、人力资源等与人打交道的工作。容易获得他人信任和支持。',
      '做事严谨细致，责任心强，适合从事财务、审计、项目管理等需要细心和耐心的工作。能够把复杂的事情处理得井井有条。',
      '富有冒险精神和开拓能力，适合从事创业、投资或开拓新市场等挑战性工作。敢于创新，能把握时代机遇。',
      '具有较强的服务意识和奉献精神，适合从事教育、医疗、公益等行业。能在帮助他人的过程中实现自我价值。',
      '逻辑思维能力强，分析问题透彻，适合从事科研、分析、咨询等工作。能够为他人提供有价值的见解和方案。',
      '具有艺术天赋和审美能力，适合从事艺术创作、设计、音乐、文学等创造性行业，能充分发挥个人才华。',
      '擅长组织协调，有较强的管理能力，适合从事企业管理、项目管理、团队领导等管理岗位。',
      '动手能力强，喜欢实践操作，适合从事技术类、工艺类、工程类等需要实际操作的工作。',
      '具有较强的语言表达能力和感染力，适合从事教育、培训、演讲、主持等与人沟通的工作。',
      '对数字敏感，逻辑思维清晰，适合从事金融、会计、数据分析等与数字打交道的工作。',
      '富有好奇心和探索精神，适合从事科学研究、探险、新闻调查等需要探索未知的工作。',
      '具有较强的空间想象能力和立体感，适合从事建筑设计、室内设计、城市规划等空间相关工作。'
    ];
    
    const relationshipSuggestions = [
      '为人真诚坦率，容易获得他人信任，但有时说话过于直接，建议注意表达方式，多考虑他人感受。',
      '性格温和友善，善于倾听，是很好的倾诉对象。建议多主动表达自己的想法和感受，让他人更好地了解你。',
      '在人际交往中比较被动，建议多主动与人沟通交流，参加社交活动，拓展人脉圈。朋友之间要多联系，保持感情。',
      '对待朋友真诚仗义，愿意付出，但也要学会保护自己，避免被人利用。在人际交往中要保持适当的距离感。',
      '情绪较为敏感，容易受他人影响，建议培养独立思考能力，不要过度在意他人评价。',
      '在团队中表现出色，但有时过于坚持己见，建议多听取他人意见，集思广益才能做出更好的决策。',
      '重视承诺，一旦答应别人的事情就会尽力完成，但也要学会拒绝不合理的要求，避免给自己过多压力。',
      '待人热情大方，乐于助人，容易与人建立良好关系，但也要注意分辨他人意图，避免被人利用。',
      '在人际交往中比较谨慎，不易敞开心扉，建议适当放下防备，真诚对待他人，会收获更多真挚的友谊。',
      '性格独立，不喜欢依赖他人，这是优点，但在需要帮助时也要学会适当示弱，让他人有机会伸出援手。',
      '对朋友要求较高，希望朋友能达到自己的期望，建议多包容他人缺点，每个人都有自己的个性和特点。',
      '在冲突面前喜欢逃避，不愿正面面对，建议学会积极沟通解决问题，逃避只会让问题积累。',
      '容易相信他人，缺乏防备心理，建议提高警惕，保护好自己的个人信息和财产安全。',
      '不善于拒绝他人，容易给自己带来不必要的麻烦，建议学会委婉拒绝，保护自己的时间和精力。'
    ];
    
    const healthSuggestions = [
      '体质较好，但需注意保护眼睛和腰部健康，避免长时间久坐。建议多进行户外运动，如散步、慢跑、游泳等。',
      '注意保持规律的作息时间，避免熬夜。饮食方面要均衡营养，多吃蔬菜水果，少吃辛辣刺激性食物。',
      '情绪波动较大，容易焦虑紧张，建议学习一些放松技巧，如冥想、瑜伽等，保持心态平和。',
      '身体素质一般，要注意增强免疫力，避免过度劳累。定期进行身体检查，及早发现和预防疾病。',
      '消化系统功能较弱，建议饮食清淡，避免暴饮暴食，养成良好的饮食习惯。',
      '注意保护心血管健康，控制血压和血脂，适当进行有氧运动，保持健康体重。',
      '精神压力较大时容易影响睡眠质量，建议睡前放松心情，避免使用电子产品，可以听些舒缓音乐帮助入睡。',
      '颈椎和腰椎容易出现不适，建议保持正确坐姿，避免长时间保持同一姿势，适当进行颈肩腰背部锻炼。',
      '免疫力较弱，容易感冒生病，建议注意保暖，适当运动，合理饮食，增强抵抗力。',
      '视力容易疲劳，建议控制用眼时间，注意眼部休息，多进行远眺，适当补充维生素A。',
      '睡眠质量不佳，容易失眠或多梦，建议睡前避免饮用咖啡、茶等刺激性饮品，保持睡眠环境安静舒适。',
      '容易出现疲劳感，精力不足，建议合理安排作息时间，保证充足睡眠，适当进行有氧运动，增强体能。',
      '脾胃功能较弱，建议饮食规律，避免生冷油腻食物，多吃易消化的食物，适当进行腹部按摩。',
      '情绪容易低落，建议多与朋友交流，参加社交活动，培养积极乐观的心态，适当进行户外活动。'
    ];

    // Added: Seasonal fortune
    const seasons = ['春季', '夏季', '秋季', '冬季'];
    const seasonalFortune = seasons.map(season => ({
      season,
      fortune: [
        `${season}运势平稳，适合按部就班地推进各项计划，不宜冒进。`,
        `${season}是您运势较好的时期，事业和财运都会有不错的表现，适合积极进取。`,
        `${season}需要注意人际关系的处理，良好的人脉将为您带来更多机会。`,
        `${season}适合休养生息，积累力量，为下一阶段的发展做好准备。`
      ][Math.floor(Math.random() * 4)]
    }));    

    return {
      basicProfile: {
        strongElement,
        weakElement,
        personalityTraits: shuffledTraits.slice(0, Math.floor(Math.random() * 3) + 5) // 5-7 traits
      },
      fortuneOutlook: {
        generalTrend: generalTrends[Math.floor(Math.random() * generalTrends.length)],
        recentHighlights: recentHighlights[Math.floor(Math.random() * recentHighlights.length)],
        lifeStages: [...lifeStages],
        seasonalFortune: [...seasonalFortune]
      },
      luckyElements: {
        color: luckyColor,
        number: luckyNumber,
        direction: luckyDirection
      },
      compatibility: {
        element: compatibleElement,
        description: compatibilityDescriptions[Math.floor(Math.random() * compatibilityDescriptions.length)]
      },
      suggestions: {
        career: careerSuggestions[Math.floor(Math.random() * careerSuggestions.length)],
        relationships: relationshipSuggestions[Math.floor(Math.random() * relationshipSuggestions.length)],
        health: healthSuggestions[Math.floor(Math.random() * healthSuggestions.length)],
        elementBalance: elementBalanceSuggestions[Math.floor(Math.random() * elementBalanceSuggestions.length)]
      },
      fiveElementsRatio, // 五行比例数据（用于图表）
      fiveElementsHealth, // 五行与健康数据
      fiveElementsCareer: { // 五行与职业方向数据
        strongElement,
        luckyCareers
      }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name.trim()) {
      toast.error('请输入您的姓名');
      return;
    }
    
    if (!formData.birthDate) {
      toast.error('请选择出生日期');
      return;
    }
    
    if (!formData.birthTime) {
      toast.error('请选择出生时辰');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const reportData = generateRandomReport();
      navigate('/report', { 
        state: { 
          userInfo: formData,
          reportData 
        } 
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1015/1000/1000')] bg-cover bg-center opacity-2 dark:opacity-5 mix-blend-overlay"></div>
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient(circle at top right, rgba(59, 130, 246, 0.15), transparent 50%) dark:bg-radial-gradient(circle at top right, rgba(37, 99, 235, 0.1), transparent 50%)"></div>
      <div className="max-w-full sm:max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">易数文化解读</h1>
          <p className="text-gray-600 dark:text-gray-400">输入您的信息，获取个性化玄学分析</p>
        </div>
        
        {/* Usage Guide */}
         <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 mb-8 border border-blue-100 dark:border-blue-800/30">
           <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
            <i className="fa fa-info-circle mr-2"></i>使用指南
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-bold mr-3">1</div>
              <p>填写您的姓名、出生日期、出生时辰和性别等信息</p>
            </div>
            <div className="flex">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-bold mr-3">2</div>
              <p>点击"生成玄学报告"按钮，系统将为您分析命理格局</p>
            </div>
            <div className="flex">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-bold mr-3">3</div>
              <p>查看详细的命格分析、运势展望和人生建议</p>
            </div>
          </div>
        </div>
        
        {/* Form Card */}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                    className="w-full px-4 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                  placeholder="请输入您的姓名"
                />
              </div>
              
              {/* Birth Date Input */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  出生日期
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                    className="w-full px-4 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              
              {/* Birth Time Select */}
              <div>
                <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  出生时辰
                </label>
                <select
                  id="birthTime"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange}
                    className="w-full px-4 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                >
                  <option value="">请选择出生时辰</option>
                  <option value="子时 (23:00-00:59)">子时 (23:00-00:59)</option>
                  <option value="丑时 (01:00-02:59)">丑时 (01:00-02:59)</option>
                  <option value="寅时 (03:00-04:59)">寅时 (03:00-04:59)</option>
                  <option value="卯时 (05:00-06:59)">卯时 (05:00-06:59)</option>
                  <option value="辰时 (07:00-08:59)">辰时 (07:00-08:59)</option>
                  <option value="巳时 (09:00-10:59)">巳时 (09:00-10:59)</option>
                  <option value="午时 (11:00-12:59)">午时 (11:00-12:59)</option>
                  <option value="未时 (13:00-14:59)">未时 (13:00-14:59)</option>
                  <option value="申时 (15:00-16:59)">申时 (15:00-16:59)</option>
                  <option value="酉时 (17:00-18:59)">酉时 (17:00-18:59)</option>
                  <option value="戌时 (19:00-20:59)">戌时 (19:00-20:59)</option>
                  <option value="亥时 (21:00-22:59)">亥时 (21:00-22:59)</option>
                </select>
              </div>
              
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  性别
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                       className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">男</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                       className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">女</span>
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                  className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-150 ease-in-out flex items-center justify-center disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <i className="fa fa-spinner fa-spin mr-2"></i> 生成中...
                  </>
                ) : (
                  <>
                    <i className="fa fa-magic mr-2"></i> 生成玄学报告
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2025 玄学命理分析 | 仅供娱乐参考</p>
        </div>
      </div>
    </div>
  );
}