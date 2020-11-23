package com.beifen.edu.administration.PO;

public class CheckOnDetailPO {
    private String kcmc; //课程名称
    private String xn; //学年名称
    private String week; //第几周
    private String xqmc; //星期名称
    private String kjmc; //课节名称
    private String teacher_name; //教师名称
    private String StudentName; //学生姓名
    private String StudentCode; //学生学号
    private String className; //班级名称
    private String onCheckFlag;//考勤标识

    public CheckOnDetailPO() {}

    public CheckOnDetailPO(String kcmc, String xn, String week, String xqmc, String kjmc, String teacher_name, String studentName, String studentCode, String className, String onCheckFlag) {
        this.kcmc = kcmc;
        this.xn = xn;
        this.week = week;
        this.xqmc = xqmc;
        this.kjmc = kjmc;
        this.teacher_name = teacher_name;
        StudentName = studentName;
        StudentCode = studentCode;
        this.className = className;
        this.onCheckFlag = onCheckFlag;
    }

    public String getKcmc() {
        return kcmc;
    }

    public void setKcmc(String kcmc) {
        this.kcmc = kcmc;
    }

    public String getXn() {
        return xn;
    }

    public void setXn(String xn) {
        this.xn = xn;
    }

    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public String getXqmc() {
        return xqmc;
    }

    public void setXqmc(String xqmc) {
        this.xqmc = xqmc;
    }

    public String getKjmc() {
        return kjmc;
    }

    public void setKjmc(String kjmc) {
        this.kjmc = kjmc;
    }

    public String getTeacher_name() {
        return teacher_name;
    }

    public void setTeacher_name(String teacher_name) {
        this.teacher_name = teacher_name;
    }

    public String getStudentName() {
        return StudentName;
    }

    public void setStudentName(String studentName) {
        StudentName = studentName;
    }

    public String getStudentCode() {
        return StudentCode;
    }

    public void setStudentCode(String studentCode) {
        StudentCode = studentCode;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getOnCheckFlag() {
        return onCheckFlag;
    }

    public void setOnCheckFlag(String onCheckFlag) {
        this.onCheckFlag = onCheckFlag;
    }
}
