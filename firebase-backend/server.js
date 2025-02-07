require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const path = require("path");

// ✅ Express 앱 생성 및 설정
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Firebase Admin SDK 초기화 (환경변수 기반 설정)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // 환경변수에서 Firebase Admin 인증 정보를 불러옴 (Vercel 환경용)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
} else {
    // 로컬 개발 환경에서 `serviceAccountKey.json`을 사용
    const serviceAccount = require("./serviceAccountKey.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
}

// ✅ 🔥 Firebase 클라이언트 설정을 반환하는 API 추가 (프론트엔드에서 호출)
app.get("/api/firebase-config", (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
    });
});

// ✅ `index.html`을 제공하기 위한 정적 파일 서빙
app.use(express.static(path.join(__dirname, "public"))); // public 디렉토리 설정
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); // index.html 위치
});

// ✅ 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Firebase API 서버 실행 중: http://localhost:${PORT}`);
});
