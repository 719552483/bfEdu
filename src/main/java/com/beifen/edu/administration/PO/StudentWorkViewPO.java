package com.beifen.edu.administration.PO;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

//学生基本信息表
@Entity
@Table(name = "STUDENT_WROK_VIEW")
public class StudentWorkViewPO {
	private  Long Edu0011_ID;
	private  String szxb;//所在系部编码
	private  String szxbmc;//所在系部名称
	private  String nj; //年级编码
	private  String njmc; //年级名称
	private  String zybm; //专业编码
	private  String zymc;//专业名称

	@Id
	public Long getEdu0011_ID() {
		return Edu0011_ID;
	}
	public void setEdu0011_ID(Long edu0011_ID) {
		Edu0011_ID = edu0011_ID;
	}

	public String getSzxb() {
		return szxb;
	}

	public void setSzxb(String szxb) {
		this.szxb = szxb;
	}

	public String getSzxbmc() {
		return szxbmc;
	}

	public void setSzxbmc(String szxbmc) {
		this.szxbmc = szxbmc;
	}

	public String getNj() {
		return nj;
	}

	public void setNj(String nj) {
		this.nj = nj;
	}

	public String getNjmc() {
		return njmc;
	}

	public void setNjmc(String njmc) {
		this.njmc = njmc;
	}

	public String getZybm() {
		return zybm;
	}

	public void setZybm(String zybm) {
		this.zybm = zybm;
	}

	public String getZymc() {
		return zymc;
	}

	public void setZymc(String zymc) {
		this.zymc = zymc;
	}
}
