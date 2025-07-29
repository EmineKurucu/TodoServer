# ToDoApp – Görev Takip ve Zaman Yönetimi Uygulaması

Bu proje, kullanıcıların görev yönetimini kolaylaştırmak ve zaman takibini etkili hale getirmek amacıyla geliştirilmiş bir web/mobil uyumlu ToDo uygulamasıdır.

## 🚀 Özellikler

- 📝 Görev ekleme, silme, güncelleme
- 🗒️ Görevlere not ekleme
- ⏱️ Zamanlayıcı başlatma, durdurma, kaydetme
- 📊 Günlük, haftalık ve aylık görev raporları (grafik destekli)
- 👤 Kullanıcı kayıt, giriş, şifre yenileme ve profil güncelleme

## 🛠️ Teknolojiler

### Backend
- Node.js
- Express.js
- Firebase (Realtime Database / Firestore)
- CORS ve güvenlik önlemleri

### API Özeti
- `POST /auth/register`: Kullanıcı kaydı
- `POST /auth/login`: Giriş yapma
- `POST /auth/reset-password`: Şifre yenileme
- `GET /todos`: Kullanıcının görevlerini alma
- `POST /todos`: Yeni görev ekleme
- `PUT /todos/:id`: Görev güncelleme
- `DELETE /todos/:id`: Görev silme
- `POST /timer/start`: Zamanlayıcı başlatma
- `POST /timer/stop`: Zamanlayıcı durdurma
- `GET /report/daily`: Günlük rapor
- `GET /report/weekly`: Haftalık rapor
- `GET /report/monthly`: Aylık rapor

### Frontend
- React.js (şu an geliştiriliyor)
- Responsive ve mobil uyumlu tasarım
- Axios ile API bağlantıları
- Chart.js veya Recharts ile grafik gösterimleri (planlanıyor)

## 🔒 Kimlik Doğrulama
Firebase Authentication ile kullanıcı doğrulama sağlanmaktadır.

