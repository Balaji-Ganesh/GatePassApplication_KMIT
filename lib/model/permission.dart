class Permission {
  String? rollNo;
  String? name;
  int? permissionStatus;
  int? year;
  String? section;
  String? grantedBy;
  String? studentPicture;

  Permission(
      {this.rollNo,
        this.name,
        this.permissionStatus,
        this.year,
        this.section,
        this.grantedBy,
        this.studentPicture});

  Permission.fromJson(Map<String, dynamic> json) {
    rollNo = json['rollNo'];
    name = json['name'];
    permissionStatus = json['permissionStatus'];
    year = json['year'];
    section = json['section'];
    grantedBy = json['grantedBy'];
    studentPicture = json['studentPicture'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['rollNo'] = this.rollNo;
    data['name'] = this.name;
    data['permissionStatus'] = this.permissionStatus;
    data['year'] = this.year;
    data['section'] = this.section;
    data['grantedBy'] = this.grantedBy;
    data['studentPicture'] = this.studentPicture;
    return data;
  }
}
