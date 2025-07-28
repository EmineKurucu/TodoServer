const db = require("../../firebase/firebase");

exports.markCompleted = async (req, res , next) => {
    const {id} = req.params;

    try {
        const docRef = db.collection("entries").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(400).json({error : "Kayıt bulunamadı"});

        }

        const data = doc.data();

        await docRef.update({
            isCompleted : true,
            completedAt : new Date(),
            failureReason: null,
            updatedAt : new Date().toISOString()
        });

        res.status(200).json({message : "Gçrev tamamlandı olarak işaretlendi"});
    }catch (error) {
        res.status(500);
        next(error);
    }
};