class Permission {
  String? RollNumber;
  String? StudentName;
  int? Type;
  int? Year;
  String? GrantedBy;
  String? CreatedAt;
  String? studentPicture;

  Permission(
  {
    this.RollNumber,
    this.StudentName,
    this.Type,
    this.Year,
    this.GrantedBy,
    this.CreatedAt
  });


  Permission.fromJson(Map<String, dynamic> json) {
    RollNumber = json['RollNumber'];
    StudentName = json['StudentName'];
    Type = json['Type'];
    Year = json['Year'];
    GrantedBy = json['GrantedBy'];
    CreatedAt = json['CreatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['RollNumber'] = this.RollNumber;
    data['StudentName'] = this.StudentName;
    data['Type'] = this.Type;
    data['Year'] = this.Year;
    data['GrantedBy'] = this.GrantedBy;
    data['CreatedAt'] = this.CreatedAt;

    return data;
  }
}