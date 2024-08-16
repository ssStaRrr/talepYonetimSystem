const mongoose = require('mongoose');

// Talep şeması tanımlaması
const talep = new mongoose.Schema({
    talepNo: {
        type: String
    },
    gelisTarihi: {
        type: Date,
        default: Date.now
    },
    bitisTarihi: {
        type: Date,
        default: null
    },
    gonderenKisi: {
        type: String,
        required: true
    },
    gelenBirim: {
        type: String,
        required: true
    },
    sorun: {
        type: String,
        default: ""
    },
    bilgisayarOzellikleri: {
        type: String,
        default:""
    },
    yapilanIslem: {
        type: String,
        default: ""
    },
    tamamlandi: {
        type: String,
        enum: ["Evet", "Hayır"],
        default: "Hayır"
    }
});

// Belge oluşturulmadan önce pre-save middleware'ı
talep.pre("save", function(next){
    if(this.isNew) {
        this.talepNo = this._id.toString()
    }
    next()
})

// Talep modelini oluşturma
const Talep = mongoose.model('Talep', talep);

module.exports = Talep;
