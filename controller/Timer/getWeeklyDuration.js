const db = require("../../firebase/firebase");

exports.getWeeklySummary = async (req, res , next) => {
    const uid = req.user.uid;
    const {weekStart} = req.query;

    if (!weekStart) return res.status(400).json({error: "weekStart zorunludur"});

    const start = new Date(weekStart);
    const days = [...Array(7)].map((_,i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + 1 );
        return d;
    });

    try {
        const snapshot = await db.firestore()
            .collection("timers")
            .where("userId", "==", uid)
            .get();

            const dailyDurations = days.map(date => ({
                date: date.toISOString().split("T")[0],
                duration: 0
            }));

        snapshot.docs.forEach(doc => {
            const {segments = [] } = doc.data();
            segments.forEach(s => {
                const sStart = new Date(s.startTime);
                const index = days.findIndex(d => 
                    sStart.getFullYear() === d.getFullYear() &&
                    sStart.getMonth() === d.getMonth() &&
                    sStart.getDate() === d.getDate()
                );

                if (inex !== -1){
                    dailyDurations[index].duration += s.duration || 0;
                }
            });
        });

        function formatDuration(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds / 3600)/ 60);
            const s = seconds % 60;

            const parts = [];
            if (h>0) parts.push(`${h} saat`);
            if (m>0) parts.push(`${m} dakika`);
            if (s>0 || parts.length === 0) parts.push(`${s} saniye`);

            return parts.join(" ");
        }

        res.status(200).json(dailyDurations);
    }catch(error){
        res.status(500);
        next(error);

    }
};