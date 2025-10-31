module.exports = {
  // User roles
  ROLES: {
    TRIAL: 'trial',
    USER: 'user',
    ADMIN: 'admin',
  },

  // User status
  USER_STATUS: {
    ACTIVE: 'active',
    LOCKED: 'locked',
    EXPIRED: 'expired',
  },

  // Transaction types
  TRANSACTION_TYPES: {
    PURCHASE: 'purchase',
    RENEWAL: 'renewal',
  },

  // Transaction status
  TRANSACTION_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    REJECTED: 'rejected',
  },

  // Message status
  MESSAGE_STATUS: {
    PENDING: 'pending',
    WON: 'won',
    LOST: 'lost',
    ERROR: 'error',
  },

  // Payment method types
  PAYMENT_TYPES: {
    BANK: 'bank',
    MOMO: 'momo',
    ZALOPAY: 'zalopay',
  },

  // Regions
  REGIONS: {
    MB: 'mb', // Miền Bắc
    MT: 'mt', // Miền Trung
    MN: 'mn', // Miền Nam
  },

  // 40 Bet types
  BET_TYPES: {
    DE: 'de',                    // Đề
    DAU: 'dau',                  // Đầu
    DUOI: 'duoi',                // Đuôi
    DAU_DUOI: 'dauduoi',         // Đầu-Đuôi
    LO: 'lo',                    // Bao lô
    XIU_CHU: 'xiu_chu',          // Xỉu chủ
    XIU_CHU_DAU: 'xiu_chu_dau',  // Xỉu chủ đầu
    XIU_CHU_DUOI: 'xiu_chu_duoi', // Xỉu chủ đuôi
    DA: 'da',                    // Đá
    DA_XIEN: 'da_xien',          // Đá xiên
    BAY_LO: 'bay_lo',            // Bảy lô
    TAM_LO: 'tam_lo',            // Tám lô
    BAY_LO_DAO: 'bay_lo_dao',    // Bảy lô đảo
    TAM_LO_DAO: 'tam_lo_dao',    // Tám lô đảo
    XIU_CHU_DAO_DAU: 'xiu_chu_dao_dau',   // Xỉu chủ đảo đầu
    XIU_CHU_DAO_DUOI: 'xiu_chu_dao_duoi', // Xỉu chủ đảo đuôi
    KEO: 'keo',                  // Kéo
    CHAN: 'chan',                // Chẵn
    LE: 'le',                    // Lẻ
    CHAN_CHAN: 'chan_chan',      // Chẵn chẵn
    LE_LE: 'le_le',              // Lẻ lẻ
    CHAN_LE: 'chan_le',          // Chẵn lẻ
    LE_CHAN: 'le_chan',          // Lẻ chẵn
    GIAP: 'giap',                // Giáp
    DAI_2: 'dai_2',              // 2 Đài
    DAI_3: 'dai_3',              // 3 Đài
    DAI_4: 'dai_4',              // 4 Đài
    DE_DAU_DB: 'de_dau_db',      // Đề đầu đặc biệt
    DE_DAU_G1: 'de_dau_g1',      // Đề đầu giải 1
    DE_GIAI1: 'de_giai1',        // Đề giải 1
    XIEN2: 'xien2',              // Xiên 2
    XIEN3: 'xien3',              // Xiên 3
    XIEN4: 'xien4',              // Xiên 4
    DE_GIAP: 'de_giap',          // Đề giáp
    DE_DAN: 'de_dan',            // Đề dàn
    DE_TONG: 'de_tong',          // Đề tổng
    DE_DAU_DUOI: 'de_dau_duoi',  // Đề đầu đuôi
    DE_CHAN_LE: 'de_chan_le',    // Đề chẵn lẻ
    DE_HE: 'de_he',              // Đề hệ
    DE_CO_SO: 'de_co_so',        // Đề có số
    DE_KEP: 'de_kep',            // Đề kép
  },

  // Default pricing config
  DEFAULT_PRICING: {
    mb: {
      de: { giaBan: 0.75, tienThang: 75 },
      dau: { giaBan: 0.75, tienThang: 75 },
      duoi: { giaBan: 0.75, tienThang: 75 },
      dauduoi: { giaBan: 0.75, tienThang: 75 },
      lo: { giaBan: 0.75, tienThang: 75 },
      xiu_chu: { giaBan: 0.75, tienThang: 650 },
      xiu_chu_dau: { giaBan: 0.75, tienThang: 650 },
      xiu_chu_duoi: { giaBan: 0.75, tienThang: 650 },
      da: { giaBan: 0.75, tienThang: 750 },
      da_xien: { giaBan: 0.75, tienThang: 550 },
      bay_lo: { giaBan: 0.75, tienThang: 500 },
      tam_lo: { giaBan: 0.75, tienThang: 500 },
      bay_lo_dao: { giaBan: 0.75, tienThang: 500 },
      tam_lo_dao: { giaBan: 0.75, tienThang: 500 },
      xiu_chu_dao_dau: { giaBan: 0.75, tienThang: 650 },
      xiu_chu_dao_duoi: { giaBan: 0.75, tienThang: 650 },
      keo: { giaBan: 0.75, tienThang: 75 },
      chan: { giaBan: 0.75, tienThang: 75 },
      le: { giaBan: 0.75, tienThang: 75 },
      chan_chan: { giaBan: 0.75, tienThang: 75 },
      le_le: { giaBan: 0.75, tienThang: 75 },
      chan_le: { giaBan: 0.75, tienThang: 75 },
      le_chan: { giaBan: 0.75, tienThang: 75 },
      giap: { giaBan: 0.75, tienThang: 150 },
      dai_2: { giaBan: 0.75, tienThang: 150 },
      dai_3: { giaBan: 0.75, tienThang: 225 },
      dai_4: { giaBan: 0.75, tienThang: 300 },
      de_dau_db: { giaBan: 0.75, tienThang: 750 },
      de_dau_g1: { giaBan: 0.75, tienThang: 750 },
      de_giai1: { giaBan: 0.75, tienThang: 650 },
      xien2: { giaBan: 0.75, tienThang: 550 },
      xien3: { giaBan: 0.75, tienThang: 2750 },
      xien4: { giaBan: 0.75, tienThang: 13750 },
      de_giap: { giaBan: 0.75, tienThang: 150 },
      de_dan: { giaBan: 0.75, tienThang: 750 },
      de_tong: { giaBan: 0.75, tienThang: 750 },
      de_dau_duoi: { giaBan: 0.75, tienThang: 750 },
      de_chan_le: { giaBan: 0.75, tienThang: 750 },
      de_he: { giaBan: 0.75, tienThang: 750 },
      de_co_so: { giaBan: 0.75, tienThang: 750 },
      de_kep: { giaBan: 0.75, tienThang: 150 },
    },
    mt: {
      // Copy from mb with same values
      de: { giaBan: 0.75, tienThang: 75 },
      dau: { giaBan: 0.75, tienThang: 75 },
      duoi: { giaBan: 0.75, tienThang: 75 },
      dauduoi: { giaBan: 0.75, tienThang: 75 },
      lo: { giaBan: 0.75, tienThang: 75 },
      xiu_chu: { giaBan: 0.75, tienThang: 650 },
      xiu_chu_dau: { giaBan: 0.75, tienThang: 650 },
      xiu_chu_duoi: { giaBan: 0.75, tienThang: 650 },
      da: { giaBan: 0.75, tienThang: 750 },
      da_xien: { giaBan: 0.75, tienThang: 550 },
      bay_lo: { giaBan: 0.75, tienThang: 500 },
      tam_lo: { giaBan: 0.75, tienThang: 500 },
      bay_lo_dao: { giaBan: 0.75, tienThang: 500 },
      tam_lo_dao: { giaBan: 0.75, tienThang: 500 },
      xiu_chu_dao_dau: { giaBan: 0.75, tienThang: 650 },
      xiu_chu_dao_duoi: { giaBan: 0.75, tienThang: 650 },
      keo: { giaBan: 0.75, tienThang: 75 },
      chan: { giaBan: 0.75, tienThang: 75 },
      le: { giaBan: 0.75, tienThang: 75 },
      chan_chan: { giaBan: 0.75, tienThang: 75 },
      le_le: { giaBan: 0.75, tienThang: 75 },
      chan_le: { giaBan: 0.75, tienThang: 75 },
      le_chan: { giaBan: 0.75, tienThang: 75 },
      giap: { giaBan: 0.75, tienThang: 150 },
      dai_2: { giaBan: 0.75, tienThang: 150 },
      dai_3: { giaBan: 0.75, tienThang: 225 },
      dai_4: { giaBan: 0.75, tienThang: 300 },
      de_dau_db: { giaBan: 0.75, tienThang: 750 },
      de_dau_g1: { giaBan: 0.75, tienThang: 750 },
      de_giai1: { giaBan: 0.75, tienThang: 650 },
      xien2: { giaBan: 0.75, tienThang: 550 },
      xien3: { giaBan: 0.75, tienThang: 2750 },
      xien4: { giaBan: 0.75, tienThang: 13750 },
      de_giap: { giaBan: 0.75, tienThang: 150 },
      de_dan: { giaBan: 0.75, tienThang: 750 },
      de_tong: { giaBan: 0.75, tienThang: 750 },
      de_dau_duoi: { giaBan: 0.75, tienThang: 750 },
      de_chan_le: { giaBan: 0.75, tienThang: 750 },
      de_he: { giaBan: 0.75, tienThang: 750 },
      de_co_so: { giaBan: 0.75, tienThang: 750 },
      de_kep: { giaBan: 0.75, tienThang: 150 },
    },
    mn: {
      // Copy from mb with same values
      de: { giaBan: 0.75, tienThang: 75 },
      dau: { giaBan: 0.75, tienThang: 75 },
      duoi: { giaBan: 0.75, tienThang: 75 },
      dauduoi: { giaBan: 0.75, tienThang: 75 },
      lo: { giaBan: 0.75, tienThang: 75 },
      xiu_chu: { giaBan: 0.75, tienThang: 650 },
      xiu_chu_dau: { giaBan: 0.75, tienThang: 650 },
      xiu_chu_duoi: { giaBan: 0.75, tienThang: 650 },
      da: { giaBan: 0.75, tienThang: 750 },
      da_xien: { giaBan: 0.75, tienThang: 550 },
      bay_lo: { giaBan: 0.75, tienThang: 500 },
      tam_lo: { giaBan: 0.75, tienThang: 500 },
      bay_lo_dao: { giaBan: 0.75, tienThang: 500 },
      tam_lo_dao: { giaBan: 0.75, tienThang: 500 },
      xiu_chu_dao_dau: { giaBan: 0.75, tienThang: 650 },
      xiu_chu_dao_duoi: { giaBan: 0.75, tienThang: 650 },
      keo: { giaBan: 0.75, tienThang: 75 },
      chan: { giaBan: 0.75, tienThang: 75 },
      le: { giaBan: 0.75, tienThang: 75 },
      chan_chan: { giaBan: 0.75, tienThang: 75 },
      le_le: { giaBan: 0.75, tienThang: 75 },
      chan_le: { giaBan: 0.75, tienThang: 75 },
      le_chan: { giaBan: 0.75, tienThang: 75 },
      giap: { giaBan: 0.75, tienThang: 150 },
      dai_2: { giaBan: 0.75, tienThang: 150 },
      dai_3: { giaBan: 0.75, tienThang: 225 },
      dai_4: { giaBan: 0.75, tienThang: 300 },
      de_dau_db: { giaBan: 0.75, tienThang: 750 },
      de_dau_g1: { giaBan: 0.75, tienThang: 750 },
      de_giai1: { giaBan: 0.75, tienThang: 650 },
      xien2: { giaBan: 0.75, tienThang: 550 },
      xien3: { giaBan: 0.75, tienThang: 2750 },
      xien4: { giaBan: 0.75, tienThang: 13750 },
      de_giap: { giaBan: 0.75, tienThang: 150 },
      de_dan: { giaBan: 0.75, tienThang: 750 },
      de_tong: { giaBan: 0.75, tienThang: 750 },
      de_dau_duoi: { giaBan: 0.75, tienThang: 750 },
      de_chan_le: { giaBan: 0.75, tienThang: 750 },
      de_he: { giaBan: 0.75, tienThang: 750 },
      de_co_so: { giaBan: 0.75, tienThang: 750 },
      de_kep: { giaBan: 0.75, tienThang: 150 },
    },
  },

  // Timeout for payment (10 minutes)
  PAYMENT_TIMEOUT: 10 * 60 * 1000,

  // Trial account duration (24 hours)
  TRIAL_DURATION: 24 * 60 * 60 * 1000,
};
