const e = require("express");
const db = require("../../firebase/firebase");

exports.editAccount = async (req, res , next) => {
    const {uid} = req.user;
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.status(400);
        return next(new Error("İsim , email ve password alanları boş olamaz"));
    }

    try {
        const updateAuthData = {} ;
        const updateFirestoreData = {} ;

        if (email) {
            updateAuthData.email = email;
            updateFirestoreData.email = email;
        }

        if (name) {
            updateAuthData.name = name;
            updateFirestoreData.name = name;
        }

        if(password) {
            updateAuthData.password = password;
            updateFirestoreData.password = password;
        }

        // firebase auth kısmını güncelliyoruz
        if (Object.keys(updateFirestoreData).length > 0) {
            await db.firestore().collection("user").doc(uid).update(updateFirestoreData);
        }

        res.status(200).json({
            message : "Hesap bilgileri başarıyla güncellendi"
        });
    
    } catch(error) {
        res.status(500);
        next(error);
    }
};