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
	private String xnmc;// 学年名称
	private String szz; //所在周

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
	public String getXnmc() {
		return xnmc;
	}

	public void setXnmc(String xnmc) {
		this.xnmc = xnmc;
	}

	public String getSzz() {
		return szz;
	}

	public void setSzz(String szz) {
		this.szz = szz;
	}
}
