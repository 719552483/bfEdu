package com.beifen.edu.administration.domian;

import javax.persistence.*;

//教学任务点实体类
@Entity
@Table(name = "Edu500")
public class Edu500 {

  private Long edu500Id;//主键
  private String city;//所属市
  private String cityCode;//地级市代码
  private String country;//所属区县
  private String townShip;//所属县乡
  private String localName;//教学点名称
  private String localAddress;//详细地址
  private String remarks;//备注


  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
  @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
  @Column(name = "Edu500_ID")



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

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public String getTownShip() {
    return townShip;
  }

  public void setTownShip(String townShip) {
    this.townShip = townShip;
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

  public String getCityCode() {
    return cityCode;
  }

  public void setCityCode(String cityCode) {
    this.cityCode = cityCode;
  }
}
