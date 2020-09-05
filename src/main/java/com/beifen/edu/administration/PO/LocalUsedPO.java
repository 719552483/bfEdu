package com.beifen.edu.administration.PO;


public class LocalUsedPO {
    private Long edu501Id;//教学任务点id
    private String city;//所属市
    private String cityCode;//地级市代码
    private String localName;//教学点名称
    private String localAddress;//详细地址
    private String capacity;//容量
    private String pointName;//任务点名称
    private String remarks;
    private String siteUtilization;//场地使用率
    private String academicYearId;//学年id

    public LocalUsedPO(){}

    public LocalUsedPO(Long edu501Id,String city, String cityCode, String localName, String localAddress, String capacity, String pointName,String remarks) {
        this.edu501Id = edu501Id;
        this.city = city;
        this.cityCode = cityCode;
        this.localName = localName;
        this.localAddress = localAddress;
        this.capacity = capacity;
        this.pointName = pointName;
        this.remarks = remarks;
    }

    public Long getEdu501Id() {
        return edu501Id;
    }

    public void setEdu501Id(Long edu501Id) {
        this.edu501Id = edu501Id;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getCityCode() {
        return cityCode;
    }

    public void setCityCode(String cityCode) {
        this.cityCode = cityCode;
    }

    public String getLocalName() {
        return localName;
    }

    public void setLocalName(String localName) {
        this.localName = localName;
    }

    public String getLocalAddress() {
        return localAddress;
    }

    public void setLocalAddress(String localAddress) {
        this.localAddress = localAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCapacity() {
        return capacity;
    }

    public void setCapacity(String capacity) {
        this.capacity = capacity;
    }

    public String getPointName() {
        return pointName;
    }

    public void setPointName(String pointName) {
        this.pointName = pointName;
    }

    public String getSiteUtilization() {
        return siteUtilization;
    }

    public void setSiteUtilization(String siteUtilization) {
        this.siteUtilization = siteUtilization;
    }

    public String getAcademicYearId() {
        return academicYearId;
    }

    public void setAcademicYearId(String academicYearId) {
        this.academicYearId = academicYearId;
    }
}
