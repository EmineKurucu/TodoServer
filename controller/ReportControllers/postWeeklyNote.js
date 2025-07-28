const db = require("../../firebase/firebase");

exports.postWeeklyNote = async(req, res, next) => {
    try {
        const userID = req.user.uid;
        const {weekEnd, note} = req.body;

        const notesRef = db.collection("weeklyNotes").doc(userID);
        await notesRef.set({ [weekEnd] : note}, {merge: true});

        res.status(200).json({message : "Notunuz kaydeildi"});

    }catch (error) {
        res.status(500);
        next(error);
    }
};