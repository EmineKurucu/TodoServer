const db = require("../../firebase/firebase");
const { patch } = require("../../routes/entryRoutes");

exports.getDailyDuration = async (req, res , next) => {
    const uid = req.user.id;
    const {date} = req.query;

    if (!date) return res.status(400).json({error : "Tarih gerekli"});

    const start = new Date(date);
    start.setHours(0,0,0,0);

    const end = new Date(date);
    end.setHours(23,59,59,999);

    try {
        const snapshot = await db.firestore()
            .collection("timers")
            .where("userId", "==", uid)
            .where("segments", "!=", null)
            .get();

        let totalSeconds = 0;

        snapshot.docs.forEach(doc => {
            const { segments = []} = doc.data();
            segments.forEach(s => {
                const sStart = new Date(s.startTime);
                if (sStart >= start && sStart <= end){
                    totalSeconds += s.duration || 0;
                }
            });
        });

        function formatDuration(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds/ 3600) / 60);
            const s = seconds % 60;

            const parts = [];
            if (h>0) parts.push(`${m} saat`);
            if (m >0) parts.push(`${m} dakika`);
            if (s>0 || parts.length === 0) parts.push(`${s} saniye`);

            return parts.join(" ");
        }

        res.status(200).json({
            date,
            totalSeconds,
            formatted : formatDuration(totalSeconds)
        });
    } catch(error){
        res.status(500);
        next(error);
    }
};