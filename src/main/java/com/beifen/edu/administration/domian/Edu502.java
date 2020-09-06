package com.beifen.edu.administration.domian;

import javax.persistence.*;

//教学任务点实体类
@Entity
@Table(name = "Edu502")
public class Edu502 {

    private Long Edu502_ID;//主键
    private Long Edu500_ID;//教学点主键
    private Long edu501Id;//教学任务点主键
    private String assetsType;//物资类型
    private String assetsName;//物资名称
    private Integer assetsNum;//数量

    public Edu502() {}

    public Edu502(String assetsType,String assetsName,Long assetsNum) {
        this.assetsType = assetsType;
        this.assetsName = assetsName;
        this.assetsNum = Integer.parseInt(assetsNum.toString());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu502_ID")

    public Long getEdu502_ID() {
        return Edu502_ID;
    }

    public void setEdu502_ID(Long edu502_ID) {
        Edu502_ID = edu502_ID;
    }

    public Long getEdu500_ID() {
        return Edu500_ID;
    }

    public void setEdu500_ID(Long edu500_ID) {
        Edu500_ID = edu500_ID;
    }

    public Long getEdu501Id() {
        return edu501Id;
    }

    public void setEdu501Id(Long edu501Id) {
        this.edu501Id = edu501Id;
    }

    public String getAssetsType() {
        return assetsType;
    }

    public void setAssetsType(String assetsType) {
        this.assetsType = assetsType;
    }

    public String getAssetsName() {
        return assetsName;
    }

    public void setAssetsName(String assetsName) {
        this.assetsName = assetsName;
    }

    public Integer getAssetsNum() {
        return assetsNum;
    }

    public void setAssetsNum(Integer assetsNum) {
        this.assetsNum = assetsNum;
    }
}
