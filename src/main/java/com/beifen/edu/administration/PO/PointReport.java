package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu502;

import java.util.List;

public class PointReport {

  private Long edu500Id;//主键
  private String city;//所属市
  private String cityCode;//地级市代码
  private String country;//所属区县
  private Long pointCount;//教学任务点数量
  private String localName;//教学点名称
  private String localAddress;//详细地址
  private String pointRemarks;//教学点备注
  //
  private String Capacity;//容量
  private String pointName;//任务点名称
  private String remarks;//备注
  private String countUsed;//排课课节数量
  private String complete;//已完成数量
  private String unfinished;//未完成数量
  private String xn;//学年
  private List<Edu502> edu502List;

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

  public String getPointRemarks() {
    return pointRemarks;
  }

  public void setPointRemarks(String pointRemarks) {
    this.pointRemarks = pointRemarks;
  }

  public String getCapacity() {
    return Capacity;
  }

  public void setCapacity(String capacity) {
    Capacity = capacity;
  }

  public String getPointName() {
    return pointName;
  }

  public void setPointName(String pointName) {
    this.pointName = pointName;
  }

  public String getRemarks() {
    return remarks;
  }

  public void setRemarks(String remarks) {
    this.remarks = remarks;
  }

  public String getCountUsed() {
    return countUsed;
  }

  public void setCountUsed(String countUsed) {
    this.countUsed = countUsed;
  }

  public String getComplete() {
    return complete;
  }

  public void setComplete(String complete) {
    this.complete = complete;
  }

  public String getUnfinished() {
    return unfinished;
  }

  public void setUnfinished(String unfinished) {
    this.unfinished = unfinished;
  }

  public String getXn() {
    return xn;
  }

  public void setXn(String xn) {
    this.xn = xn;
  }

  public List<Edu502> getEdu502List() {
    return edu502List;
  }

  public void setEdu502List(List<Edu502> edu502List) {
    this.edu502List = edu502List;
  }
}
