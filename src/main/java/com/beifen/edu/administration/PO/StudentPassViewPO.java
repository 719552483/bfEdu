package com.beifen.edu.administration.PO;


import javax.persistence.*;

//学生基本信息表
@Entity
@Table(name = "STUDENT_PASS_VIEW")
public class StudentPassViewPO {
	private  Long Edu001_ID;
	private  String pycc;//培养层次编码
	private  String pyccmc;//培养层次名称
	private  String szxb;//所在系部编码
	private  String szxbmc;//所在系部名称
	private  String nj; //年级编码
	private  String njmc; //年级名称
	private  String zybm; //专业编码
	private  String zymc;//专业名称
	private  String Edu300_ID; //行政班ID
	private  String xzbname; //行政班名称
	private  String xh; //学号
	private  String xm; //学生姓名
	private String batch;// 批次代码
	private String batchName; //批次名称
	private String own;
	private String pass;
	private String rate;

	
	@Id
	public Long getEdu001_ID() {
		return Edu001_ID;
	}
	public void setEdu001_ID(Long edu001_ID) {
		Edu001_ID = edu001_ID;
	}

	public String getPycc() {
		return pycc;
	}

	public void setPycc(String pycc) {
		this.pycc = pycc;
	}

	public String getPyccmc() {
		return pyccmc;
	}

	public void setPyccmc(String pyccmc) {
		this.pyccmc = pyccmc;
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

	public String getEdu300_ID() {
		return Edu300_ID;
	}

	public void setEdu300_ID(String edu300_ID) {
		Edu300_ID = edu300_ID;
	}

	public String getXzbname() {
		return xzbname;
	}

	public void setXzbname(String xzbname) {
		this.xzbname = xzbname;
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

	public String getBatch() {
		return batch;
	}

	public void setBatch(String batch) {
		this.batch = batch;
	}

	public String getBatchName() {
		return batchName;
	}

	public void setBatchName(String batchName) {
		this.batchName = batchName;
	}

	public String getOwn() {
		return own;
	}

	public void setOwn(String own) {
		this.own = own;
	}

	public String getPass() {
		return pass;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}

	public String getRate() {
		return rate;
	}

	public void setRate(String rate) {
		this.rate = rate;
	}
}
