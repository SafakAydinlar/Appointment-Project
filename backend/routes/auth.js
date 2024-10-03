const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");
const moment = require('moment-timezone');

// KAYIT OLMA ENDPOİNTİ
router.post("/register/", async (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  if (!firstname || !lastname || !username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Kullanıcı adı ve şifre gereklidir." });
  }

  try {
    const pool = await poolPromise;

    const checkUser = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query(
        "SELECT COUNT(*) as count FROM Musteriler WHERE KullaniciAdi = @username"
      );

    if (checkUser.recordset[0].count > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Bu kullanıcı adı zaten alınmış." });
    }

    await pool
      .request()
      .input("firstname", sql.NVarChar, firstname)
      .input("lastname", sql.NVarChar, lastname)
      .input("username", sql.NVarChar, username)
      .input("password", sql.NVarChar, password)
      .query(
        "INSERT INTO Musteriler (Adi, Soyadi, KullaniciAdi, Sifre) VALUES (@firstname, @lastname, @username, @password)"
      );

    res.json({ success: true, message: "Kayıt başarılı!" });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ success: false, message: "Kayıt sırasında hata oluştu." });
  }
});

// GİRİŞ YAPMA ENDPOİNTİ
router.post("/login/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Kullanıcı adı ve şifre gereklidir." });
  }

  try {
    const pool = await poolPromise;

    
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("password", sql.NVarChar, password)
      .query(
        "SELECT MusteriId, Adi, Soyadi FROM Musteriler WHERE KullaniciAdi = @username AND Sifre = @password"
      );

    
    if (username === "1.admin" && password === "admin123") {
      return res.json({
        success: true,
        message: "Admin giriş başarılı!",
      });
    }

    if (result.recordset.length > 0) {
      
      const musteri = result.recordset[0];
      res.json({
        success: true,
        message: "Giriş başarılı!",
        musteriId: musteri.MusteriId,
        adi: musteri.Adi,
        soyadi: musteri.Soyadi,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Geçersiz kullanıcı adı veya şifre.",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Giriş sırasında hata oluştu." });
  }
});




// RANDEVU ALMA ENDPOİNTİ
router.post("/bookAppointment", async (req, res) => {
  const { MusteriId, KuaforId, RandevuZamani } = req.body;

  
  console.log("MusteriId:", MusteriId);
  console.log("KuaforId:", KuaforId);
  console.log("RandevuZamani:", RandevuZamani);

  if (!MusteriId || !KuaforId || !RandevuZamani) {
    console.log("Eksik bilgi:", { MusteriId, KuaforId, RandevuZamani });
    return res
      .status(400)
      .json({ success: false, message: "Eksik bilgi var." });
  }

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("MusteriId", sql.Int, MusteriId)
      .input("KuaforId", sql.Int, KuaforId)
      .input("RandevuZamani", sql.DateTime, RandevuZamani)
      .query(`INSERT INTO Randevular (MusteriId, KuaforId, RandevuZamani) VALUES (@MusteriId, @KuaforId, @RandevuZamani)`);

    res
      .status(200)
      .json({ success: true, message: "Randevu başarıyla kaydedildi." });
  } catch (error) {
    console.error("Randevu kaydetme hatası:", error);
    res.status(500).json({ success: false, message: "Randevu kaydedilemedi." });
  }
});

// Kuaför seçme endpointi
router.get("/kuaforler", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT KuaforId, KuaforAdi, KuaforUrl FROM Kuaforler");

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Kuaför verilerini alma hatası:", error);
    res.status(500).json({ error: "Kuaför verilerini alırken hata oluştu" });
  }
});

