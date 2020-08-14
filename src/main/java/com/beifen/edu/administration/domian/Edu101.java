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
	// 教职工基本信息表
	private Long Edu101_ID;
	private String szxb; // 系部
	private String szxbmc; // 系部名称
	private String zy; // 专业
	private String zymc; // 专业名称
	private String xm; // 姓名
	private String xb;// 性别
	private String nl; // 年龄 
	private String sfzh;// 身份证号
	private String jzgh;// 教职工号 -自动生成
	private String csrq;// 出生日期
	private String hf;// 婚否
	private String mz;// 民族
	private String mzbm;// 民族编码
	private String zc;// 职称
	private String zcbm;// 职称编码
	private String zzmm;// 政治面貌
	private String zzmmbm;// 政治面貌编码
	private String whcd;// 文化程度
	private String whcdbm;// 文化程度编码
	private String dxsj;// 到校时间
	private String lxfs;// 联系方式
	private String jzglx;// 教职工类型 专任教师 兼职教师 教辅人员 外聘教师
	private String jzglxbm;// 教职工类型编码
	private String wpjzgspzt;// 外聘教职工审批状态



	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu101_ID")
	public Long getEdu101_ID() {
		return Edu101_ID;
	}

	public void setEdu101_ID(Long edu101_ID) {
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

	public String getSzxbmc() {
		return szxbmc;
	}

	public void setSzxbmc(String szxbmc) {
		this.szxbmc = szxbmc;
	}

	public String getZymc() {
		return zymc;
	}

	public void setZymc(String zymc) {
		this.zymc = zymc;
	}

	public String getMzbm() {
		return mzbm;
	}

	public void setMzbm(String mzbm) {
		this.mzbm = mzbm;
	}

	public String getZcbm() {
		return zcbm;
	}

	public void setZcbm(String zcbm) {
		this.zcbm = zcbm;
	}

	public String getWhcd() {
		return whcd;
	}

	public void setWhcd(String whcd) {
		this.whcd = whcd;
	}

	public String getWhcdbm() {
		return whcdbm;
	}

	public void setWhcdbm(String whcdbm) {
		this.whcdbm = whcdbm;
	}

	public String getJzglxbm() {
		return jzglxbm;
	}

	public void setJzglxbm(String jzglxbm) {
		this.jzglxbm = jzglxbm;
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

	public String getZzmm() {
		return zzmm;
	}

	public void setZzmm(String zzmm) {
		this.zzmm = zzmm;
	}

	public String getZzmmbm() {
		return zzmmbm;
	}

	public void setZzmmbm(String zzmmbm) {
		this.zzmmbm = zzmmbm;
	}

	public void setWpjzgspzt(String wpjzgspzt) {
		this.wpjzgspzt = wpjzgspzt;
	}
	public String getWpjzgspzt() {
		return wpjzgspzt;
	}
}
