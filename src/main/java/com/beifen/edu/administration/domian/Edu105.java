package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu105")
public class Edu105 {
 //年级管理

	
	
	
	private  Long Edu105_ID; 	
	private  String njbm;//年级编码
	private  String njmc;//年级名称
	private  String yxbz;//有效标志
	
	
	
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu105_ID")
	public Long getEdu105_ID() {
		return Edu105_ID;
	}
	public void setEdu105_ID(Long edu105_ID) {
		Edu105_ID = edu105_ID;
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
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
	
	

	
	

	

	
	
}
