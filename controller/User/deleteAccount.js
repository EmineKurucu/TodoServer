const db = require("../../firebase/firebase");

exports.deleteAccount = async(req, res , next) => {
    const {uid} = req.user;

    if (!uid) {
        res.status(400);
        return next(new Error("Kayıtlı kullanıcı bulunamadı"));
    }

    try {
        // fireabse authentication kısmından siliyoruz
        await db.auth().deleteUser(uid);

        // firestoredan kullanıcı profilini siliyoruz
        await db.firestore().collection("user").doc(uid).delete();

        // Kullanıcıya ait diğer dataları sil
        const todoSnapshot = await db.firestore()
            .collection("todos")
            .where("userId", "==", uid)
            .get();

        const batch = db.firestore().batch();
        todoSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        res.status(200).json({
            message : "Hesap ve tüm veriler başarıyla silindi"
        });
    } catch(error) {
        res.status(500);
        next(error);
    }
};