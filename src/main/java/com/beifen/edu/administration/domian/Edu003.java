package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu003")
public class Edu003 {
 //班级管理表
	
	
	private  Long Edu003_ID; 	
	private  String bjbh; //班级编号
	private  String bjmc; //班级名称
	private  String fdybm; //辅导员编码
	private  String fdyxm;//辅导员姓名
	private  String bjnd;//班级年度
	private  String yxbz;//有效标志
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu003_ID")
	public Long getEdu003_ID() {
		return Edu003_ID;
	}
	public void setEdu003_ID(Long edu003_ID) {
		Edu003_ID = edu003_ID;
	}
	public String getBjbh() {
		return bjbh;
	}
	public void setBjbh(String bjbh) {
		this.bjbh = bjbh;
	}
	public String getBjmc() {
		return bjmc;
	}
	public void setBjmc(String bjmc) {
		this.bjmc = bjmc;
	}
	public String getFdybm() {
		return fdybm;
	}
	public void setFdybm(String fdybm) {
		this.fdybm = fdybm;
	}
	public String getFdyxm() {
		return fdyxm;
	}
	public void setFdyxm(String fdyxm) {
		this.fdyxm = fdyxm;
	}
	public String getBjnd() {
		return bjnd;
	}
	public void setBjnd(String bjnd) {
		this.bjnd = bjnd;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
	

	
	
}
