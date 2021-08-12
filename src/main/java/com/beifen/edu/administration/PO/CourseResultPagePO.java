package com.beifen.edu.administration.PO;

public class CourseResultPagePO {
    private String xnid;//学年ID
    private String ls;//老师
    private String className;  //班级名称
    private String kcmc;  //课程名称
    private  String edu103;//培养层次id
    private  String edu104;//系部id
    private  String edu105;//年级id
    private  String edu106;//专业id
    private Integer pageNum;
    private Integer pageSize;

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

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getEdu103() {
        return edu103;
    }

    public void setEdu103(String edu103) {
        this.edu103 = edu103;
    }

    public String getEdu104() {
        return edu104;
    }

    public void setEdu104(String edu104) {
        this.edu104 = edu104;
    }

    public String getEdu105() {
        return edu105;
    }

    public void setEdu105(String edu105) {
        this.edu105 = edu105;
    }

    public String getEdu106() {
        return edu106;
    }

    public void setEdu106(String edu106) {
        this.edu106 = edu106;
    }
}
