package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//教学任务书表
@Entity
@Table(name = "Edu201")
public class Edu201 {
	private Long Edu201_ID; //任务书ID
	private Long Edu301_ID;  //教学班ID
	private Long Edu108_ID;  //培养计划ID
	private String jxbmc;  //教学班名称
	private String kcmc;  //课程名称
	private String zymc;  //专业名称
	private String jxbrs;  //教学班人数
	private String xzbmc;  //行政班名称
	private String zxs;  //周学时
	private  String ls;//老师
	private  String lsmc;//老师姓名
	private  String zyls;//主要老师
	private  String zylsmc;//主要老师姓名
	private String pkbm;  //排课部门
	private String pkbmCode;  //排课部门编码
	private String kkbm;  //开课部门
	private String kkbmCode;  //开课部门编码
	private String sfxylcj;  //是否需要录成绩
	private String sszt;  //审核状态
	
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu201_ID")
	@Id
	public Long getEdu201_ID() {
		return Edu201_ID;
	}
	public void setEdu201_ID(Long edu201_ID) {
		Edu201_ID = edu201_ID;
	}
	public Long getEdu301_ID() {
		return Edu301_ID;
	}
	public void setEdu301_ID(Long edu301_ID) {
		Edu301_ID = edu301_ID;
	}
	public Long getEdu108_ID() {
		return Edu108_ID;
	}
	public void setEdu108_ID(Long edu108_ID) {
		Edu108_ID = edu108_ID;
	}
	public String getLs() {
		return ls;
	}
	public void setLs(String ls) {
		this.ls = ls;
	}
	public String getZyls() {
		return zyls;
	}
	public void setZyls(String zyls) {
		this.zyls = zyls;
	}
	public String getPkbm() {
		return pkbm;
	}
	public void setPkbm(String pkbm) {
		this.pkbm = pkbm;
	}
	public String getPkbmCode() {
		return pkbmCode;
	}
	public void setPkbmCode(String pkbmCode) {
		this.pkbmCode = pkbmCode;
	}
	public String getSfxylcj() {
		return sfxylcj;
	}
	public void setSfxylcj(String sfxylcj) {
		this.sfxylcj = sfxylcj;
	}
	public String getLsmc() {
		return lsmc;
	}
	public void setLsmc(String lsmc) {
		this.lsmc = lsmc;
	}
	public String getZylsmc() {
		return zylsmc;
	}
	public void setZylsmc(String zylsmc) {
		this.zylsmc = zylsmc;
	}

	public String getJxbmc() {
		return jxbmc;
	}
	public void setJxbmc(String jxbmc) {
		this.jxbmc = jxbmc;
	}
	public String getKcmc() {
		return kcmc;
	}
	public void setKcmc(String kcmc) {
		this.kcmc = kcmc;
	}
	public String getZymc() {
		return zymc;
	}
	public void setZymc(String zymc) {
		this.zymc = zymc;
	}
	public String getJxbrs() {
		return jxbrs;
	}
	public void setJxbrs(String jxbrs) {
		this.jxbrs = jxbrs;
	}
	public String getXzbmc() {
		return xzbmc;
	}
	public void setXzbmc(String xzbmc) {
		this.xzbmc = xzbmc;
	}
	public String getZxs() {
		return zxs;
	}
	public void setZxs(String zxs) {
		this.zxs = zxs;
	}
	public String getKkbm() {
		return kkbm;
	}
	public void setKkbm(String kkbm) {
		this.kkbm = kkbm;
	}
	public String getKkbmCode() {
		return kkbmCode;
	}
	public void setKkbmCode(String kkbmCode) {
		this.kkbmCode = kkbmCode;
	}
	public String getSszt() {
		return sszt;
	}
	public void setSszt(String sszt) {
		this.sszt = sszt;
	}
	
	
	
}
