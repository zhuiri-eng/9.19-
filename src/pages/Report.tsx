import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import PaymentModal from '@/components/PaymentModal';

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPaid, setHasPaid, paymentAmount, productName } = useContext(AuthContext);
  const { userInfo, reportData } = location.state || {};
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Check if data exists, redirect to home if not
  useEffect(() => {
    if (!userInfo || !reportData) {
      navigate('/');
    }
  }, [userInfo, reportData, navigate]);

  if (!userInfo || !reportData) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
       <div className="max-w-full md:max-w-3xl mx-auto relative z-10">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-3xl"></div>
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 mb-4 tracking-tight">命理玄学报告</h1>
          <div className="inline-block bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-indigo-100 dark:border-indigo-800/50">
            {userInfo.name} 的个性化分析
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            出生日期: {userInfo.birthDate} {userInfo.birthTime} | {userInfo.gender === 'male' ? '男' : '女'}
          </p>
          
          {/* Payment Prompt Banner - Only show when not paid */}
          {!hasPaid && (
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-4">
                    <i className="fa fa-lock text-amber-600 dark:text-amber-400 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">解锁完整报告</h3>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">
                      支付 ¥{paymentAmount} 即可查看详细的命理分析报告
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <i className="fa fa-credit-card mr-2"></i>
                  立即支付
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Report Container */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700/50 relative">
          {/* Report Content */}
          <div className={`p-6 md:p-8 space-y-8 ${!hasPaid ? 'blur-sm pointer-events-none' : ''}`}>
            {/* Basic Profile Section */}
            <section>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 border border-indigo-100 dark:border-indigo-800/50">
                  <i className="fa fa-user-circle text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">基本命格分析</h2>
              </div>
              
               <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700/30 shadow-sm">
                 <div className="mb-6">
                   <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">五行旺衰</h3>
                   
                      {/* 五行旺衰图表 - 高级质感设计 */}
                      <div className="w-full h-64 md:h-80 mb-8 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={reportData.fiveElementsRatio}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={120}
                              paddingAngle={5}
  dataKey="value"
                              labelLine={false}
                              animationBegin={0}
                              animationDuration={1500}
                              animationEasing="ease-in-out"
                              className="transition-all duration-500"
                            >
                              {reportData.fiveElementsRatio.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={[
                                    "#D4AF37", // 金 - 金色
                                    "#228B22", // 木 - 绿色
                                    "#1E90FF", // 水 - 蓝色
                                    "#FF4500", // 火 - 红色
                                    "#CD853F"  // 土 - 棕色
                                  ][index % 5]} 
                                  stroke="#fff"
                                  strokeWidth={2}
                                  className="hover:opacity-80 transition-opacity duration-300"
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value}%`, '占比']}
                              contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                border: 'none',
                                padding: '12px 16px',
                                fontSize: '14px'
                              }}
                              labelStyle={{
                                fontWeight: 'bold',
                                marginBottom: '8px',
                                color: '#333'
                              }}
                            />
                          </PieChart>
                          
                          {/* 中心装饰圆 */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-inner">
                             <div className="text-center w-full px-2">
                               <div className="grid grid-cols-2 gap-1 text-xs">
                                 {reportData.fiveElementsRatio.map((item, index) => (
                                   <div key={index} className="flex items-center justify-center">
                                     <span className="inline-block w-2 h-2 rounded-full mr-1" style={{
                                       backgroundColor: [
                                         "#D4AF37", // 金 - 金色
                                         "#228B22", // 木 - 绿色
                                         "#1E90FF", // 水 - 蓝色
                                         "#FF4500", // 火 - 红色
                                         "#CD853F"  // 土 - 棕色
                                       ][index % 5]
                                     }}></span>
                                     <span className="font-medium">{item.name}:</span>
                                     <span className="ml-1">{item.value}%</span>
                                   </div>
                                 ))}
                               </div>
                             </div>
                          </div>
                          

                          
                          {/* 装饰性背景元素 */}

                          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-xl"></div>
                        </ResponsiveContainer>
                      </div>
                   <p className="text-gray-700 dark:text-gray-300">
                     根据您的生辰八字分析，您命局中 <span className="font-bold text-blue-600 dark:text-blue-400">{reportData.basicProfile.strongElement}</span> 元素较为旺盛，
                     <span className="font-bold text-blue-600 dark:text-blue-400">{reportData.basicProfile.weakElement}</span> 元素相对较弱。
                     整体五行分布较为均衡，命局根基稳固。
                   </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">性格特质</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    {reportData.basicProfile.personalityTraits.map((trait: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <i className="fa fa-check-circle text-amber-500 mt-1 mr-2"></i>
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
             </section>

             {/* 新增：五行与健康 section */}
             <section>
               <div className="flex items-center mb-4">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/10 to-teal-500/10 dark:from-green-900/30 dark:to-teal-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-4 border border-green-100 dark:border-green-800/50">
                 <i className="fa fa-heartbeat text-2xl"></i>
               </div>
               <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">五行与健康</h2>
             </div>
               
               <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                  <p className="text-gray-700 dark:text-gray-300 mb-5">
                    五行对应人体脏腑，不同元素的盛衰会影响相应器官的健康状况。以下是根据您的命局分析的健康建议：
                  </p>
                 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {Object.entries(reportData.fiveElementsHealth).map(([element, data], index) => {
                     // 为每个五行元素定义高端颜色
                     const colors = {
                       wood: 'text-emerald-600 dark:text-emerald-400',
                       fire: 'text-rose-600 dark:text-rose-400',
                       earth: 'text-amber-600 dark:text-amber-400',
                       metal: 'text-slate-600 dark:text-slate-400',
                       water: 'text-cyan-600 dark:text-cyan-400'
                     };
                     
                     // 五行元素中文名称映射
                     const elementNames = {
                       wood: '木',
                       fire: '火',
                       earth: '土',
                       metal: '金',
                       water: '水'
                     };
                     
                     return (
                       <div key={index} className="bg-white dark:bg-gray-800/80 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 transition-all duration-300 hover:shadow-md">
                         <h3 className="text-lg font-semibold flex items-center">
                           <span className={`mr-2 ${colors[element as keyof typeof colors]}`}>{elementNames[element as keyof typeof elementNames]}</span>
                           对应 {data.organ}脏
                         </h3>
                         <p className="text-gray-700 dark:text-gray-300 mt-2">
                           <span className="font-medium">状况：</span>{data.condition}
                         </p>
                         <p className="text-gray-700 dark:text-gray-300 mt-1">
                           <span className="font-medium">建议：</span>{data.suggestion}
                         </p>
                       </div>
                     );
                   })}
                 </div>
               </div>
             </section>

             {/* 新增：五行与职业方向 section */}
             <section>
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 border border-blue-100 dark:border-blue-800/50">
                   <i className="fa fa-briefcase text-2xl"></i>
                 </div>
                 <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">五行与职业方向</h2>
               </div>
               
               <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                 <p className="text-gray-700 dark:text-gray-300 mb-4">
                   根据您命局中 <span className="font-bold text-amber-600 dark:text-amber-400">{reportData.fiveElementsCareer.strongElement}</span> 元素旺盛的特点，以下职业方向可能更适合您的发展：
                 </p>
                 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                   {reportData.fiveElementsCareer.luckyCareers.map((career, index) => (
                     <div key={index} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                       <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                         <i className="fa fa-check"></i>
                       </div>
                       <span className="text-gray-700 dark:text-gray-300">{career}</span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                   <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">职业发展建议</h4>
                   <p className="text-gray-700 dark:text-gray-300">
                     在选择职业时，可以优先考虑与自身命局中旺盛元素相关的领域，这样能更好地发挥个人潜能，事业发展也会更加顺利。同时，也可以适当接触与弱势元素相关的工作，以达到五行平衡，促进全面发展。
                   </p>
                 </div>
               </div>
             </section>

            {/* Fortune Outlook Section */}
            <section>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 border border-amber-100 dark:border-amber-800/50">
                  <i className="fa fa-compass text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">运势展望</h2>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">整体趋势</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {reportData.fortuneOutlook.generalTrend}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">近期亮点</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {reportData.fortuneOutlook.recentHighlights}
                  </p>
                </div>
              </div>
            </section>

            {/* Suggestions Section */}
            <section>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-4 border border-purple-100 dark:border-purple-800/50">
                  <i className="fa fa-lightbulb text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">建议与启示</h2>
              </div>
              
               <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-1">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="text-blue-600 dark:text-blue-400 mb-3">
                    <i className="fa fa-briefcase text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">职业发展</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {reportData.suggestions.career}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="text-purple-600 dark:text-purple-400 mb-3">
                    <i className="fa fa-handshake text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">人际关系</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {reportData.suggestions.relationships}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="text-green-600 dark:text-green-400 mb-3">
                    <i className="fa fa-heartbeat text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">健康养生</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {reportData.suggestions.health}
                  </p>
                </div>
              </div>
            </section>

            {/* Lucky Elements Section */}
            <section>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/10 to-yellow-500/10 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 border border-amber-100 dark:border-amber-800/50">
                  <i className="fa fa-star text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">幸运元素</h2>
              </div>
              
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-1">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 to-gray-900/50 rounded-xl p-6 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:shadow-md">
  {/* 动态颜色样式 */}
  {(() => {
    const colorMap = {
      '红色': { bg: 'bg-red-100', darkBg: 'bg-red-900/30', text: 'text-red-600', darkText: 'text-red-400' },
      '黄色': { bg: 'bg-yellow-100', darkBg: 'bg-yellow-900/30', text: 'text-yellow-600', darkText: 'text-yellow-400' },
      '白色': { bg: 'bg-gray-100', darkBg: 'bg-gray-800/30', text: 'text-gray-600', darkText: 'text-gray-400' },
      '黑色': { bg: 'bg-gray-200', darkBg: 'bg-gray-700/30', text: 'text-gray-800', darkText: 'text-gray-300' },
      '绿色': { bg: 'bg-green-100', darkBg: 'bg-green-900/30', text: 'text-green-600', darkText: 'text-green-400' },
      '蓝色': { bg: 'bg-blue-100', darkBg: 'bg-blue-900/30', text: 'text-blue-600', darkText: 'text-blue-400' },
      '紫色': { bg: 'bg-purple-100', darkBg: 'bg-purple-900/30', text: 'text-purple-600', darkText: 'text-purple-400' }
    };
    
    const color = reportData.luckyElements.color;
    const classes = colorMap[color] || colorMap['紫色'];
    
    return (
      <>
        <div className={`w-12 h-12 rounded-full ${classes.bg} dark:${classes.darkBg} flex items-center justify-center ${classes.text} dark:${classes.darkText} mb-[12px]`}>
          <i className="fa fa-palette text-xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">幸运颜色</h3>
        <p className={`text-2xl font-bold ${classes.text} dark:${classes.darkText}`}>{color}</p>
      </>
    );
  })()}
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 to-gray-900/50 rounded-xl p-6 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/3０ flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                    <i className="fa fa-hashtag text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">幸运数字</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reportData.luckyElements.number}</p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 to-gray-900/50 rounded-xl p-6 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
                    <i className="fa fa-compass text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">幸运方位</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{reportData.luckyElements.direction}</p>
                </div>
              </div>
            </section>

            {/* Life Stage Fortune Section */}  
            <section>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 dark:from-indigo-900/30 dark:to-blue-900/30 flex items-center justify-center text-indigo-blue-600 dark:text-indigo-blue-400 mr-4 border border-indigo-100 dark:border-indigo-800/50">
                  <i className="fa fa-road text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">人生阶段运势</h2>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                <div className="space-y-6">
                  {reportData.fortuneOutlook.lifeStages.map((stage: any, index : number) => (
                    <div key={index} className="relative pl-8 pb-6 border-l-2 border-indigo-200 dark:border-indigo-700 last:border-0 last:pb-0">
                      <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{stage.stage}</h3>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        {stage.description.map((desc: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <i className="fa fa-angle-right text-indigo-500 mt-1 mr-2"></i>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Seasonal Fortune Section */}
            <section>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-4 border border-green-100 dark:border-green-800/50">
                  <i className="fa fa-calendar-alt text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">四季运势</h2>
              </div>
              
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-1">
                {reportData.fortuneOutlook.seasonalFortune.map((season: any, index: number) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700/30 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="text-amber-600 dark:text-amber-400 mb-3">
                      {season.season === '春季' && <i className="fa fa-leaf text-xl"></i>}
                      {season.season === '夏季' && <i className="fa fa-sun text-xl"></i>}
                      {season.season === '秋季' && <i className="fa fa-tree text-xl"></i>}
                      {season.season === '冬季' && <i className="fa fa-snowflake text-xl"></i>}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{season.season}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {season.fortune}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Compatibility Section */}
            <section>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-900/30 dark:to-rose-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mr-4 border border-pink-100 dark:border-pink-800/50">
                  <i className="fa fa-handshake text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">五行匹配</h2>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mr-4">
                    <span className="text-xl font-bold">{reportData.basicProfile.strongElement}</span>
                  </div>
                  <div className="text-2xl text-gray-400">+</div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mx-4">
                    <span className="text-xl font-bold">{reportData.compatibility.element}</span>
                  </div>
                  <div className="text-2xl text-green-500">✓</div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {reportData.compatibility.description}
                </p>
              </div>
            </section>

            {/* Element Balance Suggestions Section */}
            <section>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/10 to-cyan-500/10 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mr-4 border border-teal-100 dark:border-teal-800/50">
                  <i className="fa fa-balance-scale text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">五行调和建议</h2>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {reportData.suggestions.elementBalance}
                </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                      <i className="fa fa-lightbulb text-amber-500 mr-2"></i> 调和方法
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                      <li className="flex items-start">
                        <i className="fa fa-check text-teal-500 mt-1 mr-2"></i>
                        <span>增加{reportData.basicProfile.weakElement}元素相关的颜色在服饰和环境中的使用</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa fa-check text-teal-500 mt-1 mr-2"></i>
                        <span>多接触与{reportData.basicProfile.weakElement}元素相关的职业或爱好</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa fa-check text-teal-500 mt-1 mr-2"></i>
                        <span>在{reportData.luckyElements.direction}方位放置相关元素的物品</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                      <i className="fa fa-calendar-check text-blue-500 mr-2"></i> 最佳时机
                    </h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                      <li className="flex items-start">
                        <i className="fa fa-check text-teal-500 mt-1 mr-2"></i>
                        <span>{['春季', '夏季', '秋季', '冬季'][Math.floor(Math.random() * 4)]}是增强{reportData.basicProfile.weakElement}元素的最佳季节</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa fa-check text-teal-500 mt-1 mr-2"></i>
                        <span>每月{Math.floor(Math.random() * 3) + 1}日前后进行相关调和活动效果更佳</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa fa-check text-teal-500 mt-1 mr-2"></i>
                        <span>每日{['早晨', '中午', '傍晚', '夜间'][Math.floor(Math.random() * 4)]}是调和能量的理想时段</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimer Section */}
            <section className="pt-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-2 flex items-center">
                  <i className="fa fa-info-circle mr-2"></i>免责声明
                </h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm">
                  本报告基于传统玄学文化编写，仅供娱乐参考，不构成任何专业建议。人生道路由个人选择与努力决定，请勿过分依赖命理分析。如有重大决策，请咨询相关专业人士。
                </p>
              </div>
            </section>
          </div>

          {/* Payment Overlay - Only show when not paid */}
          {!hasPaid && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa fa-lock text-amber-600 dark:text-amber-400 text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">报告已锁定</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  支付 ¥{paymentAmount} 解锁完整报告内容
                </p>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center mx-auto"
                >
                  <i className="fa fa-credit-card mr-2"></i>
                  立即支付解锁
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <i className="fa fa-arrow-left mr-2"></i> 返回首页
              </button>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2025 玄学命理分析 | 传统文化研究</p>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={() => setHasPaid(true)}
        productName={productName}
        amount={paymentAmount}
      />
    </div>
  );
}