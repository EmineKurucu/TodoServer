const db = require("../../firebase/firebase");

// Trih formatını düzenliyoruz ki Date() kullanabilsin
const formatDate = (dateString) => {
    if (!dateString) return dateString;
    return dateString.replace(/\./g, '-'); // 15.07.205 -> 15-07-2025

};

// öncelik seviyesini sayısal veriye döndürüyoruz
const getPriorityLevel = (priority) => {
    switch (priority?.toLowerCase()) {
        case  "önemli":
            return 3;
        case "orta":
            return 2;
        case "düşük":
            return 1;
        default:
            return 1;
    }
};

// Genel item oluşturma (todo / meeting / event)
exports.createEntry = async (req, res, next) => {
    const userID = req.user.uid; //verifyToken ile authentication
    const {
        type ,
        title,
        description,
        date,
        priority,
        time,
        location,
        participants,
        startTime,
        endTime
    } = req.body;

    console.log("Request body:" , req.body);

    //zorunlu alanların kontrolü
    if (!["todo", "meeting", "event"].includes(type)) {
        return res.status(400).json({error:"Geçersiz type değeri"});
        
    }

    if (!title || !date){
        return res.status(400).json({error:"Title ve date alanları boş olamaz"});
    }

    try {
        const formattedDate = formatDate(date);
        const priorityLevel = getPriorityLevel(priority);

        const newItem = {
            userID,
            type,
            title,
            description: description || "",
            date: new Date().toISOString(formattedDate),
            createdAt: new Date().toISOString()
        };

        // Görev todo fieldi
        if (type === "todo") {
            newItem.priority = priority || "düşük";
            newItem.priorityLevel = priorityLevel;
            newItem.isCompleted = false,

            newItem.completedAt = null;
            newItem.failureReason = null;
            newItem.date = new Date(formattedDate);
        }

        // meeting özel fieldi
        if (type === "meeting"){
            if (!startTime || !endTime){
                return res.status(400).json({error: "meeting için startTime ve endTime değerleri boş olamaz"});
            }

            newItem.startTime = startTime;
            newItem.endTime = endTime;
            newItem.location = location || [];
            newItem.participants = participants || []; // participants ve location boş olabilir
        }
        
        // event field
        if (type === "event"){
            newItem.time = time || null;
            newItem.location = location || "";
        }

        // firebase e kayıt
        const docRef = await db.collectiob("entries").add(newItem);
        console.log("Item created with ID:", docRef.id);

        res.status(201).json({
            id: docRef.id,
            ...newItem
        });
    } catch (error) {
        res.status(500);
        next(error);
    }
};