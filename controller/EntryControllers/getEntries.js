const db = require("../../firebase/firebase");

exports.getEntries = async (req, res , next)=> {
    try {
        const {date , startDate, endDate, lastVisibleId, type} = req.query;
        const userID = req.user.uid;
        const limit = 10;

        let query = db.collection("entries").where("userID", "==", userID);

        // Tür filtreleme
        if (type) {
            query = query.where("type", "==", type);
        }

        // Timestamp olarak çevir
        const parsedDate = date ? new Date(date) : null;
        const parsedStartDate = startDate ? new Date(startDate) : null;
        const parsedEndDate = endDate ? new Date(endDate) : null;

        if (parsedStartDate && parsedEndDate) {
            query = query
                .where("date", ">=", parsedStartDate)
                .where("date", "<=", parsedEndDate)
                .where("date", "asc");
        } else if (parsedDate) {
            query = query.where("date", "==", parsedDate).orderBy("date", "asc");
        }else {
            query = query.orderBy("date", "asc") 
        }


        // pagioning
        if (lastVisibleId) {
            const lastVisibleDoc = await db.collection("entries").doc(lastVisibleId).get();
            if (!lastVisibleDoc.exists) {
                return res.status(400).json({error :"Invalid lastVisibleId" });
            }
            query = query.startAfter(lastVisibleDoc);
        }

        query = query.limit(limit) // her sayfada 10 ar tane var

        const snapshot = await query.get();

        const entries = snapshot.docs.map(doc => ({
            id : doc.id,
            ...doc.data()
        }));

        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        const newLastVisibleId = lastVisible ? lastVisible.id : null ;

        res.status(200).json({entries , lastVisibleId : newLastVisibleId});

    } catch(error){
        res.status(400).json({message: "Kayıt silinemedi"});
        next(error);

    }
}