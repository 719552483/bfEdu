package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//课程信息表
@Entity
@Table(name = "Edu200")
public class Edu200 {
	private Long BF200_ID;
	private String kcmc;  //课程名称
	private String kcdm;  //课程代码
	private String ywmc;  //英文名称
	private String kcfzr;  //课程负责人
	private Long kcfzrID;  //课程负责人id
	private String kclx;  //课程类型
	private String kclxCode;  //课程类型编码
	private String kcxz;  //课程性质
	private String kcxzCode;  //课程性质编码
	private String kccc;  //课程层次
	private String kcccCode;  //课程层次编码
	private double llxs;  //理论学时
	private double sjxs;  //实践学时
	private double zxs;  //总学时
	private String ksfs;  //考试方式
	private double xf;  //学分
	private String mklb;  //模块类别
	private String kcsx;  //课程属性
	private String bzzymc;  //标志专业名称
	private String xqhz;  //校企合作
	private String skfs;  //授课方式
	private String skdd;  //授课地点
	private String jpkcdj;  //精品课程等级
	private String zyhxkc;  //专业核心课程
	private String sfxk;  //是否新课
	private String zyzgkzkc;  //职业资格考证课程
	private String kztrkc;  //课证通融课程
	private String jxgglxkc;  //教学改革立项课程
	private String kcjj;  //课程简介
	private String kcmb;  //课程目标
	private String sjsl;  //设计思路
	private String jxnrjyq;  //教学内容及要求
	private String kcssjy;  //课程实施建议
	private String jsyqsm;  //教师要求说明
	private String bz;  //备注
	private String lrr;  //录入人
	private Long lrrID;  //录入人ID
	private String shr;  //审核人
	private Long shrID;  //审核人ID
	private Long lrsj;  //录入时间
	private Long shsj;  //审核时间
	private String zt;  //状态
	
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "BF200_ID")
	@Id
	public Long getBF200_ID() {
		return BF200_ID;
	}
	public void setBF200_ID(Long bF200_ID) {
		BF200_ID = bF200_ID;
	}
	public String getKcmc() {
		return kcmc;
	}
	public void setKcmc(String kcmc) {
		this.kcmc = kcmc;
	}
	public String getKcdm() {
		return kcdm;
	}
	public void setKcdm(String kcdm) {
		this.kcdm = kcdm;
	}
	public String getYwmc() {
		return ywmc;
	}
	public void setYwmc(String ywmc) {
		this.ywmc = ywmc;
	}
	public String getKcfzr() {
		return kcfzr;
	}
	public void setKcfzr(String kcfzr) {
		this.kcfzr = kcfzr;
	}
	public String getKclx() {
		return kclx;
	}
	public void setKclx(String kclx) {
		this.kclx = kclx;
	}
	public String getKcxz() {
		return kcxz;
	}
	public void setKcxz(String kcxz) {
		this.kcxz = kcxz;
	}
	public String getKccc() {
		return kccc;
	}
	public void setKccc(String kccc) {
		this.kccc = kccc;
	}
	public double getLlxs() {
		return llxs;
	}
	public void setLlxs(double llxs) {
		this.llxs = llxs;
	}
	public double getSjxs() {
		return sjxs;
	}
	public void setSjxs(double sjxs) {
		this.sjxs = sjxs;
	}
	public double getZxs() {
		return zxs;
	}
	public void setZxs(double zxs) {
		this.zxs = zxs;
	}
	public String getKsfs() {
		return ksfs;
	}
	public void setKsfs(String ksfs) {
		this.ksfs = ksfs;
	}
	public double getXf() {
		return xf;
	}
	public void setXf(double xf) {
		this.xf = xf;
	}
	public String getMklb() {
		return mklb;
	}
	public void setMklb(String mklb) {
		this.mklb = mklb;
	}
	public String getKcsx() {
		return kcsx;
	}
	public void setKcsx(String kcsx) {
		this.kcsx = kcsx;
	}
	public String getBzzymc() {
		return bzzymc;
	}
	public void setBzzymc(String bzzymc) {
		this.bzzymc = bzzymc;
	}
	public String getXqhz() {
		return xqhz;
	}
	public void setXqhz(String xqhz) {
		this.xqhz = xqhz;
	}
	public String getSkfs() {
		return skfs;
	}
	public void setSkfs(String skfs) {
		this.skfs = skfs;
	}
	public String getSkdd() {
		return skdd;
	}
	public void setSkdd(String skdd) {
		this.skdd = skdd;
	}
	public String getJpkcdj() {
		return jpkcdj;
	}
	public void setJpkcdj(String jpkcdj) {
		this.jpkcdj = jpkcdj;
	}
	public String getZyhxkc() {
		return zyhxkc;
	}
	public void setZyhxkc(String zyhxkc) {
		this.zyhxkc = zyhxkc;
	}
	public String getSfxk() {
		return sfxk;
	}
	public void setSfxk(String sfxk) {
		this.sfxk = sfxk;
	}
	public String getZyzgkzkc() {
		return zyzgkzkc;
	}
	public void setZyzgkzkc(String zyzgkzkc) {
		this.zyzgkzkc = zyzgkzkc;
	}
	public String getKztrkc() {
		return kztrkc;
	}
	public void setKztrkc(String kztrkc) {
		this.kztrkc = kztrkc;
	}
	public String getJxgglxkc() {
		return jxgglxkc;
	}
	public void setJxgglxkc(String jxgglxkc) {
		this.jxgglxkc = jxgglxkc;
	}
	public String getKcjj() {
		return kcjj;
	}
	public void setKcjj(String kcjj) {
		this.kcjj = kcjj;
	}
	public String getKcmb() {
		return kcmb;
	}
	public void setKcmb(String kcmb) {
		this.kcmb = kcmb;
	}
	public String getSjsl() {
		return sjsl;
	}
	public void setSjsl(String sjsl) {
		this.sjsl = sjsl;
	}
	public String getJxnrjyq() {
		return jxnrjyq;
	}
	public void setJxnrjyq(String jxnrjyq) {
		this.jxnrjyq = jxnrjyq;
	}
	public String getKcssjy() {
		return kcssjy;
	}
	public void setKcssjy(String kcssjy) {
		this.kcssjy = kcssjy;
	}
	public String getJsyqsm() {
		return jsyqsm;
	}
	public void setJsyqsm(String jsyqsm) {
		this.jsyqsm = jsyqsm;
	}
	public String getBz() {
		return bz;
	}
	public void setBz(String bz) {
		this.bz = bz;
	}
	public String getLrr() {
		return lrr;
	}
	public void setLrr(String lrr) {
		this.lrr = lrr;
	}
	public String getShr() {
		return shr;
	}
	public void setShr(String shr) {
		this.shr = shr;
	}
	public Long getLrsj() {
		return lrsj;
	}
	public void setLrsj(Long lrsj) {
		this.lrsj = lrsj;
	}
	public Long getShsj() {
		return shsj;
	}
	public void setShsj(Long shsj) {
		this.shsj = shsj;
	}

	public String getZt() {
		return zt;
	}
	public void setZt(String zt) {
		this.zt = zt;
	}
	public long getKcfzrID() {
		return kcfzrID;
	}
	public void setKcfzrID(long kcfzrID) {
		this.kcfzrID = kcfzrID;
	}
	public Long getLrrID() {
		return lrrID;
	}
	public void setLrrID(Long lrrID) {
		this.lrrID = lrrID;
	}
	public Long getShrID() {
		return shrID;
	}
	public void setShrID(Long shrID) {
		this.shrID = shrID;
	}
	public String getKclxCode() {
		return kclxCode;
	}
	public void setKclxCode(String kclxCode) {
		this.kclxCode = kclxCode;
	}
	public String getKcxzCode() {
		return kcxzCode;
	}
	public void setKcxzCode(String kcxzCode) {
		this.kcxzCode = kcxzCode;
	}
	public String getKcccCode() {
		return kcccCode;
	}
	public void setKcccCode(String kcccCode) {
		this.kcccCode = kcccCode;
	}
	
	
	
	
}
