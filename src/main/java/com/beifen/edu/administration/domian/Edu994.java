package com.beifen.edu.administration.domian;

import javax.persistence.*;

@Entity
@Table(name = "Edu994")
public class Edu994 {
    private Long Edu994_ID;
    private Long Edu990_ID;
    private String Edu104_ID;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu994_ID")

    public Long getEdu994_ID() {
        return Edu994_ID;
    }

    public void setEdu994_ID(Long edu994_ID) {
        Edu994_ID = edu994_ID;
    }

    public Long getEdu990_ID() {
        return Edu990_ID;
    }

    public void setEdu990_ID(Long edu990_ID) {
        Edu990_ID = edu990_ID;
    }

    public String getEdu104_ID() {
        return Edu104_ID;
    }

    public void setEdu104_ID(String edu104_ID) {
        Edu104_ID = edu104_ID;
    }
}
