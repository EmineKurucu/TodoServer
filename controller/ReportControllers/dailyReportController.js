const db = require("../../firebase/firebase");

const getDayRange = (date) => {
    const start = new Date(date);
    start.setHours(0,0,0,0);

    const end = new Date(date);
    end.setHours(23,59,59,999);

    return {start, end};
};

const getWeekRange = (date) => {
    const curr = new Date(date);
    const day = curr.getDay();
    const diffToMonday = (day === 0 ? 6 : day-1);

    const monday = new Date(curr);
    monday.setDate(curr.getDate() - diffToMonday);
    monday.setHours(0,0,0,0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23,59,59,999);

    return {start: monday, end:sunday};

};


// daily report
exports.getDailyReport = async (req , res , next)=> {
    try {
        const userID = req.user.uid;
        let {date} = req.query;

        if (!date) {
            return res.status(400).json({error : "Tarih zorunludur"});
        }

        const {start, end} = getDayRange(date);

        const snapshot = await db.collection("entries")
            .where("userID", "==", userID)
            .where("type", "==", "todo")
            .where("date", ">=", start)
            .where("date", "<=", end)
            .orderBy("date", "asc")
            .get();

        const todos = snapshot.docs.map(doc => ({id : doc.id, ...doc.data()}));
        const total = todos.lenght;
        const completedCount = todos.filter(t => t.isCompleted).lenght;
        const notCompletedCount = total - completedCount;

        const priorityCounts = {high:0, medium:0 , low:0};
        todos.forEach(t => {
            if (t.priorityLevel ===3 ) priorityCounts.high++;
            else if (t.priorityLevel === 2) priorityCounts.medium++;
            else priorityCounts.low++;
        });

        const failureReason = todos 
            .filter(t => !t.isCompleted && t.failureReason)
            .map(t => ({id : t.id, title:t.title, failureReason: t.failureReason}));

        res.status(200).json({
            date: start.toDateString().split("T")[0],
            total,
            completedCount,
            notCompletedCount,
            completionRate: total ? ((completedCount/ total) *100 ).toFixed(2) : "0.00",
            priorityDistribution : priorityCounts,
            failureReason,
            todos
        });


    } catch(error) {
        res.status(500);
        next(error);
        
    }
};