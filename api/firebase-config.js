const admin = require("firebase-admin");

module.exports = async (req, res) => {
    try {
        // Firebase 초기화 (한 번만 실행)
        if (!admin.apps.length) {
            const serviceAccount = require("../firebase-backend/serviceAccountKey.json");

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }

        // Firebase 설정 정보
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        };

        res.status(200).json(firebaseConfig);
    } catch (error) {
        console.error("Firebase 설정 불러오기 오류:", error);
        res.status(500).json({ error: "서버 오류 발생" });
    }
};
