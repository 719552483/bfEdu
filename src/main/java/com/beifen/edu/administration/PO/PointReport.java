package com.beifen.edu.administration.PO;

import java.util.List;

public class PointReport {

  private Long edu500Id;//主键
  private String city;//所属市
  private String cityCode;//地级市代码
  private String country;//所属区县
  private Long pointCount;//教学任务点数量
  private String localName;//教学点名称
  private String localAddress;//详细地址
  private String remarks;//备注
  private List<PointDetailReport> pointDetailReportList;

  public Long getEdu500Id() {
    return edu500Id;
  }

  public void setEdu500Id(Long edu500Id) {
    this.edu500Id = edu500Id;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getCityCode() {
    return cityCode;
  }

  public void setCityCode(String cityCode) {
    this.cityCode = cityCode;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public Long getPointCount() {
    return pointCount;
  }

  public void setPointCount(Long pointCount) {
    this.pointCount = pointCount;
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

  public String getRemarks() {
    return remarks;
  }

  public void setRemarks(String remarks) {
    this.remarks = remarks;
  }

  public List<PointDetailReport> getPointDetailReportList() {
    return pointDetailReportList;
  }

  public void setPointDetailReportList(List<PointDetailReport> pointDetailReportList) {
    this.pointDetailReportList = pointDetailReportList;
  }
}
