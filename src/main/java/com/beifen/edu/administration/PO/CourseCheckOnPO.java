package com.beifen.edu.administration.PO;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "COURSE_CHECKON_VIEW")
public class CourseCheckOnPO {
    private String edu203_id; //课节表主键
    private String edu201_id; //任务书主键
    private String kcmc; //课程名称
    private String xnid; //学年id
    private String xn; //学年名称
    private String week; //第几周
    private String xqid; //星期id
    private String xqmc; //星期名称
    private String kjid; //课节id
    private String kjmc; //课节名称
    private String edu101_id; //教师表主键
    private String teacher_name; //教师名称
    private String teacher_type; //教师类型
    private String sflrkqqk; //是否录入考勤情况

    @Id
    public String getEdu203_id() {
        return edu203_id;
    }

    public void setEdu203_id(String edu203_id) {
        this.edu203_id = edu203_id;
    }

    public String getEdu201_id() {
        return edu201_id;
    }

    public void setEdu201_id(String edu201_id) {
        this.edu201_id = edu201_id;
    }

    public String getKcmc() {
        return kcmc;
    }

    public void setKcmc(String kcmc) {
        this.kcmc = kcmc;
    }

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
    }

    public String getXn() {
        return xn;
    }

    public void setXn(String xn) {
        this.xn = xn;
    }

    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public String getXqid() {
        return xqid;
    }

    public void setXqid(String xqid) {
        this.xqid = xqid;
    }

    public String getXqmc() {
        return xqmc;
    }

    public void setXqmc(String xqmc) {
        this.xqmc = xqmc;
    }

    public String getKjid() {
        return kjid;
    }

    public void setKjid(String kjid) {
        this.kjid = kjid;
    }

    public String getKjmc() {
        return kjmc;
    }

    public void setKjmc(String kjmc) {
        this.kjmc = kjmc;
    }

    public String getEdu101_id() {
        return edu101_id;
    }

    public void setEdu101_id(String edu101_id) {
        this.edu101_id = edu101_id;
    }

    public String getTeacher_name() {
        return teacher_name;
    }

    public void setTeacher_name(String teacher_name) {
        this.teacher_name = teacher_name;
    }

    public String getTeacher_type() {
        return teacher_type;
    }

    public void setTeacher_type(String teacher_type) {
        this.teacher_type = teacher_type;
    }

    public String getSflrkqqk() {
        return sflrkqqk;
    }

    public void setSflrkqqk(String sflrkqqk) {
        this.sflrkqqk = sflrkqqk;
    }
}
