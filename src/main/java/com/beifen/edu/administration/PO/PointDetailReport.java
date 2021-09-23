package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu502;

import java.util.List;

public class PointDetailReport {

  private Long Edu501Id;//主键
  private Long edu500Id;//教学点主键
  private String Capacity;//容量
  private String pointName;//任务点名称
  private String remarks;//备注
  private String usedPercent;
  private String countUsed;
  private List<Edu502> edu502List;

  public List<Edu502> getEdu502List() {
    return edu502List;
  }

  public void setEdu502List(List<Edu502> edu502List) {
    this.edu502List = edu502List;
  }

  public String getCountUsed() {
    return countUsed;
  }

  public void setCountUsed(String countUsed) {
    this.countUsed = countUsed;
  }

  public String getUsedPercent() {
    return usedPercent;
  }

  public void setUsedPercent(String usedPercent) {
    this.usedPercent = usedPercent;
  }

  public Long getEdu501Id() {
    return Edu501Id;
  }

  public void setEdu501Id(Long edu501Id) {
    Edu501Id = edu501Id;
  }

  public Long getEdu500Id() {
    return edu500Id;
  }

  public void setEdu500Id(Long edu500Id) {
    this.edu500Id = edu500Id;
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
}
