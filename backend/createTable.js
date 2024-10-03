const { sql, poolPromise } = require("./db");

async function createTable() {
  try {
    
    const pool = await poolPromise;

    // "Musteriler" tablosunu oluşturma sorgusu
    const createMusterilerTable = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Musteriler' AND xtype='U')
      CREATE TABLE Musteriler (
        MusteriId INT IDENTITY(1,1) PRIMARY KEY,
        Adi NVARCHAR(50) NOT NULL,
        Soyadi NVARCHAR(50) NOT NULL,
        KullaniciAdi NVARCHAR(100) NOT NULL,
        Sifre NVARCHAR(100) NOT NULL
      )
    `;

    // "Kuaforler" tablosunu oluşturma sorgusu
    const createKuaforlerTable = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Kuaforler' AND xtype='U')
      CREATE TABLE Kuaforler (
        KuaforId INT IDENTITY(1,1) PRIMARY KEY,
        KuaforAdi NVARCHAR(100) NOT NULL,
        KuaforUrl NVARCHAR(150) NOT NULL
      )
    `;

    // "Randevular" tablosunu oluşturma sorgusu
    const createRandevularTable = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Randevular' AND xtype='U')
      CREATE TABLE Randevular (
        RandevuId INT IDENTITY(1,1) PRIMARY KEY,
        MusteriId INT NOT NULL,
        KuaforId INT NOT NULL,
        RandevuZamani DATETIME NOT NULL,
        FOREIGN KEY (MusteriId) REFERENCES Musteriler(MusteriId),
        FOREIGN KEY (KuaforId) REFERENCES Kuaforler(KuaforId)
      )
    `;

    await pool.request().query(createMusterilerTable);
    console.log("Musteriler tablosu oluşturuldu.");

    await pool.request().query(createKuaforlerTable);
    console.log("Kuaforler tablosu oluşturuldu.");

    await pool.request().query(createRandevularTable);
    console.log("Randevular tablosu oluşturuldu.");
  } catch (error) {
    console.error("Tablo oluşturma hatası:", error);
  } finally {
    
  }
}

module.exports = createTable;
