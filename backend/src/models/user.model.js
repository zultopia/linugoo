class User {
  constructor(id, username, email, name, phone, password, role = "Siswa", profileImage = null) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.password = password; 
    this.role = role;
    this.profileImage = profileImage; 
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

module.exports = User;