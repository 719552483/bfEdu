package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu001")
public class Edu001 {
 //学生基本信息表
	
	
	private  Long Edu001_ID; 	
	private  String xh; //学号
	private  String xm; //学生姓名
	private  String nl; //学生年龄
	private  String xb;//性别  1男2女
	private  String zy; //学生职业
	private  String xzbmc; //行政班名称
	private  String nj; //年级  如2010级 2011级
	private  String lxfs;//联系方式
	private  String csrq;//出生日期
	private  String hf;//婚否  1已婚 0未婚
	private  String zt;//状态 //在读、离校等
	private  String xq;//校区
	private  String pycc;//培养层次
	private  String szxb;//所在系部
	private  String zymc;//专业名称
	private  String bj;//班级
	private  String sfzh;//身份证号 
	private  String mz;//民族
	private  String zzmm;//政治面貌
	private  String syd;//生源地
	private  String whcd;//文化程度
	private  String yxbz;//有效标志
	private  String rxsj;//入学时间
	private  String xsmm;//学生密码
	private  String bz1;//备注1
	private  String bz2;//备注2
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu001_ID")
	public Long getEdu001_ID() {
		return Edu001_ID;
	}
	public void setEdu001_ID(Long edu001_ID) {
		Edu001_ID = edu001_ID;
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
	public String getNl() {
		return nl;
	}
	public void setNl(String nl) {
		this.nl = nl;
	}
	public String getZy() {
		return zy;
	}
	public void setZy(String zy) {
		this.zy = zy;
	}
	public String getXzbmc() {
		return xzbmc;
	}
	public void setXzbmc(String xzbmc) {
		this.xzbmc = xzbmc;
	}
	
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
	
	public String getCsrq() {
		return csrq;
	}
	public void setCsrq(String csrq) {
		this.csrq = csrq;
	}
	public String getHf() {
		return hf;
	}
	public void setHf(String hf) {
		this.hf = hf;
	}
	public String getXb() {
		return xb;
	}
	public void setXb(String xb) {
		this.xb = xb;
	}
	public String getLxfs() {
		return lxfs;
	}
	public void setLxfs(String lxfs) {
		this.lxfs = lxfs;
	}
	public String getNj() {
		return nj;
	}
	public void setNj(String nj) {
		this.nj = nj;
	}
	public String getZt() {
		return zt;
	}
	public void setZt(String zt) {
		this.zt = zt;
	}
	public String getXq() {
		return xq;
	}
	public void setXq(String xq) {
		this.xq = xq;
	}
	public String getPycc() {
		return pycc;
	}
	public void setPycc(String pycc) {
		this.pycc = pycc;
	}
	public String getSzxb() {
		return szxb;
	}
	public void setSzxb(String szxb) {
		this.szxb = szxb;
	}
	public String getZymc() {
		return zymc;
	}
	public void setZymc(String zymc) {
		this.zymc = zymc;
	}
	public String getBj() {
		return bj;
	}
	public void setBj(String bj) {
		this.bj = bj;
	}
	public String getSfzh() {
		return sfzh;
	}
	public void setSfzh(String sfzh) {
		this.sfzh = sfzh;
	}
	public String getMz() {
		return mz;
	}
	public void setMz(String mz) {
		this.mz = mz;
	}
	public String getZzmm() {
		return zzmm;
	}
	public void setZzmm(String zzmm) {
		this.zzmm = zzmm;
	}
	public String getSyd() {
		return syd;
	}
	public void setSyd(String syd) {
		this.syd = syd;
	}
	public String getWhcd() {
		return whcd;
	}
	public void setWhcd(String whcd) {
		this.whcd = whcd;
	}
	public String getRxsj() {
		return rxsj;
	}
	public void setRxsj(String rxsj) {
		this.rxsj = rxsj;
	}
	public String getXsmm() {
		return xsmm;
	}
	public void setXsmm(String xsmm) {
		this.xsmm = xsmm;
	}
	public String getBz1() {
		return bz1;
	}
	public void setBz1(String bz1) {
		this.bz1 = bz1;
	}
	public String getBz2() {
		return bz2;
	}
	public void setBz2(String bz2) {
		this.bz2 = bz2;
	}
	
	
	
}
