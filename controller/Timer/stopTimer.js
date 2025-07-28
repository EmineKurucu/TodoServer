const db = require("../../firebase/firebase");

exports.stopTimer = async (req, res , next) => {
    const {uid} = req.user;
    const {timerId} = req.body;

    try {
        const timerRef = db.firestore().collection("timers").doc(timerId);

        await db.firestore().runTransaction(async (t) => {
            const doc = await t.get(timerRef);

            if (!doc.exists){
                throw new Error("Zamanlayıcı bulunamadı");
            }

            const timer = doc.data();

            if (timer.userId !== uid){
                throw new Error("Bu zamanlayıcıya erişim izniniz yok");
            }

            const segments = timer.segments || [];
            const lastSegment = segments[segments.length -1];

            if (!lastSegment || lastSegment.endTime) {
                throw new Error("Zaten durdulmuş bir segment");
            }

            const endTime = new Date();
            const startTime = new Date(lastSegment.startTime);
            const duration = Math.floor((endTime - startTime) / 1000); // SANİYE CİNSİNDEN

            // segmenti güncelle
            lastSegment.endTime = endTime.toISOString();
            lastSegment.duration = duration;

            const newTotal = (timer.totalDuration || 0) + duration;

            // timer güncelle
            t.update(timerRef, {
                segments: segments,
                totalDuration : newTotal,
                isActive: false
            });

            // eğer kullanıcı bu todo ile ilişkiliyse todoya süre ekle
            if (timer.todoId) {
                const todoRef = db.firestore().collection("todos").doc(timer.todoId);
                const todoDoc = await t.get(todoRef);

                if (todoDoc.exists){
                    const currentTodoDuration = todoDoc.data().totalDuration || 0;
                    t.update(todoRef, {
                        totalDuration: currentTodoDuration + duration
                    });
                }
            }   
        });

        res.status(200).json({
            message : "Zamanlayıcı durduruldu",
            timerId : timerId
        });
    }catch (error) {
        res.status(400);
        next(error);
    }
};