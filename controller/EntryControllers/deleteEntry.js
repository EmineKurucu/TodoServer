const db = require("../../firebase/firebase");

// Genel silme (todo, meeting, event)
exports.deleteEntry = async (req, res , next) => {
    const { id } = req.params;

    try {
        const docRef = db.collection("entries").doc(id);
        const doc = await docRef.get();

        if (!doc.exists){
            return res.status(404).json({error : "Kayıt bulunamadı"});
        }

        await docRef.delete();
        res.status(200).json({message : "Kayıt silindi"});
    } catch(error){
        res.status(500);
        next(error);
    }
};