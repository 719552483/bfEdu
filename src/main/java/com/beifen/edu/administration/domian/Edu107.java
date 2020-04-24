package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


@Entity
@Table(name = "Edu107")
public class Edu107 {

	//层次关系维护表
	private  Long Edu107_ID; 	
	private  String pyjhmc;//培养计划名称 
	private  String pyccmc;//培养层次名称 
	private  String pyccbm;//培养层次编码
	private  String xbmc;//系部名称
	private  String xbbm;//系部编码
	private  String njbm;//年级编码
	private  String njmc;//年级名称
	private  String zybm;//专业编码
	private  String zymc;//专业名称
	private  String yxbz;//有效标志
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu107_ID")
	public Long getEdu107_ID() {
		return Edu107_ID;
	}
	public void setEdu107_ID(Long edu107_ID) {
		Edu107_ID = edu107_ID;
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
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
	public String getPyjhmc() {
		return pyjhmc;
	}
	public void setPyjhmc(String pyjhmc) {
		this.pyjhmc = pyjhmc;
	}
	
	
	
}
