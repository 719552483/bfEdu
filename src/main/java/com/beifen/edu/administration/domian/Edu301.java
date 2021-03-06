package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//教学班表
@Entity
@Table(name = "Edu301")
public class Edu301 {
	private Long Edu301_ID; //教学班ID
	private  String pyccmc;//培养层次名称
	private  String pyccbm;//培养层次编码
	private  String xbmc;//系部名称
	private  String xbbm;//系部编码
	private  String njbm;//年级编码
	private  String njmc;//年级名称
	private  String zybm;//专业编码
	private  String zymc;//专业名称
	private  String jxbmc;  //教学班名称
	private String bhzyCode;  //包含的专业编码
	private String bhzymc;  //包含的专业名称
	private String bhxzbid;  //包含的行政班Id
	private String bhxzbmc;  //包含的行政班名称
	private Integer jxbrs;  //教学班人数
	private String yxbz;//有效标志
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu301_ID")

	public Long getEdu301_ID() {
		return Edu301_ID;
	}

	public void setEdu301_ID(Long edu301_ID) {
		Edu301_ID = edu301_ID;
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

	public String getJxbmc() {
		return jxbmc;
	}

	public void setJxbmc(String jxbmc) {
		this.jxbmc = jxbmc;
	}


	public String getBhzyCode() {
		return bhzyCode;
	}

	public void setBhzyCode(String bhzyCode) {
		this.bhzyCode = bhzyCode;
	}

	public String getBhzymc() {
		return bhzymc;
	}

	public void setBhzymc(String bhzymc) {
		this.bhzymc = bhzymc;
	}

	public String getBhxzbid() {
		return bhxzbid;
	}

	public void setBhxzbid(String bhxzbid) {
		this.bhxzbid = bhxzbid;
	}

	public String getBhxzbmc() {
		return bhxzbmc;
	}

	public void setBhxzbmc(String bhxzbmc) {
		this.bhxzbmc = bhxzbmc;
	}

	public Integer getJxbrs() {
		return jxbrs;
	}

	public void setJxbrs(Integer jxbrs) {
		this.jxbrs = jxbrs;
	}


	public String getYxbz() {
		return yxbz;
	}

	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
}
