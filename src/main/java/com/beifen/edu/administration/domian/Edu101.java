package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu101")
public class Edu101 {
 //教职工基本信息表
	private  long Edu101_ID; 	
	private  String szxb; //系部
	private  String zy; //专业
	private  String xm; //姓名
	private  String xb;//性别
	private  String nl; //年龄
	private  String sfzh;//身份证号
	private  String jzgh;//教职工号
	private  String csrq;//出生日期
	private  String hf;//婚否
	private  String mz;//民族
	private  String zc;//职称
	private  String xl;//学历
	private  String dxsj;//到校时间
	private  String lxfs;//联系方式
	private  String jzglx;//教职工类型  专任教师 兼职教师 教辅人员 外聘教师
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu101_ID")
	public long getEdu101_ID() {
		return Edu101_ID;
	}
	public void setEdu101_ID(long edu101_ID) {
		Edu101_ID = edu101_ID;
	}
	public String getSzxb() {
		return szxb;
	}
	public void setSzxb(String szxb) {
		this.szxb = szxb;
	}
	public String getZy() {
		return zy;
	}
	public void setZy(String zy) {
		this.zy = zy;
	}
	public String getXm() {
		return xm;
	}
	public void setXm(String xm) {
		this.xm = xm;
	}
	public String getXb() {
		return xb;
	}
	public void setXb(String xb) {
		this.xb = xb;
	}
	public String getNl() {
		return nl;
	}
	public void setNl(String nl) {
		this.nl = nl;
	}
	public String getSfzh() {
		return sfzh;
	}
	public void setSfzh(String sfzh) {
		this.sfzh = sfzh;
	}
	public String getJzgh() {
		return jzgh;
	}
	public void setJzgh(String jzgh) {
		this.jzgh = jzgh;
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
	public String getMz() {
		return mz;
	}
	public void setMz(String mz) {
		this.mz = mz;
	}
	public String getZc() {
		return zc;
	}
	public void setZc(String zc) {
		this.zc = zc;
	}
	public String getXl() {
		return xl;
	}
	public void setXl(String xl) {
		this.xl = xl;
	}
	public String getDxsj() {
		return dxsj;
	}
	public void setDxsj(String dxsj) {
		this.dxsj = dxsj;
	}
	public String getLxfs() {
		return lxfs;
	}
	public void setLxfs(String lxfs) {
		this.lxfs = lxfs;
	}
	public String getJzglx() {
		return jzglx;
	}
	public void setJzglx(String jzglx) {
		this.jzglx = jzglx;
	}
	
	


	
	
}
