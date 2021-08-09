package com.beifen.edu.administration.domian;

import javax.persistence.*;

//修改补考成级申请表
@Entity
@Table(name = "Edu116")
public class Edu116 {
    private Long Edu116_ID;//主键
    private Long Edu990_ID;//发起人用户ID
    private String userName;//用户名称
    private String xnid;//学年id
    private String courseName;//课程名称
    private String className;//班级名称
    private String studentName;//学生姓名
    private String businessState;//状态
    private String businessExplain;//情况说明
    private String edu0051Id;
    private String exam_num;
    private String grade;



    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu116_ID")

    public Long getEdu116_ID() {
        return Edu116_ID;
    }

    public void setEdu116_ID(Long edu116_ID) {
        Edu116_ID = edu116_ID;
    }

    public Long getEdu990_ID() {
        return Edu990_ID;
    }

    public void setEdu990_ID(Long edu990_ID) {
        Edu990_ID = edu990_ID;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getBusinessState() {
        return businessState;
    }

    public void setBusinessState(String businessState) {
        this.businessState = businessState;
    }

    public String getBusinessExplain() {
        return businessExplain;
    }

    public void setBusinessExplain(String businessExplain) {
        this.businessExplain = businessExplain;
    }

    public String getEdu0051Id() {
        return edu0051Id;
    }

    public void setEdu0051Id(String edu0051Id) {
        this.edu0051Id = edu0051Id;
    }

    public String getExam_num() {
        return exam_num;
    }

    public void setExam_num(String exam_num) {
        this.exam_num = exam_num;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}
