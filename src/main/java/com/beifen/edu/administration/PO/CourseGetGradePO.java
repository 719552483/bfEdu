package com.beifen.edu.administration.PO;


//查询学科是否录入成绩PO
public class CourseGetGradePO {
    private String trem;//学年id
    private String sfsqks;//是否结课
    private String confirm;//是否确认成绩
    private String teacherId;//教师id

    public String getTrem() {
        return trem;
    }

    public void setTrem(String trem) {
        this.trem = trem;
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

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }
}
