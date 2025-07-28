const db = require("../../firebase/firebase");

exports.getActiveTimer = async (req, res, next) => {
    const uid = req.user.uid;

    try {
        const snapshot = await db
            .firestore()
            .collection("timers")
            .where("userId", "==", uid)
            .where("isActice", "==", true)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(200).json(null);
        }

        const timer = snapshot.docs[0];
        res.status(200).json({
            id : timer.id,
            ...timer.data()
        });
    } catch(error){
        res.status(500);
        next(error);
    }
};