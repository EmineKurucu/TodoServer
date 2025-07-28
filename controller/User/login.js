const db = require("../../firebase/firebase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req , res, next) => {
    try {

        const {name, email, password} = req.body;

        if (!email || !password) {
            res.status(400);
            return next(new Error("Gerekli alanlar boş bırakılamaz"));
        }

        const emailRegex = /^[^@\s]+@test\.com/;
        if (!emailRegex.test(email)) {
            res.status(400);
            return next(new Error("Email deneme@test.com formatında olmalı"));
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)){
            return res.status(400).json({
                message : "Şifre en az 8 karakter, bir büyük harf, bir küçük harf, bir rakam içermeli"
            });

        }

        // Kullanıcıyı firestoredan bulma
        const snapshot = await db.collection("users").where("email", "==", email).get();
        if (snapshot.empty) {
            return res.status(400).json({message : "Kullanıcı bulunamadı"});
        }

        let userData;
        snapshot.forEach(doc => {
            userData = {id: doc.id, ...doc.data()};
        });

        const macth = await bcrypt.compare(password, userData.password);
        if (!match) {
            return res.status(400).json({message : "Şifre hatalı"});
        }

        // JWT Token oluşturma
        const token = jwt.sign({id : userData.id, email: userData.email, }, "SECRET_KEY", {
            expiresIn: "1h"
        });

        // başarılı dönüt
        res.status(200).json({
            message : "Giriş başarılı",
            token,
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name
            }
            
        });

    } catch(error){
        res.status(500);
        next(error);
    }
};