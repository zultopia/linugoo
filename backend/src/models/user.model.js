class User {
    constructor(id, username, email, name, phone, password) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.name = name;
      this.phone = phone;
      this.password = password; // Harus sudah di-hash sebelum disimpan
    }
}
  
module.exports = User;  