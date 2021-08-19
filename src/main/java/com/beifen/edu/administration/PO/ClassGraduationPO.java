package com.beifen.edu.administration.PO;


import com.beifen.edu.administration.domian.Edu300;

public class ClassGraduationPO {
    private Long Edu300_ID;
    private String xzbmc;  //行政班名称
    private  String pyccmc;//培养层次名称
    private  String pyccbm;//培养层次编码
    private  String xbmc;//系部名称
    private  String xbbm;//系部编码
    private  String njbm;//年级编码
    private  String njmc;//年级名称
    private  String zybm;//专业编码
    private  String zymc;//专业名称
    private String batch;// 批次代码
    private String batchName; //批次名称
    private String own;
    private String pass;
    private String rate;

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

    public String getPyccmc() {
        return pyccmc;
    }

    public void setPyccmc(String pyccmc) {
        this.pyccmc = pyccmc;
    }

    public String getPyccbm() {
        return pyccbm;
    }

    public void setPyccbm(String pyccbm) {
        this.pyccbm = pyccbm;
    }

    public String getXbmc() {
        return xbmc;
    }

    public void setXbmc(String xbmc) {
        this.xbmc = xbmc;
    }

    public String getXbbm() {
        return xbbm;
    }

    public void setXbbm(String xbbm) {
        this.xbbm = xbbm;
    }

    public String getNjbm() {
        return njbm;
    }

    public void setNjbm(String njbm) {
        this.njbm = njbm;
    }

    public String getNjmc() {
        return njmc;
    }

    public void setNjmc(String njmc) {
        this.njmc = njmc;
    }

    public String getZybm() {
        return zybm;
    }

    public void setZybm(String zybm) {
        this.zybm = zybm;
    }

    public String getZymc() {
        return zymc;
    }

    public void setZymc(String zymc) {
        this.zymc = zymc;
    }


    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public String getBatchName() {
        return batchName;
    }

    public void setBatchName(String batchName) {
        this.batchName = batchName;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public String getRate() {
        return rate;
    }

    public void setRate(String rate) {
        this.rate = rate;
    }

    public String getOwn() {
        return own;
    }

    public void setOwn(String own) {
        this.own = own;
    }
}
