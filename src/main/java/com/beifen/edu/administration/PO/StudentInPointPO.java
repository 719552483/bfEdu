package com.beifen.edu.administration.PO;

//教学点包含学生人数实体类
public class StudentInPointPO {
    private String edu501_Id;
    private String localName;
    private Long studentCount;

    public StudentInPointPO() {}


    public StudentInPointPO(String edu501_Id, String localName, Long studentCount) {
        this.edu501_Id = edu501_Id;
        this.localName = localName;
        this.studentCount = studentCount;
    }

    public String getEdu501_Id() {
        return edu501_Id;
    }

    public void setEdu501_Id(String edu501_Id) {
        this.edu501_Id = edu501_Id;
    }

    public String getLocalName() {
        return localName;
    }

    public void setLocalName(String localName) {
        this.localName = localName;
    }

    public Long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Long studentCount) {
        this.studentCount = studentCount;
    }
}