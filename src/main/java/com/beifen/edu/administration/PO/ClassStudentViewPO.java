package com.beifen.edu.administration.PO;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

//行政班包含学生视图PO
@Entity
@Table(name = "CLASS_STUDENT_VIEW")
public class ClassStudentViewPO {
    private String id;
    private String edu301_id;
    private String edu001_id;
    private String className;
    private String gradation;
    private String pyccmc;
    private String department;
    private String szxbmc;
    private String grade;
    private String njmc;
    private String major;
    private String zymc;
    private String sex;
    private String name;
    private String userKey;


    public void setId(String id) {
        this.id = id;
    }

    @Id
    public String getId() {
        return id;
    }

    public String getEdu301_id() {
        return edu301_id;
    }

    public void setEdu301_id(String edu301_id) {
        this.edu301_id = edu301_id;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getEdu001_id() {
        return edu001_id;
    }

    public void setEdu001_id(String edu001_id) {
        this.edu001_id = edu001_id;
    }

    public String getGradation() {
        return gradation;
    }

    public void setGradation(String gradation) {
        this.gradation = gradation;
    }

    public String getPyccmc() {
        return pyccmc;
    }

    public void setPyccmc(String pyccmc) {
        this.pyccmc = pyccmc;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSzxbmc() {
        return szxbmc;
    }

    public void setSzxbmc(String szxbmc) {
        this.szxbmc = szxbmc;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getNjmc() {
        return njmc;
    }

    public void setNjmc(String njmc) {
        this.njmc = njmc;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getZymc() {
        return zymc;
    }

    public void setZymc(String zymc) {
        this.zymc = zymc;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserKey() {
        return userKey;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }
}
