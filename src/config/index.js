exports.App_CONFIG = {
    APP_NAME: "BROOK-MUSIC",
  };
   
  // eslint-disable-next-line no-undef
  exports.CORS_WHITELISTS = [`${process.env.FRONTEND_ORIGIN_URL}`,`http://localhost:4000`];
  
  exports.CONSTANTS = {
    ACCOUNT_TYPE: ["user", "admin","artist"],
    ACCOUNT_TYPE_OBJ: {
        user: "user",
        admin: "admin",
        artist: "artist",
    },
    ACCOUNT_STATUS: ["verified", "unverified"], 
    ACCOUNT_STATUS_OBJ: {
      verified: "verified",
      unverified: "unverified",
    }, 
    IMAGE_FORMAT: [".jpg", ".jpeg", ".png", "application/jpeg", "application/jpg", "application/png", 'image/jpeg', 'image/jpg','image/png','application/octet-stream'], 
    BOOK_STATUS: ["active", "cancelled","paid", "accept", "reject", "completed"],
    BOOKING_EVENT_TYPE: ["fund","checkout"],
    TRANSACTION_DESC: ["Wallet creation", "funded wallet", "paid for order"],

    TEST_EMAIL: ["testuser@gmail.com", "testartist@gmail.com", "admin@gmail.com"],
    TEST_EMAIL_OBJ : {
      test_user: "testbrubbex@gmail.com",
      test_artist: "testartist@gmail.com",
      test_admin: "admin@gmail.com"
    },
    TEST_PASSWORD: "Bro0k-mu$!c0",
  };  