const { createRef } = require("react");
const db = require("../../firebase/firebase");

exports.startTimer = async (req, res , next) => {
    const { uid } = req.user;
    const {todoId, timerId} = req.body;

    try {
        const now = new Date().toISOString();

        // var olan bir timer'a segment eklemek
        if (timerId) {
            const timerRef = db.firestore().collection("timers").doc(timerId);
            const timerDoc = await timerRef.get();

            if (!timerDoc.exists) {
                res.status(404)
                return next(new Error("Timer bulunamadı"));
            
            }
            const timerData = timerDoc.data();
            if (timerData.userId !== uid) {
                res.status(403);
                return next(new Error("Bu timer üzeirnde işlem yapma yetkiniz yok"));
            }

            if (timerData.isActive){
                return res.status(400).json({ error: "Bu timer zaten aktif"});
            }

            // yeni segment ekle ve isActive true yap

            await timerRef.update({
                segments: db.firestore.FieldValue.arrayUnion({
                    startTime: now,
                    endTime: null,
                    duration: null,

                }),
                isActive: true
            });

        }

        // yeni timer başlatmak isteniyorsa aktif timer kontrolü ve yeni timer
        const activeTimersSnapshot = await db.firestore()
            .collection("timers")
            .where("userId", "==", uid)
            .where("isActive", "==", true)
            .get();

        if (!activeTimersSnapshot.empty) {
            res.status(400);
            return next(new Error("Zaten aktif bir zamanlayıcınız var"));
        }

        // eğer todoId verildiyse kontrol et
        if (todoId) {
            const todoDoc = await db.firestore().collection("todos").doc(todoId).get();
            if (!todoDoc.exists){
                res.status(400);
                return next(new Error("İlgili görev bulunamadı"));
            }
            if (todoDoc.data().userId !== uid) {
                res.status(403);
                return next(new Error("Bu görev üzerinde işlem yapma yetkiniz yok"))

            }
        }

        // yeni timer oluştur
        const timerRef = db.firestore().collection("timers").doc();
        await timerRef.set({
            userId: uid,
            todoId: todoId || null,
            segments: [{
                startTime : now,
                endTime: null,
                duration: null,
            }],
            totalDuration : 0,
            createdAt : now,
            isActive: true
        });

        res.status(200).json({
            message : "Zamalayıcı başlatıldı",
            timerId: timerRef.id
        });

        

    }catch(error) {
        res.status(500);
        next(error);
    }
}