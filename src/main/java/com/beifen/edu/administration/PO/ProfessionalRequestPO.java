package com.beifen.edu.administration.PO;

//授课成果查询参数
public class ProfessionalRequestPO {
    private String xnid;//学年ID
    private String edu103Id;//层次ID
    private String edu104Id;//学院ID
    private String edu105Id;//年级ID
    private String edu106Id;//专业ID
    private String batch;//批次
    private String courseName;//课程名称

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
    }

    public String getEdu103Id() {
        return edu103Id;
    }

    public void setEdu103Id(String edu103Id) {
        this.edu103Id = edu103Id;
    }

    public String getEdu104Id() {
        return edu104Id;
    }

    public void setEdu104Id(String edu104Id) {
        this.edu104Id = edu104Id;
    }

    public String getEdu105Id() {
        return edu105Id;
    }

    public void setEdu105Id(String edu105Id) {
        this.edu105Id = edu105Id;
    }

    public String getEdu106Id() {
        return edu106Id;
    }

    public void setEdu106Id(String edu106Id) {
        this.edu106Id = edu106Id;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
}
