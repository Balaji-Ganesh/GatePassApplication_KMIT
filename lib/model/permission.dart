class Permission {
  String? RollNumber;
  String? StudentName;
  int? Type;
  int? Year;
  String? section;
  String? GrantedBy;
  String? CreatedAt;

  Permission(
  {this.RollNumber,
  this.StudentName,
  this.Type,
  this.Year,
  this.section,
  this.GrantedBy,
  this.CreatedAt,


  Permission.fromJson(Map<String, dynamic> json) {
  RollNumber = json['RollNumber'];
  StudentName = json['StudentName'];
  Type = json['Type'];
  Year = json['Year'];
  section = json['section'];
  GrantedBy = json['GrantedBy'];
  CreatedAt = json['CreatedAt'];

  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['RollNumber'] = this.RollNumber;
    data['StudentName'] = this.StudentName;
    data['Type'] = this.Type;
    data['Year'] = this.Year;
    data['section'] = this.section;
    data['GrantedBy'] = this.GrantedBy;
    data['CreatedAt'] = this.CreatedAt;

    return data;
  }
}

class Student {
  String? RollNumber;
  String? StudentName;
  int? Year;
  String? section;

  Student(
      {this.RollNumber,
        this.StudentName,
        this.Year,
        this.section,});

  Student.fromJson(Map<String, dynamic> json) {
    RollNumber = json['RollNumber'];
    StudentName = json['StudentName'];
    Year = json['Year'];
    section = json['section'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['RollNumber'] = this.RollNumber;
    data['StudentName'] = this.StudentName;
    data['Year'] = this.Year;
    data['section'] = this.section;
    return data;
  }
}
