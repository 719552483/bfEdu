package com.beifen.edu.administration.PO;


//教务查询课表实体类

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "COURSE_MAKE_UP_VIEW")
public class MakeUpGradePO {

    private String courseName;//课程名称
    private String className;//行政班名称
    private String xn;//学年
    private String lsmc;//老师姓名
    private String sum;//需要补考人数
    private String pass;//通过人数
    private String xnid;
    private String id;

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getXn() {
        return xn;
    }

    public void setXn(String xn) {
        this.xn = xn;
    }

    public String getLsmc() {
        return lsmc;
    }

    public void setLsmc(String lsmc) {
        this.lsmc = lsmc;
    }

    public String getSum() {
        return sum;
    }

    public void setSum(String sum) {
        this.sum = sum;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Id
    public String getId() {
        return id;
    }
}
