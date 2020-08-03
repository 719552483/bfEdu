package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu102")
public class Edu102 {
 //教育部门管理表
	//该表对应的是学院拥有的教育部门
	
	
	private  Long Edu102_ID; 	
	
	private  String bmmc; //部门名称 如信息中心  	基础与体育教学部  等
	private  String bmbm; //部门编码
	private  String yxbz;
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu102_ID")
	public Long getEdu102_ID() {
		return Edu102_ID;
	}
	public void setEdu102_ID(Long edu102_ID) {
		Edu102_ID = edu102_ID;
	}
	public String getBmmc() {
		return bmmc;
	}
	public void setBmmc(String bmmc) {
		this.bmmc = bmmc;
	}
	public String getBmbm() {
		return bmbm;
	}
	public void setBmbm(String bmbm) {
		this.bmbm = bmbm;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
	

	
	

	

	
	
}
