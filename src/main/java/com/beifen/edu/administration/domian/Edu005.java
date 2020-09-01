package com.beifen.edu.administration.domian;

import javax.persistence.*;

//学生评价表
@Entity
@Table(name="Edu005")
public class Edu005 {
    private Long Edu005_ID;//主键
    private Long Edu001_ID;//学生id
    private Long Edu201_ID;//任务书id
    private Long Edu300_ID;//行政班id
    private Long Edu101_ID;//录入人ID
    private String courseName;//课程名称
    private String className;//行政班名称
    private String StudentName;//学生姓名
    private String studentCode;//学生学号
    private String gradeEnter;//录入人姓名
    private String entryDate;//录入日期
    private String isExamCrouse;//是否为考试课
    private String grade;//成绩
    private String credit;//学分

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu005_ID")


    public Long getEdu005_ID() {
        return Edu005_ID;
    }

    public void setEdu005_ID(Long edu005_ID) {
        Edu005_ID = edu005_ID;
    }

    public Long getEdu001_ID() {
        return Edu001_ID;
    }

    public void setEdu001_ID(Long edu001_ID) {
        Edu001_ID = edu001_ID;
    }

    public Long getEdu201_ID() {
        return Edu201_ID;
    }

    public void setEdu201_ID(Long edu201_ID) {
        Edu201_ID = edu201_ID;
    }

    public Long getEdu300_ID() {
        return Edu300_ID;
    }

    public void setEdu300_ID(Long edu300_ID) {
        Edu300_ID = edu300_ID;
    }

    public Long getEdu101_ID() {
        return Edu101_ID;
    }

    public void setEdu101_ID(Long edu101_ID) {
        Edu101_ID = edu101_ID;
    }

    public String getGradeEnter() {
        return gradeEnter;
    }

    public void setGradeEnter(String gradeEnter) {
        this.gradeEnter = gradeEnter;
    }

    public String getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(String entryDate) {
        this.entryDate = entryDate;
    }

    public String getIsExamCrouse() {
        return isExamCrouse;
    }

    public void setIsExamCrouse(String isExamCrouse) {
        this.isExamCrouse = isExamCrouse;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getStudentName() {
        return StudentName;
    }

    public void setStudentName(String studentName) {
        StudentName = studentName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getCredit() {
        return credit;
    }

    public void setCredit(String credit) {
        this.credit = credit;
    }
}
