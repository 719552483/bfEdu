package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu002")
public class Edu002 {
 //学生奖惩信息表
	
	
	private  Long Edu002_ID; 	
	private  String xh; //学号
	private  String xm; //学生姓名
	private  String jcsj; //奖惩时间
	private  String jcnr;//奖惩内容
	private  String jcbz;//奖惩标志  1为奖励 2为惩罚
	private  String yxbz;//有效标志
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu002_ID")
	public Long getEdu002_ID() {
		return Edu002_ID;
	}
	public void setEdu002_ID(Long edu002_ID) {
		Edu002_ID = edu002_ID;
	}
	public String getXh() {
		return xh;
	}
	public void setXh(String xh) {
		this.xh = xh;
	}
	public String getXm() {
		return xm;
	}
	public void setXm(String xm) {
		this.xm = xm;
	}
	public String getJcsj() {
		return jcsj;
	}
	public void setJcsj(String jcsj) {
		this.jcsj = jcsj;
	}
	public String getJcnr() {
		return jcnr;
	}
	public void setJcnr(String jcnr) {
		this.jcnr = jcnr;
	}
	public String getJcbz() {
		return jcbz;
	}
	public void setJcbz(String jcbz) {
		this.jcbz = jcbz;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
	
	
	

	
	
	
}
