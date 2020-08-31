package com.beifen.edu.administration.domian;

import javax.persistence.*;

//教学任务点实体类
@Entity
@Table(name = "Edu501")
public class Edu501 {

    private Long Edu501Id;//主键
    private Long edu500Id;//教学点主键
    private String Capacity;//容量
    private String pointName;//任务点名称
    private String remarks;//备注

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu501_ID")

    public Long getEdu501Id() {
        return Edu501Id;
    }

    public void setEdu501Id(Long edu501Id) {
        Edu501Id = edu501Id;
    }

    public Long getEdu500Id() {
        return edu500Id;
    }

    public void setEdu500Id(Long edu500Id) {
        this.edu500Id = edu500Id;
    }

    public String getCapacity() {
        return Capacity;
    }

    public void setCapacity(String capacity) {
        Capacity = capacity;
    }

    public String getPointName() {
        return pointName;
    }

    public void setPointName(String pointName) {
        this.pointName = pointName;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
