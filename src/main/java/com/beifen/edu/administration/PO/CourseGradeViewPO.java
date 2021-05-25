package com.beifen.edu.administration.PO;


//教务查询课表实体类

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "COURSE_GRADE_VIEW")
public class CourseGradeViewPO {

    private String id;
    private Long Edu300_ID;//行政班id
    private String courseName;//课程名称
    private String className;//行政班名称
    private String isExamCrouse;//是否为考试课
    private String xn;//学年
    private String xnid;//学年id
    private String isConfirm; //是否确认
    private String sfsqks;//是否已结课
    private String ls;//老师
    private String lsmc;//老师姓名
    private String EDU201_ID;

    public String getEDU201_ID() {
        return EDU201_ID;
    }

    public void setEDU201_ID(String EDU201_ID) {
        this.EDU201_ID = EDU201_ID;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getLs() {
        return ls;
    }

    public void setLs(String ls) {
        this.ls = ls;
    }

    public String getLsmc() {
        return lsmc;
    }

    public void setLsmc(String lsmc) {
        this.lsmc = lsmc;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Id
    public String getId() {
        return id;
    }

    public Long getEdu300_ID() {
        return Edu300_ID;
    }

    public void setEdu300_ID(Long edu300_ID) {
        Edu300_ID = edu300_ID;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getIsExamCrouse() {
        return isExamCrouse;
    }

    public void setIsExamCrouse(String isExamCrouse) {
        this.isExamCrouse = isExamCrouse;
    }

    public String getXn() {
        return xn;
    }

    public void setXn(String xn) {
        this.xn = xn;
    }

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
    }

    public String getIsConfirm() {
        return isConfirm;
    }

    public void setIsConfirm(String isConfirm) {
        this.isConfirm = isConfirm;
    }

    public String getSfsqks() {
        return sfsqks;
    }

    public void setSfsqks(String sfsqks) {
        this.sfsqks = sfsqks;
    }
}
