package com.beifen.edu.administration.domian;

import javax.persistence.*;
import java.util.Date;

//教师出差申请表
@Entity
@Table(name = "Edu112")
public class Edu112 {
    private Long Edu106_ID;//主键
    private Long Edu990_ID;//发起人用户ID
    private String userName;//用户名称
    private String teacherId;//教职工id
    private String teacherName;//教职工姓名
    private String destination;//目的地
    private String startTime;//开始时间
    private String endTime;//结束时间
    private String businessState;//状态

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "EDU112_ID")

    public Long getEdu106_ID() {
        return Edu106_ID;
    }

    public void setEdu106_ID(Long edu106_ID) {
        Edu106_ID = edu106_ID;
    }

    public Long getEdu990_ID() {
        return Edu990_ID;
    }

    public void setEdu990_ID(Long edu990_ID) {
        Edu990_ID = edu990_ID;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getBusinessState() {
        return businessState;
    }

    public void setBusinessState(String businessState) {
        this.businessState = businessState;
    }
}
