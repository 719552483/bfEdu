package com.beifen.edu.administration.domian;

import javax.persistence.*;

//教学点实体类
@Entity
@Table(name = "Edu500")
public class Edu500 {

  private Long edu500Id;
  private String jxdmc;
  private String ssxq;
  private String ssxqCode;
  private String pkzyx;
  private String pkzyxCode;
  private String rnrs;
  private String glxb;
  private String glxbCode;
  private String cdlx;
  private String cdlxCode;
  private String cdxz;
  private String cdxzCode;
  private String lf;
  private String lfCode;
  private String lc;
  private String lcCode;
  private String cdfzr;
  private String cdfzrCode;
  private String bz;
  private String cdzt;
  private String cdztCode;

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


  public String getJxdmc() {
    return jxdmc;
  }

  public void setJxdmc(String jxdmc) {
    this.jxdmc = jxdmc;
  }


  public String getSsxq() {
    return ssxq;
  }

  public void setSsxq(String ssxq) {
    this.ssxq = ssxq;
  }


  public String getPkzyx() {
    return pkzyx;
  }

  public void setPkzyx(String pkzyx) {
    this.pkzyx = pkzyx;
  }


  public String getRnrs() {
    return rnrs;
  }

  public void setRnrs(String rnrs) {
    this.rnrs = rnrs;
  }


  public String getGlxb() {
    return glxb;
  }

  public void setGlxb(String glxb) {
    this.glxb = glxb;
  }


  public String getCdlx() {
    return cdlx;
  }

  public void setCdlx(String cdlx) {
    this.cdlx = cdlx;
  }


  public String getCdxz() {
    return cdxz;
  }

  public void setCdxz(String cdxz) {
    this.cdxz = cdxz;
  }


  public String getLf() {
    return lf;
  }

  public void setLf(String lf) {
    this.lf = lf;
  }


  public String getLc() {
    return lc;
  }

  public void setLc(String lc) {
    this.lc = lc;
  }


  public String getCdfzr() {
    return cdfzr;
  }

  public void setCdfzr(String cdfzr) {
    this.cdfzr = cdfzr;
  }


  public String getBz() {
    return bz;
  }

  public void setBz(String bz) {
    this.bz = bz;
  }


  public String getCdzt() {
    return cdzt;
  }

  public void setCdzt(String cdzt) {
    this.cdzt = cdzt;
  }

  public String getSsxqCode() {
    return ssxqCode;
  }

  public void setSsxqCode(String ssxqCode) {
    this.ssxqCode = ssxqCode;
  }

  public String getPkzyxCode() {
    return pkzyxCode;
  }

  public void setPkzyxCode(String pkzyxCode) {
    this.pkzyxCode = pkzyxCode;
  }

  public String getGlxbCode() {
    return glxbCode;
  }

  public void setGlxbCode(String glxbCode) {
    this.glxbCode = glxbCode;
  }

  public String getCdlxCode() {
    return cdlxCode;
  }

  public void setCdlxCode(String cdlxCode) {
    this.cdlxCode = cdlxCode;
  }

  public String getCdxzCode() {
    return cdxzCode;
  }

  public void setCdxzCode(String cdxzCode) {
    this.cdxzCode = cdxzCode;
  }

  public String getLfCode() {
    return lfCode;
  }

  public void setLfCode(String lfCode) {
    this.lfCode = lfCode;
  }

  public String getLcCode() {
    return lcCode;
  }

  public void setLcCode(String lcCode) {
    this.lcCode = lcCode;
  }

  public String getCdfzrCode() {
    return cdfzrCode;
  }

  public void setCdfzrCode(String cdfzrCode) {
    this.cdfzrCode = cdfzrCode;
  }

  public String getCdztCode() {
    return cdztCode;
  }

  public void setCdztCode(String cdztCode) {
    this.cdztCode = cdztCode;
  }
}
