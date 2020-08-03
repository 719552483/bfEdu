package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//学年表
@Entity
@Table(name = "Edu400")
public class Edu400 {
	private Long Edu400_ID;//学年id
	private String xnmc; //学年名称
	private String kssj; //开始时间
	private String jssj; //结束时间
	private int zzs; //总周数
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu400_ID")
	public Long getEdu400_ID() {
		return Edu400_ID;
	}
	public void setEdu400_ID(Long edu400_ID) {
		Edu400_ID = edu400_ID;
	}
	public String getXnmc() {
		return xnmc;
	}
	public void setXnmc(String xnmc) {
		this.xnmc = xnmc;
	}
	public String getKssj() {
		return kssj;
	}
	public void setKssj(String kssj) {
		this.kssj = kssj;
	}
	public String getJssj() {
		return jssj;
	}
	public void setJssj(String jssj) {
		this.jssj = jssj;
	}
	public int getZzs() {
		return zzs;
	}
	public void setZzs(int zzs) {
		this.zzs = zzs;
	}



}