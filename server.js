const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const Talep = require("./model/talep");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Statik dosyaları sunmak için public klasörünü ayarlayın
app.use(express.static(path.join(__dirname, "public")));

app.get("/talepFormu", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Formu işleyen rota
app.post("/talepSubmit", async (req, res) => {
  try {
    const {
      talepNo,
      gelisTarihi,
      bitisTarihi,
      gonderenKisi,
      gelenBirim,
      sorun,
      bilgisayarOzellikleri,
      yapilanIslem,
      tamamlandi
    } = req.body;
    // Yeni bir talep oluşturma
    const newTalep = new Talep({
      talepNo,
      gelisTarihi,
      bitisTarihi,
      gonderenKisi,
      gelenBirim,
      sorun,
      bilgisayarOzellikleri,
      yapilanIslem,
      tamamlandi
    });
    console.log(newTalep);
    // Talebi kaydet
    await newTalep.save();
    res.send("Talep başarıyla kaydedildi.");
  } catch (err) {
    console.error("Talep kaydetme hatası:", err);
    res.status(500).send("Bir hata oluştu.");
  }
});

app.get("/listTaleps", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "talepList.html"));
});

app.get("/api/taleps", async (req, res) => {
  try {
    const taleps = await Talep.find({});
    res.json(taleps);
  } catch (err) {
    console.error("API talepleri listeleme hatası:", err);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

app.post("/api/talep/:id/update", async (req, res) => {
    const { id } = req.params;
    const { tamamlandi } = req.body;
    console.log(id, tamamlandi)
    try {
        const updatedTalep = await Talep.findByIdAndUpdate(id, { tamamlandi }, { new: true });
        res.json({ success: true, updatedTalep });
    } catch (err) {
        console.error("Talep güncelleme hatası:", err);
        res.status(500).json({ success: false, error: "Bir hata oluştu." });
    }
});

// MongoDB bağlantısı
mongoose
  .connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB bağlantisi basarili"))
  .catch((err) => console.error("MongoDB bağlanti hatasi:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu calisiyor: http://localhost:${PORT}`);
});
