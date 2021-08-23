package com.beifen.edu.administration.domian;

import javax.persistence.*;

//审批类型总体表
@Entity
@Table(name = "Edu603")
public class Edu603 {

    private Long edu603Id;//审批流转主键
    private String businessType;//业务主键
    private Integer num;//节点数量
    private String sfqy;//是否启用
    private String businessName;//业务名称

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "edu603Id")

    public Long getEdu603Id() {
        return edu603Id;
    }

    public void setEdu603Id(Long edu603Id) {
        this.edu603Id = edu603Id;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public String getSfqy() {
        return sfqy;
    }

    public void setSfqy(String sfqy) {
        this.sfqy = sfqy;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
}