// Kullanıcının randevularını çekme endpoint'i(RANDEVULAR KISMINDA RANDEVULARI GÖSTERMEK İÇİN)
router.get('/randevular', async (req, res) => {
  try {
    const pool = await poolPromise;
    
    
    const musteriId = parseInt(req.query.musteriId); 

    if (!musteriId) {
      return res.status(400).json({ success: false, message: "Müşteri ID'si gerekli." });
    }

    const query = `
      SELECT * FROM Randevular
      WHERE MusteriId = @MusteriId
    `;

    const result = await pool.request()
      .input('MusteriId', sql.Int, musteriId)
      .query(query);

    console.log('Randevular:', result.recordset); 
    res.json(result.recordset);
  } catch (error) {
    console.error('Randevular çekme hatası:', error);
    res.status(500).send('Randevular alınamadı');
  }
});




router.get("/bookedSlots", async (req, res) => {
  const { KuaforId, date } = req.query;

 
  if (!KuaforId || !date) {
    return res.status(400).json({ success: false, message: "Eksik bilgi var. KuaforId ve date parametreleri gereklidir." });
  }

  if (isNaN(KuaforId)) {
    return res.status(400).json({ success: false, message: "Geçersiz KuaforId. Sayısal bir değer olmalı." });
  }

  const dateObject = new Date(date);
  if (isNaN(dateObject.getTime())) {
    return res.status(400).json({ success: false, message: "Geçersiz tarih formatı." });
  }

  try {
    const pool = await poolPromise;
    
    const result = await pool
      .request()
      .input("KuaforId", sql.Int, KuaforId)
      .input("date", sql.DateTime, dateObject)
      .query(`
        SELECT RandevuZamani 
        FROM Randevular 
        WHERE KuaforId = @KuaforId 
        AND CAST(RandevuZamani AS DATE) = CAST(@date AS DATE)
      `);

    if (!result.recordset || result.recordset.length === 0) {
      console.warn(`Veritabanında KuaforId: ${KuaforId} ve Tarih: ${date} için randevu bulunamadı.`);
      return res.status(200).json({ success: true, message: "Belirtilen tarihte randevu bulunamadı.", bookedSlots: [] });
    }

    const bookedSlots = result.recordset.map((row, index) => {
      const randevuZamani = row.RandevuZamani; 
      
      const hours = randevuZamani.getUTCHours();  
      const minutes = randevuZamani.getUTCMinutes(); 
    
      return {
        hours,
        minutes
      };
    });
    

    console.log("Randevular başarıyla çekildi:", bookedSlots);

    res.status(200).json({ success: true, bookedSlots });

  } catch (error) {
    console.error("Veritabanı sorgusu sırasında bir hata oluştu:", error);
    res.status(500).json({ success: false, message: "Randevular çekilemedi.", error: error.message });
  }
});



router.delete('/randevusil/:randevuId', async (req, res) => {
  const { randevuId } = req.params;

  if (isNaN(randevuId)) {
    return res.status(400).send({ success: false, message: 'Geçersiz RandevuId.' });
  }

  try {
   
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('RandevuId', sql.Int, randevuId)
      .query('DELETE FROM Randevular WHERE RandevuId = @RandevuId');
      
    if (result.rowsAffected[0] > 0) {
      res.status(200).send({ success: true, message: 'Randevu başarıyla silindi.' });
    } else {
      res.status(404).send({ success: false, message: 'Randevu bulunamadı.' });
    }
  } catch (error) {
    console.error('Randevu silme hatası:', error.message);
    res.status(500).send({ success: false, message: 'Randevu silinirken bir hata oluştu.' });
  }
});


//ADMİN PANELİ İÇİN RANDEVULARI ÇEKME ENDPOİNTİ

router.get("/adminrandevu", async (req, res) => {
  try {
    const pool = await poolPromise;

   
    const result = await pool
      .request()
      .query(
        `SELECT RandevuId, MusteriId, KuaforId, RandevuZamani
         FROM Randevular`
      );

    if (result.recordset.length > 0) {
   
      res.json({
        success: true,
        randevular: result.recordset,
      });
    } else {
      
      res.status(404).json({
        success: false,
        message: "Randevu bulunamadı.",
      });
    }
  } catch (error) {
    console.error("Randevular error:", error);
    res.status(500).json({
      success: false,
      message: "Randevular çekilirken bir hata oluştu.",
    });
  }
});


module.exports = router;
