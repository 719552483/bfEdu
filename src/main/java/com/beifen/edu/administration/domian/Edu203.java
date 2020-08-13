package com.beifen.edu.administration.domian;

import javax.persistence.*;

//排课关联表
@Entity
@Table(name = "Edu203")
public class Edu203 {
	private Long Edu203_ID;
	private String Edu202_ID; //排课表ID
	private String week;//所在周
	private String kjid; // 课节id
	private String kjmc; // 课节名称
	private String xqid; // 星期id
	private String xqmc; // 星期名称

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu203_ID")

	public Long getEdu203_ID() {
		return Edu203_ID;
	}

	public void setEdu203_ID(Long edu203_ID) {
		Edu203_ID = edu203_ID;
	}

	public String getEdu202_ID() {
		return Edu202_ID;
	}

	public void setEdu202_ID(String edu202_ID) {
		Edu202_ID = edu202_ID;
	}

	public String getKjid() {
		return kjid;
	}

	public void setKjid(String kjid) {
		this.kjid = kjid;
	}

	public String getKjmc() {
		return kjmc;
	}

	public void setKjmc(String kjmc) {
		this.kjmc = kjmc;
	}

	public String getXqid() {
		return xqid;
	}

	public void setXqid(String xqid) {
		this.xqid = xqid;
	}

	public String getXqmc() {
		return xqmc;
	}

	public void setXqmc(String xqmc) {
		this.xqmc = xqmc;
	}

	public String getWeek() {
		return week;
	}

	public void setWeek(String week) {
		this.week = week;
	}
}
