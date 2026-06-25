import { useState } from 'react'

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 80 80" style={{ display: 'inline-block' }}>
    <rect x="10" y="10" width="30" height="30" fill="#667eea" rx="4"/>
    <rect x="45" y="10" width="25" height="25" fill="#764ba2" rx="3"/>
    <rect x="10" y="45" width="25" height="25" fill="#764ba2" rx="3"/>
    <rect x="40" y="45" width="30" height="25" fill="#667eea" rx="4"/>
  </svg>
)

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    isSignUp: false
  })
  const [uploadData, setUploadData] = useState({
    location: '',
    area: '',
    price: '',
    projectType: 'residential'
  })
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (formData.email && formData.password) {
      setUser({
        name: formData.fullName || formData.email.split('@')[0],
        email: formData.email,
        credits: 5
      })
      setIsLoggedIn(true)
      setCurrentPage('dashboard')
      setFormData({ email: '', password: '', fullName: '', isSignUp: false })
      setError('')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setCurrentPage('home')
  }

  const handleAnalysis = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!uploadData.location || !uploadData.area || !uploadData.price) {
      setError('يرجى ملء جميع الحقول')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: uploadData.location,
          area: parseInt(uploadData.area),
          price: parseInt(uploadData.price),
          projectType: uploadData.projectType,
          description: ''
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ في التحليل')
      }

      setAnalysisResult(data.analysis)
      setCurrentPage('results')
      setLoading(false)
    } catch (err) {
      setError('❌ ' + err.message)
      setLoading(false)
    }
  }

  if (!isLoggedIn && currentPage === 'home') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '20px', padding: '60px 40px', maxWidth: '750px', textAlign: 'center', boxShadow: '0 20px 60px rgba(102, 126, 234, 0.15)' }}>
          <div style={{ marginBottom: '20px', fontSize: '3em', display: 'flex', justifyContent: 'center' }}>
            <Logo />
          </div>
          <h1 style={{ fontSize: '3.5em', color: '#333', marginBottom: '15px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>جدوى</h1>
          <p style={{ fontSize: '1.4em', color: '#555', marginBottom: '15px' }}>منصة دراسة الجدوى العقارية الذكية</p>
          <p style={{ fontSize: '1.1em', color: '#777', marginBottom: '50px' }}>تحليل شامل لفرصك الاستثمارية مع توصيات احترافية</p>
          
          <button 
            onClick={() => { setCurrentPage('auth'); setFormData({ ...formData, isSignUp: true }) }}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '18px 60px', fontSize: '1.2em', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)', transition: 'transform 0.3s' }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            ابدأ الآن مجاناً 🚀
          </button>
          
          <p style={{ color: '#777', marginTop: '20px' }}>هل لديك حساب؟ <button onClick={() => { setCurrentPage('auth'); setFormData({ ...formData, isSignUp: false }) }} style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em', textDecoration: 'underline' }}>دخول</button></p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn && currentPage === 'auth') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '20px', padding: '50px', maxWidth: '450px', width: '100%', boxShadow: '0 20px 60px rgba(102, 126, 234, 0.15)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
            <Logo />
          </div>
          <h2 style={{ fontSize: '1.8em', color: '#333', marginBottom: '30px', textAlign: 'center', fontWeight: 'bold' }}>{formData.isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}</h2>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {formData.isSignUp && (
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={{ padding: '14px', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '8px', fontSize: '1em', background: 'rgba(255, 255, 255, 0.5)' }}
              />
            )}
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ padding: '14px', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '8px', fontSize: '1em', background: 'rgba(255, 255, 255, 0.5)' }}
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ padding: '14px', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '8px', fontSize: '1em', background: 'rgba(255, 255, 255, 0.5)' }}
            />
            <button
              type="submit"
              style={{ padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', fontSize: '1.1em', cursor: 'pointer' }}
            >
              {formData.isSignUp ? 'إنشاء حساب' : 'دخول'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            {formData.isSignUp ? 'هل لديك حساب؟' : 'ليس لديك حساب؟'}{' '}
            <button
              onClick={() => setFormData({ ...formData, isSignUp: !formData.isSignUp })}
              style={{ background: 'none', border: 'none', color: '#667eea', fontWeight: 'bold', cursor: 'pointer', fontSize: '1em' }}
            >
              {formData.isSignUp ? 'دخول' : 'اشتراك'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  if (isLoggedIn && currentPage !== 'results') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '20px', borderBottom: '1px solid rgba(102, 126, 234, 0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Logo />
              <h1 style={{ fontSize: '1.5em', color: '#333', margin: 0, fontWeight: 'bold' }}>جدوى</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#666' }}>مرحباً، {user?.name}</span>
              <button
                onClick={handleLogout}
                style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '2px solid rgba(102, 126, 234, 0.2)', paddingBottom: '15px' }}>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{ background: 'none', border: 'none', fontSize: '1.1em', color: currentPage === 'dashboard' ? '#667eea' : '#666', cursor: 'pointer', fontWeight: currentPage === 'dashboard' ? 'bold' : 'normal', borderBottom: currentPage === 'dashboard' ? '3px solid #667eea' : 'none', paddingBottom: '10px', marginBottom: '-25px' }}
            >
              📊 لوحة التحكم
            </button>
            <button
              onClick={() => setCurrentPage('upload')}
              style={{ background: 'none', border: 'none', fontSize: '1.1em', color: currentPage === 'upload' ? '#667eea' : '#666', cursor: 'pointer', fontWeight: currentPage === 'upload' ? 'bold' : 'normal', borderBottom: currentPage === 'upload' ? '3px solid #667eea' : 'none', paddingBottom: '10px', marginBottom: '-25px' }}
            >
              🔍 تحليل جديد
            </button>
          </div>

          {currentPage === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {[
                  { label: '📈 التحليلات المكتملة', value: '0', color: '#667eea' },
                  { label: '⭐ الاعتمادات المتبقية', value: user?.credits || '5', color: '#4CAF50' },
                  { label: '📥 التقارير المحملة', value: '0', color: '#764ba2' }
                ].map((stat, idx) => (
                  <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '25px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(102, 126, 234, 0.1)' }}>
                    <p style={{ color: '#666', fontSize: '0.95em', marginBottom: '10px' }}>{stat.label}</p>
                    <p style={{ fontSize: '2.5em', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '50px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 8px 24px rgba(102, 126, 234, 0.1)' }}>
                <div style={{ fontSize: '4em', marginBottom: '20px' }}>🚀</div>
                <h3 style={{ fontSize: '2em', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>ابدأ تحليلك الأول</h3>
                <p style={{ color: '#666', marginBottom: '30px', fontSize: '1.1em' }}>احصل على دراسة جدوى شاملة مع التوصيات الاحترافية</p>
                <button
                  onClick={() => setCurrentPage('upload')}
                  style={{ padding: '18px 50px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2em', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)' }}
                >
                  تحليل جديد 🔍
                </button>
              </div>
            </div>
          )}

          {currentPage === 'upload' && (
            <div style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '40px', borderRadius: '15px', boxShadow: '0 8px 24px rgba(102, 126, 234, 0.1)', maxWidth: '600px' }}>
              <h2 style={{ fontSize: '2em', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>🔍 تحليل ذكي للفرصة العقارية</h2>
              
              {error && (
                <div style={{ padding: '15px', background: 'rgba(255, 107, 107, 0.1)', color: '#c62828', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(198, 40, 40, 0.3)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold', fontSize: '1.05em' }}>📍 الموقع / المدينة</label>
                  <input 
                    type="text" 
                    value={uploadData.location} 
                    onChange={(e) => setUploadData({ ...uploadData, location: e.target.value })} 
                    placeholder="مثال: الرياض - حي العليا" 
                    style={{ width: '100%', padding: '12px', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '8px', fontSize: '1em', background: 'rgba(255, 255, 255, 0.5)' }} 
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold', fontSize: '1.05em' }}>📐 المساحة (م²)</label>
                    <input 
                      type="number" 
                      value={uploadData.area} 
                      onChange={(e) => setUploadData({ ...uploadData, area: e.target.value })} 
                      placeholder="5000" 
                      style={{ width: '100%', padding: '12px', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '8px', fontSize: '1em', background: 'rgba(255, 255, 255, 0.5)' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold', fontSize: '1.05em' }}>💰 السعر (ريال)</label>
                    <input 
                      type="number" 
                      value={uploadData.price} 
                      onChange={(e) => setUploadData({ ...uploadData, price: e.target.value })} 
                      placeholder="2000000" 
                      style={{ width: '100%', padding: '12px', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '8px', fontSize: '1em', background: 'rgba(255, 255, 255, 0.5)' }} 
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 'bold', fontSize: '1.05em' }}>🏢 نوع المشروع</label>
                  <select 
                    value={uploadData.projectType} 
                    onChange={(e) => setUploadData({ ...uploadData, projectType: e.target.value })} 
                    style={{ width: '100%', padding: '12px', border: '1px solid rgba(102, 126, 234, 0.3)', borderRadius: '8px', fontSize: '1em', background: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <option value="residential">🏠 سكني</option>
                    <option value="commercial">🏬 تجاري</option>
                    <option value="mixed">🏗️ مختلط</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ padding: '15px', background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', fontSize: '1.1em', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? '⏳ جاري التحليل...' : '🚀 تحليل الآن'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isLoggedIn && currentPage === 'results') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
          <button 
            onClick={() => { setCurrentPage('upload'); setAnalysisResult(null); setError('') }} 
            style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em' }}
          >
            ← العودة
          </button>

          <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.15)' }}>
            <h1 style={{ fontSize: '2.2em', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>✅ نتائج التحليل الشامل</h1>
            <p style={{ color: '#999', marginBottom: '30px', fontSize: '0.95em' }}>تحليل ذكي مع التوصيات</p>

            {analysisResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ padding: '25px', background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.3)', borderLeft: '5px solid #667eea', borderRadius: '8px' }}>
                  <h3 style={{ color: '#667eea', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1em' }}>🎯 أفضل استخدام للموقع</h3>
                  <p style={{ color: '#333', fontSize: '1.05em', margin: 0 }}>{analysisResult.bestUse}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  {[
                    { label: 'التكلفة المتوقعة', value: `${analysisResult.estimatedCost?.toLocaleString() || 0} ريال`, emoji: '💰' },
                    { label: 'العائد المتوقع', value: `${analysisResult.expectedROI}%`, emoji: '📈' },
                    { label: 'الربحية', value: analysisResult.profitability || 'عالية', emoji: '✅' },
                    { label: 'سعر المتر', value: `${analysisResult.pricePerMeter?.toLocaleString() || 0} ريال`, emoji: '📊' }
                  ].map((metric, idx) => (
                    <div key={idx} style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '2em', marginBottom: '10px' }}>{metric.emoji}</div>
                      <p style={{ color: '#666', marginBottom: '8px', fontSize: '0.9em' }}>{metric.label}</p>
                      <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#333' }}>{metric.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '8px' }}>
                  <h3 style={{ color: '#333', fontWeight: 'bold', marginBottom: '15px' }}>📋 تقييم الموقع</h3>
                  {[
                    { label: 'البنية التحتية', score: analysisResult.infrastructureScore },
                    { label: 'إمكانية الوصول', score: analysisResult.accessibilityScore },
                    { label: 'درجة السوق', score: analysisResult.marketScore }
                  ].map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>{item.label}</span>
                        <span style={{ fontWeight: 'bold', color: '#667eea' }}>{item.score}/10</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(102, 126, 234, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${(item.score / 10) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '20px', background: 'rgba(244, 67, 54, 0.1)', border: '1px solid rgba(244, 67, 54, 0.3)', borderLeft: '5px solid #f44336', borderRadius: '8px' }}>
                  <h3 style={{ color: '#b71c1c', fontWeight: 'bold', marginBottom: '15px' }}>⚠️ المخاطر والحلول</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(analysisResult.risks || []).map((item, idx) => (
                      <div key={idx} style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(244, 67, 54, 0.2)', borderRight: '3px solid #f44336', borderRadius: '6px' }}>
                        <div style={{ fontWeight: 'bold', color: '#b71c1c', marginBottom: '5px' }}>⚠️ {item.risk}</div>
                        <div style={{ color: '#c62828', fontSize: '0.9em' }}>💡 {item.mitigation}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '20px', background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)', borderLeft: '5px solid #4CAF50', borderRadius: '8px' }}>
                  <h3 style={{ color: '#1b5e20', fontWeight: 'bold', marginBottom: '15px' }}>✅ التوصيات</h3>
                  <ul style={{ listStyle: 'none' }}>
                    {(analysisResult.recommendations || []).map((rec, idx) => (
                      <li key={idx} style={{ color: '#1b5e20', marginBottom: '10px', fontSize: '0.95em', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ fontWeight: 'bold', minWidth: '20px' }}>✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '15px', paddingTop: '20px', borderTop: '1px solid rgba(102, 126, 234, 0.2)' }}>
                  <button 
                    onClick={() => window.print()} 
                    style={{ flex: 1, padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1em' }}
                  >
                    📥 تحميل PDF
                  </button>
                  <button 
                    onClick={() => { setCurrentPage('upload'); setAnalysisResult(null); setError('') }} 
                    style={{ flex: 1, padding: '15px', background: 'rgba(200, 200, 200, 0.5)', backdropFilter: 'blur(10px)', color: '#333', fontWeight: 'bold', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '1em' }}
                  >
                    تحليل آخر
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}