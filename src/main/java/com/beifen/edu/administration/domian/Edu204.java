package com.beifen.edu.administration.domian;

import javax.persistence.*;

//任务书与行政班关联表
@Entity
@Table(name = "Edu204")
public class Edu204 {
    private Long Edu204_ID;//主键ID
    private Long Edu201_ID; //任务书ID
    private Long  Edu300_ID;//行政班ID
    private String className;//行政班名称

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu204_ID")

    public Long getEdu204_ID() {
        return Edu204_ID;
    }

    public void setEdu204_ID(Long edu204_ID) {
        Edu204_ID = edu204_ID;
    }

    public Long getEdu201_ID() {
        return Edu201_ID;
    }

    public void setEdu201_ID(Long edu201_ID) {
        Edu201_ID = edu201_ID;
    }

    public Long getEdu300_ID() {
        return Edu300_ID;
    }

    public void setEdu300_ID(Long edu300_ID) {
        Edu300_ID = edu300_ID;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}
