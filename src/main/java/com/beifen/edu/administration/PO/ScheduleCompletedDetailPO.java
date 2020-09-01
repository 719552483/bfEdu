package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu201;
import com.beifen.edu.administration.domian.Edu203;

import java.util.List;

public class ScheduleCompletedDetailPO extends Edu201 {
    private Long Edu202_ID;
    private String ksz; // 开始周
    private String jsz; // 结束周
    private String skddmc; // 授课地点名称
    private String skddid; // 授课地点ID
    private List<Edu203> classPeriodList;//课节集合

    public Long getEdu202_ID() {
        return Edu202_ID;
    }

    public void setEdu202_ID(Long edu202_ID) {
        Edu202_ID = edu202_ID;
    }

    public String getKsz() {
        return ksz;
    }

    public void setKsz(String ksz) {
        this.ksz = ksz;
    }

    public String getJsz() {
        return jsz;
    }

    public void setJsz(String jsz) {
        this.jsz = jsz;
    }

    public String getSkddmc() {
        return skddmc;
    }

    public void setSkddmc(String skddmc) {
        this.skddmc = skddmc;
    }

    public String getSkddid() {
        return skddid;
    }

    public void setSkddid(String skddid) {
        this.skddid = skddid;
    }

    public List<Edu203> getClassPeriodList() {
        return classPeriodList;
    }

    public void setClassPeriodList(List<Edu203> classPeriodList) {
        this.classPeriodList = classPeriodList;
    }
}
