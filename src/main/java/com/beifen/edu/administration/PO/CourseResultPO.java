package com.beifen.edu.administration.PO;

public class CourseResultPO {
    private Long Edu201_ID; //任务书ID
    private Long classId;  //教学班ID
    private	String classType; //班级类型
    private String className;  //班级名称
    private String kcmc;  //课程名称
    private String xn;//学年
    private String xnid;//学年ID
    private String ls;//老师
    private String lsmc;//老师姓名
    private String passingRate; //及格率

    public CourseResultPO(){}

    public CourseResultPO(Long edu201_ID, Long classId, String classType, String className, String kcmc, String xn, String xnid, String ls, String lsmc) {
        Edu201_ID = edu201_ID;
        this.classId = classId;
        this.classType = classType;
        this.className = className;
        this.kcmc = kcmc;
        this.xn = xn;
        this.xnid = xnid;
        this.ls = ls;
        this.lsmc = lsmc;
    }

    public Long getEdu201_ID() {
        return Edu201_ID;
    }

    public void setEdu201_ID(Long edu201_ID) {
        Edu201_ID = edu201_ID;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
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

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
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

    public String getPassingRate() {
        return passingRate;
    }

    public void setPassingRate(String passingRate) {
        this.passingRate = passingRate;
    }
}
