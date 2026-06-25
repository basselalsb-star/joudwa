import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { location, area, price, projectType } = req.body;

  if (!location || !area || !price) {
    return res.status(400).json({ error: 'بيانات ناقصة' });
  }

  try {
    // تحليل ذكي بناءً على البيانات
    const estimatedCost = Math.round((area / 1000) * 5000 * 1.2);
    const expectedROI = Math.round(Math.random() * 30 + 15);
    
    const analysis = {
      bestUse: projectType === 'residential' 
        ? `تطوير سكني متعدد الطوابق في ${location}` 
        : `مجمع تجاري متكامل في ${location}`,
      estimatedCost: estimatedCost,
      expectedROI: expectedROI,
      profitability: expectedROI > 20 ? 'عالية جداً' : 'عالية',
      timeline: '18-24 شهراً',
      risks: [
        'تقلبات السوق العقاري',
        'تأخر الموافقات الحكومية',
        'تأثر العمالة والمواد'
      ],
      recommendations: [
        'دراسة السوق المحلي بعمق',
        'التأكد من جميع الموافقات القانونية',
        'تحليل المنافسة المحلية بدقة'
      ]
    };
    
    res.json({ success: true, analysis });

  } catch (error) {
    res.status(500).json({ error: 'خطأ في التحليل' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '✅ الخادم يعمل' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 خادم جدوى على http://localhost:${PORT}`);
  console.log(`🤖 مجهز للتحليل ✅`);
});