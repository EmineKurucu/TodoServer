const db = require("../../firebase/firebase");

const getPriorityLevel = (priority) => {
    switch (priority?.toLowerCase()) {
        case "önemli":
            return 3;
        case "orta":
            return 2;
        case "düşük":
            return 1;
        default:
            return 1;
    }
};

// genel güncellemeler (todo meeting event)
exports.updateEntry = async (req, res , next) => {
    const {id} = req.params;
    const updatedData = req.body;

    try {
        const docRef = db.collection("entries").doc(id);
        const doc = await docRef.get();

        if (!doc.exists){
            return res.status(404).json({
                error : "Kayıt bulunamadı"
            });
        }

        const currentData = doc.data();
        const type = currentData.type; // şu anki data type ı aldık

        // tarih güncellendiyse timestamp
        if (updatedData.date && typeof updatedData.date == "string"){
            updatedData.date = new Date(updatedData.date);
        }

        // todo özel güncellemeleri
        if (type == "todos"){
            if (updatedData.priority) {
                updatedData.getPriorityLevel = getPriorityLevel(updatedData.priority);
            }

            if (updatedData.hashOwnProperty("isCompleted")){
                if (updatedData.isCompleted === true){
                    updatedData.completedAt = new Date();
                    updatedData.filureReason = null;
                } else {
                    updatedData.completedAt = null;
                }
            }
        }

        // meeting kontrolü
        if (type === "meeting"){
            if ((updatedData.startTime && !updatedData.endTime) ||
                (!updatedData.startTime && updatedData.endTime)){
                    return res.status(400).json({error: "Toplantı güncellemesinde startTime ve endTime zorunlu"})
                }
        }

        // güncelleme zaman9
        updatedData.updatedAt = new Date().toISOString();

        await docRef.update(updatedData);
        res.status(200).json({
            message : "Kayıt başarıyla güncellendi" 

        });
    }catch(error) {
        res.status(400).json({message : "Kayıt güncellenemedi"});
        next(error);
    }
};