package com.beifen.edu.administration.domian;

import javax.persistence.*;

//教学任务点实体类
@Entity
@Table(name = "Edu500")
public class Edu500 {

  private Long edu500Id;//主键
  private String city;//所属市
  private String county;//所属区县
  private String townShip;//所属县乡
  private String localName;//教学点名称


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

  public String getCounty() {
    return county;
  }

  public void setCounty(String county) {
    this.county = county;
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
}
