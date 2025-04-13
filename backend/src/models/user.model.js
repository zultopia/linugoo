class User {
  constructor(id, username, email, name, phone, password, role = "Siswa") {
    this.id = id;
    this.username = username;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.password = password; 
    this.role = role; 
  }
}

module.exports = User;