const admin = require("../firebase/firebase");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      success: false,
      message: "Yetkilendirme gerekli"
    });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken.email_verified) {
      return res.status(403).json({
        success: false,
        message: "Lütfen email adresinize gönderilen linkten doğrulama işlemi yapınız"
      });
    }

    req.user = decodedToken; // UID, email, vs. bilgileri buraya alıyoruz
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token geçersiz",
      error: error.message
    });
  }
};

module.exports = verifyToken;
