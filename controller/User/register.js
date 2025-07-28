const db = require("../../firebase/firebase");

exports.register = async (req , res , next) => {
    const {name, email, password, confirmPassword} = req.body;

    if (!name || !email || !password || !confirmPassword) {
        res.status(400);
        return next(new Error("Gerekli alanlar boş bırakılamaz"));
    }

    if (name.length < 3) {
        res.status(400);
        return next(new Error("İsim çok kısa"));
    }

    const emailRegex = /^[^@\s]+@test\.com/;
    if (!emailRegex.test(email)){
        res.status(400);
        return next(new Error("Emaik deneme@test.com formatında olmalı")); 
    }

    if (password.length < 8){
        res.status(400);
        return next(new Error("Şifre en az 8 karakter içermeli"));
    }

    // şifre karmaşıklığı kontrolü
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)){
        res.status(400);
        return next(Error("Şifre ne az bir büyük harf, bir küçük harf ve bir rakam içermeli"));
    }

    if (password !== confirmPassword){
        res.status(400);
        return next(new Error("Şifre ve şifr tekarı eşleşmiyor"));
    }

    try {
        const userRecord = await db.auth().createUser({
            name,
            email,
            password
        });

        const userProfile = {
            uid : userRecord.uid,
            name: userRecord.name,
            email : userRecord.email,
            createdAt: new Date().toISOString
        };

        await db.firestore().collection("user").doc(userRecord.uid).set(userProfile);

        res.status(201).json({
            message : "Kayıt başarılı",
            user: {
                uid : userRecord.uid,
                name: userRecord.name,
                email: userRecord.email,
            }
        });
    }catch(error){
        res.status(500);
        next(error);

    }
};