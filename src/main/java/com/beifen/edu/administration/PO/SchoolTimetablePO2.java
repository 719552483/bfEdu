package com.beifen.edu.administration.PO;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

//课程表查询PO
@Entity
@Table(name = "TEACHING_SCATTERED_VIEW")
public class SchoolTimetablePO2 {
    private String ID;
    private String xbmc;
    private String course_name;
    private String week;
    private String class_hours;
    private String COURSE_CONTENT;
    private String TEACHING_PLATFORM;
    private String LSMC;
    private String CLASS_NAME;
    private String xnid;
    private String EDU104;
    private String xn;


    @Id
    public String getID() {
        return ID;
    }
    public void setID(String ID) {
        this.ID = ID;
    }

    public String getXn() {
        return xn;
    }

    public void setXn(String xn) {
        this.xn = xn;
    }

    public String getXbmc() {
        return xbmc;
    }

    public void setXbmc(String xbmc) {
        this.xbmc = xbmc;
    }

    public String getCourse_name() {
        return course_name;
    }

    public void setCourse_name(String course_name) {
        this.course_name = course_name;
    }

    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public String getClass_hours() {
        return class_hours;
    }

    public void setClass_hours(String class_hours) {
        this.class_hours = class_hours;
    }

    public String getCOURSE_CONTENT() {
        return COURSE_CONTENT;
    }

    public void setCOURSE_CONTENT(String COURSE_CONTENT) {
        this.COURSE_CONTENT = COURSE_CONTENT;
    }

    public String getTEACHING_PLATFORM() {
        return TEACHING_PLATFORM;
    }

    public void setTEACHING_PLATFORM(String TEACHING_PLATFORM) {
        this.TEACHING_PLATFORM = TEACHING_PLATFORM;
    }

    public String getLSMC() {
        return LSMC;
    }

    public void setLSMC(String LSMC) {
        this.LSMC = LSMC;
    }

    public String getCLASS_NAME() {
        return CLASS_NAME;
    }

    public void setCLASS_NAME(String CLASS_NAME) {
        this.CLASS_NAME = CLASS_NAME;
    }

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
    }

    public String getEDU104() {
        return EDU104;
    }

    public void setEDU104(String EDU104) {
        this.EDU104 = EDU104;
    }
}
