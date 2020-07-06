package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//培养计划-->课程 -->行政班 关系表
@Entity
@Table(name = "Edu108")
public class Edu108 {
	private  Long Edu108_ID;  //ID
	private  Long Edu107_ID; //(层次 系部 年级 专业关系)培养计划ID
	private  Long Edu200_ID; //课程ID
	private String Edu300_ID;  //行政班ID
	private String xzbmc;  //行政班名称
	private String kcmc;  //课程名称
	private String kcdm;  //课程代码
//	private String ywmc;  //英文名称
	private double zxs;  //总学时
	private double xf;  //学分
	private double llxs;  //理论学时
	private double sjxs;  //实践学时
	private double fsxs;  //分散学时
	private double jzxs;  //集中学时
	private String skxq;  //授课学期
	private double zhouxs;  //周学时
	private double zzs;  //总周数
	private String kclx;  //课程类型
	private String kclxCode;  //课程类型编码
	private String kcxz;  //课程性质
	private String kcxzCode;  //课程性质编码
	private String ksfs;  //考试方式
	private String ksfsCode;  //考试方式编码
	private String kkbm;  //开课部门
	private String kkbmCode;  //开课部门编码
	private String bzzymc;  //标志专业名称
	private String skdd;  //授课地点
	private String mklb;  //模块类别
	private String kcsx;  //课程属性
	private String fkyj;  //反馈意见--
	private String qzz;  //起止周 --
	private String pkyq;  //排课要求
	private String qzcjbl;  //期中成绩比例
	private String qmcjbl;  //期末成绩比例
	private String sfxk;  //是否新课
	private String skfs;  //授课方式
	private String xqhz;  //校企合作
	private String jpkcdj;  //精品课程等级
	private String zyhxkc;  //专业核心课程
	private String zyzgkzkc;  //职业资格考证课程
	private String kztrkc;  //课证通融课程
	private String jxgglxkc;  //教学改革立项课程
	private String sfsckkjh;  //是否生成开课计划--
	private String xbsp;  //系部审批--
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu108_ID")
	public Long getEdu108_ID() {
		return Edu108_ID;
	}
	public void setEdu108_ID(Long edu108_ID) {
		Edu108_ID = edu108_ID;
	}
	public Long getEdu107_ID() {
		return Edu107_ID;
	}
	public void setEdu107_ID(Long edu107_ID) {
		Edu107_ID = edu107_ID;
	}
	public String getKcmc() {
		return kcmc;
	}
	public Long getEdu200_ID() {
		return Edu200_ID;
	}
	public void setEdu200_ID(Long edu200_ID) {
		Edu200_ID = edu200_ID;
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
//	public String getYwmc() {
//		return ywmc;
//	}
//	public void setYwmc(String ywmc) {
//		this.ywmc = ywmc;
//	}
	
	public double getZxs() {
		return zxs;
	}
	public double getFsxs() {
		return fsxs;
	}
	public void setFsxs(double fsxs) {
		this.fsxs = fsxs;
	}
	public double getJzxs() {
		return jzxs;
	}
	public void setJzxs(double jzxs) {
		this.jzxs = jzxs;
	}
	public void setZxs(double zxs) {
		this.zxs = zxs;
	}
	public double getXf() {
		return xf;
	}
	public void setXf(double xf) {
		this.xf = xf;
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
	public String getSkxq() {
		return skxq;
	}
	public void setSkxq(String skxq) {
		this.skxq = skxq;
	}
	public double getZhouxs() {
		return zhouxs;
	}
	public void setZhouxs(double zhouxs) {
		this.zhouxs = zhouxs;
	}
	public double getZzs() {
		return zzs;
	}
	public void setZzs(double zzs) {
		this.zzs = zzs;
	}
	public String getKclx() {
		return kclx;
	}
	public void setKclx(String kclx) {
		this.kclx = kclx;
	}
	public String getKclxCode() {
		return kclxCode;
	}
	public void setKclxCode(String kclxCode) {
		this.kclxCode = kclxCode;
	}
	public String getKcxz() {
		return kcxz;
	}
	public void setKcxz(String kcxz) {
		this.kcxz = kcxz;
	}
	public String getKcxzCode() {
		return kcxzCode;
	}
	public void setKcxzCode(String kcxzCode) {
		this.kcxzCode = kcxzCode;
	}
	public String getKsfs() {
		return ksfs;
	}
	public void setKsfs(String ksfs) {
		this.ksfs = ksfs;
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
	public String getSkdd() {
		return skdd;
	}
	public void setSkdd(String skdd) {
		this.skdd = skdd;
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
	public String getFkyj() {
		return fkyj;
	}
	public void setFkyj(String fkyj) {
		this.fkyj = fkyj;
	}
	public String getQzz() {
		return qzz;
	}
	public void setQzz(String qzz) {
		this.qzz = qzz;
	}
	public String getPkyq() {
		return pkyq;
	}
	public void setPkyq(String pkyq) {
		this.pkyq = pkyq;
	}
	public String getQzcjbl() {
		return qzcjbl;
	}
	public void setQzcjbl(String qzcjbl) {
		this.qzcjbl = qzcjbl;
	}
	public String getQmcjbl() {
		return qmcjbl;
	}
	public void setQmcjbl(String qmcjbl) {
		this.qmcjbl = qmcjbl;
	}
	public String getSfxk() {
		return sfxk;
	}
	public void setSfxk(String sfxk) {
		this.sfxk = sfxk;
	}
	public String getSkfs() {
		return skfs;
	}
	public void setSkfs(String skfs) {
		this.skfs = skfs;
	}
	public String getXqhz() {
		return xqhz;
	}
	public void setXqhz(String xqhz) {
		this.xqhz = xqhz;
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
	public String getSfsckkjh() {
		return sfsckkjh;
	}
	public void setSfsckkjh(String sfsckkjh) {
		this.sfsckkjh = sfsckkjh;
	}
	public String getKsfsCode() {
		return ksfsCode;
	}
	public void setKsfsCode(String ksfsCode) {
		this.ksfsCode = ksfsCode;
	}
	public String getXbsp() {
		return xbsp;
	}
	public void setXbsp(String xbsp) {
		this.xbsp = xbsp;
	}
	public String getXzbmc() {
		return xzbmc;
	}
	public void setXzbmc(String xzbmc) {
		this.xzbmc = xzbmc;
	}
	public String getBzzymc() {
		return bzzymc;
	}
	public void setBzzymc(String bzzymc) {
		this.bzzymc = bzzymc;
	}
	public String getEdu300_ID() {
		return Edu300_ID;
	}
	public void setEdu300_ID(String edu300_ID) {
		Edu300_ID = edu300_ID;
	}

}
