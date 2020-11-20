package com.beifen.edu.administration.PO;

import java.io.Serializable;

public class BigDataPeriodTypePO implements Serializable {
    private String edu104Id;//二级学院ID
    private String departmentName;//二级学院名称
    private String zxs;//总学时
    private String llxs;//理论学时
    private String sjxs;//实践学时
    private String jzxs;//集中学时
    private String fsxs;//分散学时

    public BigDataPeriodTypePO() {}

    public BigDataPeriodTypePO(String edu104Id, String departmentName, String zxs, String llxs, String sjxs, String jzxs, String fsxs) {
        this.edu104Id = edu104Id;
        this.departmentName = departmentName;
        this.zxs = zxs;
        this.llxs = llxs;
        this.sjxs = sjxs;
        this.jzxs = jzxs;
        this.fsxs = fsxs;
    }

    public BigDataPeriodTypePO(String zxs, String llxs, String sjxs, String jzxs, String fsxs) {
        this.zxs = zxs;
        this.llxs = llxs;
        this.sjxs = sjxs;
        this.jzxs = jzxs;
        this.fsxs = fsxs;
    }

    public String getEdu104Id() {
        return edu104Id;
    }

    public void setEdu104Id(String edu104Id) {
        this.edu104Id = edu104Id;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getZxs() {
        return zxs;
    }

    public void setZxs(String zxs) {
        this.zxs = zxs;
    }

    public String getLlxs() {
        return llxs;
    }

    public void setLlxs(String llxs) {
        this.llxs = llxs;
    }

    public String getSjxs() {
        return sjxs;
    }

    public void setSjxs(String sjxs) {
        this.sjxs = sjxs;
    }

    public String getJzxs() {
        return jzxs;
    }

    public void setJzxs(String jzxs) {
        this.jzxs = jzxs;
    }

    public String getFsxs() {
        return fsxs;
    }

    public void setFsxs(String fsxs) {
        this.fsxs = fsxs;
    }
}
