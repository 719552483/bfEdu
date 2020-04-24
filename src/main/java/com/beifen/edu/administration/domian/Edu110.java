package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu110")
public class Edu110 {
 //班级管理
	//
	//
	
	
	
	private  Long Edu107_ID; 	
	private  String jxdbm; //教学点编码
	private  String jxdmc; //教学点名称
	private  String szcs;//所在城市
	private  String zlsj;//租赁时间
	private  String rnrs;//容纳人数
	private  String yxbz;
	
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
	public String getJxdbm() {
		return jxdbm;
	}
	public void setJxdbm(String jxdbm) {
		this.jxdbm = jxdbm;
	}
	public String getJxdmc() {
		return jxdmc;
	}
	public void setJxdmc(String jxdmc) {
		this.jxdmc = jxdmc;
	}
	public String getSzcs() {
		return szcs;
	}
	public void setSzcs(String szcs) {
		this.szcs = szcs;
	}
	public String getZlsj() {
		return zlsj;
	}
	public void setZlsj(String zlsj) {
		this.zlsj = zlsj;
	}
	public String getRnrs() {
		return rnrs;
	}
	public void setRnrs(String rnrs) {
		this.rnrs = rnrs;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}//有效标志
	
	
	
	

	
	
	

	

	

	
	

	

	
	
}
