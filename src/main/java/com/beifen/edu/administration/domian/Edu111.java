package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu111")
public class Edu111 {
 //教学点管理表
	//
	//
	
	
	
	private  Long Edu106_ID; 	
	private  String jxdbm; //教学点编码
	private  String jxdmc; //教学点名称
	private  String szcs;//所在城市
	private  String zlsj;//租赁时间
	private  String rnrs;//容纳人数
	private  String yxbz;//有效标志
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu106_ID")
	public Long getEdu106_ID() {
		return Edu106_ID;
	}
	public void setEdu106_ID(Long edu106_ID) {
		Edu106_ID = edu106_ID;
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
	}
	
	
	
	
	

	

	

	
	

	

	
	
}
