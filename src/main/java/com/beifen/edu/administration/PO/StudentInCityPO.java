package com.beifen.edu.administration.PO;

import java.io.Serializable;

//教学点包含学生人数实体类
public class StudentInCityPO implements Serializable {
    private String city;
    private String studentCount;

    public StudentInCityPO() {}


    public StudentInCityPO(String city, String studentCount) {
        this.city = city;
        this.studentCount = studentCount;
    }

    public StudentInCityPO(String city, Long studentCount) {
        this.city = city;
        this.studentCount = studentCount.toString();
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(String studentCount) {
        this.studentCount = studentCount;
    }
}