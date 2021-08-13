package com.beifen.edu.administration.PO;

import java.io.Serializable;

public class Edu005PO implements Serializable {
    private Long Edu005_ID;//主键
    private String className;//行政班名称
    private String StudentName;//学生姓名
    private String studentCode;//学生学号
    private String sum;//总成绩(导出时使用)
    private String avg;//总成绩(导出时使用)

    public Long getEdu005_ID() {
        return Edu005_ID;
    }

    public void setEdu005_ID(Long edu005_ID) {
        Edu005_ID = edu005_ID;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getStudentName() {
        return StudentName;
    }

    public void setStudentName(String studentName) {
        StudentName = studentName;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getSum() {
        return sum;
    }

    public void setSum(String sum) {
        this.sum = sum;
    }

    public String getAvg() {
        return avg;
    }

    public void setAvg(String avg) {
        this.avg = avg;
    }

    public Edu005PO() {
    }

    public Edu005PO(Long edu005_ID, String className, String studentName, String studentCode, String sum, String avg) {
        Edu005_ID = edu005_ID;
        this.className = className;
        StudentName = studentName;
        this.studentCode = studentCode;
        this.sum = sum;
        this.avg = avg;
    }
}
