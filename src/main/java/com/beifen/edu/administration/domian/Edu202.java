package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//排课表 
@Entity
@Table(name = "Edu202")
public class Edu202 {
	private Long Edu202_ID;
	private Long Edu201_ID; // 任务书ID
	private Long xnid; // 学年id
	private String ksz; // 开始周
	private String jsz; // 结束周
	private String skddmc; // 授课地点名称
	private String skddid; // 授课地点ID

	
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu202_ID")
	public Long getEdu202_ID() {
		return Edu202_ID;
	}
	public void setEdu202_ID(Long edu202_ID) {
		Edu202_ID = edu202_ID;
	}
	public Long getEdu201_ID() {
		return Edu201_ID;
	}
	public void setEdu201_ID(Long edu201_ID) {
		Edu201_ID = edu201_ID;
	}
	public Long getXnid() {
		return xnid;
	}
	public void setXnid(Long xnid) {
		this.xnid = xnid;
	}
	public String getKsz() {
		return ksz;
	}
	public void setKsz(String ksz) {
		this.ksz = ksz;
	}
	public String getJsz() {
		return jsz;
	}
	public void setJsz(String jsz) {
		this.jsz = jsz;
	}
	public String getSkddmc() {
		return skddmc;
	}
	public void setSkddmc(String skddmc) {
		this.skddmc = skddmc;
	}
	public String getSkddid() {
		return skddid;
	}
	public void setSkddid(String skddid) {
		this.skddid = skddid;
	}


}
