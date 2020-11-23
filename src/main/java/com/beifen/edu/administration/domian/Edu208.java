package com.beifen.edu.administration.domian;

import javax.persistence.*;

//任务书与行政班关联表
@Entity
@Table(name = "Edu208")
public class Edu208 {
    private Long Edu208_ID;//主键ID
    private Long Edu201_ID; //任务书ID
    private Long  Edu203_ID;//课节表ID
    private Long  Edu001_ID;//学生ID
    private String onCheckFlag;//考勤标识

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu208_ID")

    public Long getEdu208_ID() {
        return Edu208_ID;
    }

    public void setEdu208_ID(Long edu208_ID) {
        Edu208_ID = edu208_ID;
    }

    public Long getEdu201_ID() {
        return Edu201_ID;
    }

    public void setEdu201_ID(Long edu201_ID) {
        Edu201_ID = edu201_ID;
    }

    public Long getEdu203_ID() {
        return Edu203_ID;
    }

    public void setEdu203_ID(Long edu203_ID) {
        Edu203_ID = edu203_ID;
    }

    public Long getEdu001_ID() {
        return Edu001_ID;
    }

    public void setEdu001_ID(Long edu001_ID) {
        Edu001_ID = edu001_ID;
    }

    public String getOnCheckFlag() {
        return onCheckFlag;
    }

    public void setOnCheckFlag(String onCheckFlag) {
        this.onCheckFlag = onCheckFlag;
    }
}
