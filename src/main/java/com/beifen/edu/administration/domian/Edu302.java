package com.beifen.edu.administration.domian;

import javax.persistence.*;

//教学班表行政班关联表
@Entity
@Table(name = "Edu302")
public class Edu302 {
    private Long Edu302_ID; //教学班ID
    private Long Edu301_ID; //教学班ID
    private Long Edu300_ID; //行政班ID
    private String xzbmc;  //行政班名称

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu302_ID")

    public Long getEdu302_ID() {
        return Edu302_ID;
    }

    public void setEdu302_ID(Long edu302_ID) {
        Edu302_ID = edu302_ID;
    }

    public Long getEdu301_ID() {
        return Edu301_ID;
    }

    public void setEdu301_ID(Long edu301_ID) {
        Edu301_ID = edu301_ID;
    }

    public Long getEdu300_ID() {
        return Edu300_ID;
    }

    public void setEdu300_ID(Long edu300_ID) {
        Edu300_ID = edu300_ID;
    }

    public String getXzbmc() {
        return xzbmc;
    }

    public void setXzbmc(String xzbmc) {
        this.xzbmc = xzbmc;
    }
}
