package com.beifen.edu.administration.PO;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

//排课计划视图PO
@Entity
@Table(name = "SCHEDULE_COMPLETED_VIEW")
public class TeachingSchedulePO {
    private String level;
    private String department;
    private String grade;
    private String major;
    private String teachingCode;
    private String courseType;
    private String pyjhcc;
    private String pyjhxb;
    private String pyjhnj;
    private String pyjhzy;
    private String kcxz;
    private String kcmc;
    private String jxbmc;
    private String ls;
    private String zyls;
    private String pkbm;
    private String kkbm;
    private String EDU202_ID;


    @Id//视图空ID 无实际意义

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getTeachingCode() {
        return teachingCode;
    }

    public void setTeachingCode(String teachingCode) {
        this.teachingCode = teachingCode;
    }

    public String getCourseType() {
        return courseType;
    }

    public void setCourseType(String courseType) {
        this.courseType = courseType;
    }

    public String getPyjhcc() {
        return pyjhcc;
    }

    public void setPyjhcc(String pyjhcc) {
        this.pyjhcc = pyjhcc;
    }

    public String getPyjhxb() {
        return pyjhxb;
    }

    public void setPyjhxb(String pyjhxb) {
        this.pyjhxb = pyjhxb;
    }

    public String getPyjhnj() {
        return pyjhnj;
    }

    public void setPyjhnj(String pyjhnj) {
        this.pyjhnj = pyjhnj;
    }

    public String getPyjhzy() {
        return pyjhzy;
    }

    public void setPyjhzy(String pyjhzy) {
        this.pyjhzy = pyjhzy;
    }

    public String getKcxz() {
        return kcxz;
    }

    public void setKcxz(String kcxz) {
        this.kcxz = kcxz;
    }

    public String getKcmc() {
        return kcmc;
    }

    public void setKcmc(String kcmc) {
        this.kcmc = kcmc;
    }

    public String getJxbmc() {
        return jxbmc;
    }

    public void setJxbmc(String jxbmc) {
        this.jxbmc = jxbmc;
    }

    public String getLs() {
        return ls;
    }

    public void setLs(String ls) {
        this.ls = ls;
    }

    public String getZyls() {
        return zyls;
    }

    public void setZyls(String zyls) {
        this.zyls = zyls;
    }

    public String getPkbm() {
        return pkbm;
    }

    public void setPkbm(String pkbm) {
        this.pkbm = pkbm;
    }

    public String getKkbm() {
        return kkbm;
    }

    public void setKkbm(String kkbm) {
        this.kkbm = kkbm;
    }

    public String getEDU202_ID() {
        return EDU202_ID;
    }

    public void setEDU202_ID(String EDU202_ID) {
        this.EDU202_ID = EDU202_ID;
    }


}
