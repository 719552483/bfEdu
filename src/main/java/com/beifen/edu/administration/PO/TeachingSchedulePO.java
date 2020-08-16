package com.beifen.edu.administration.PO;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

//排课计划视图PO
@Entity
@Table(name = "SCHEDULE_COMPLETED_VIEW")
public class TeachingSchedulePO {
    private String pyjhcc;
    private String pyjhxb;
    private String pyjhnj;
    private String pyjhzy;
    private String kcxz;
    private String kcxzid;
    private String kcmc;
    private String jxbmc;
    private String jxbid;
    private String ls;
    private String zyls;
    private String pkbm;
    private String kkbm;
    private String EDU202_ID;
    private String id;


    public String getPyjhcc() {
        return pyjhcc;
    }

    public void setPyjhcc(String pyjhcc) {
        this.pyjhcc = pyjhcc;
    }

    public String getPyjhxb() {
        return pyjhxb;
    }

    public void setPyjhxb(String pyjhxb) {
        this.pyjhxb = pyjhxb;
    }

    public String getPyjhnj() {
        return pyjhnj;
    }

    public void setPyjhnj(String pyjhnj) {
        this.pyjhnj = pyjhnj;
    }

    public String getPyjhzy() {
        return pyjhzy;
    }

    public void setPyjhzy(String pyjhzy) {
        this.pyjhzy = pyjhzy;
    }

    public String getKcxz() {
        return kcxz;
    }

    public void setKcxz(String kcxz) {
        this.kcxz = kcxz;
    }

    public String getKcmc() {
        return kcmc;
    }

    public void setKcmc(String kcmc) {
        this.kcmc = kcmc;
    }

    public String getJxbmc() {
        return jxbmc;
    }

    public void setJxbmc(String jxbmc) {
        this.jxbmc = jxbmc;
    }

    public String getLs() {
        return ls;
    }

    public void setLs(String ls) {
        this.ls = ls;
    }

    public String getZyls() {
        return zyls;
    }

    public void setZyls(String zyls) {
        this.zyls = zyls;
    }

    public String getPkbm() {
        return pkbm;
    }

    public void setPkbm(String pkbm) {
        this.pkbm = pkbm;
    }

    public String getKkbm() {
        return kkbm;
    }

    public void setKkbm(String kkbm) {
        this.kkbm = kkbm;
    }

    public String getEDU202_ID() {
        return EDU202_ID;
    }

    public void setEDU202_ID(String EDU202_ID) {
        this.EDU202_ID = EDU202_ID;
    }

    public String getKcxzid() {
        return kcxzid;
    }

    public void setKcxzid(String kcxzid) {
        this.kcxzid = kcxzid;
    }

    public String getJxbid() {
        return jxbid;
    }

    public void setJxbid(String jxbid) {
        this.jxbid = jxbid;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Id
    public String getId() {
        return id;
    }
}
