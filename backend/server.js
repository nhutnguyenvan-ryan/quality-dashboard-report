import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Phục vụ giao diện tĩnh từ thư mục frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Cấu hình Xác thực Google Sheets Service Account
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GSHEETS_CLIENT_EMAIL,
    private_key: process.env.GSHEETS_PRIVATE_KEY ? process.env.GSHEETS_PRIVATE_KEY.replace(/\\n/g, '\\n') : undefined,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const RANGES = {
  qaWeekly: 'QA_Score_Weekly!A1:Z',
  qaMonthly: 'QA_Score_Monthly!A1:Z',
  leakage: 'Leakage_Overkill!A1:BH',
  appeal: 'Appeal!A1:AA',
};

let cache = { data: null, expiresAt: 0 };

app.get('/api/qa-data', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    
    if (!forceRefresh && cache.data && Date.now() < cache.expiresAt) {
      return res.json({ ...cache.data, fromCache: true });
    }

    if (!SPREADSHEET_ID) {
      return res.status(500).json({ error: "Chưa cấu hình SPREADSHEET_ID trong Environment Variables" });
    }

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges: Object.values(RANGES),
    });

    const freshData = {
      qaWeekly: response.data.valueRanges[0].values || [],
      qaMonthly: response.data.valueRanges[1].values || [],
      leakage: response.data.valueRanges[2].values || [],
      appeal: response.data.valueRanges[3].values || [],
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: freshData, expiresAt: Date.now() + 15 * 60 * 1000 };
    res.json(freshData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
