package com.beifen.edu.administration.PO;


//查询学科是否录入成绩PO
public class CourseGetGradePO {
    private String term;//学年id
    private String sfsqks;//是否结课
    private String confirm;//是否确认成绩

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getSfsqks() {
        return sfsqks;
    }

    public void setSfsqks(String sfsqks) {
        this.sfsqks = sfsqks;
    }

    public String getConfirm() {
        return confirm;
    }

    public void setConfirm(String confirm) {
        this.confirm = confirm;
    }
}
