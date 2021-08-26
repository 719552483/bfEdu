package com.beifen.edu.administration.domian;

import javax.persistence.*;

//课时上限表
@Entity
@Table(name = "Edu403")
public class Edu403 {
	private Long Edu403_ID;//主键
	private String xn; //学年名称
	private String xnid;//学年ID
	private String ksz;//开始周
	private String jsz;//结束周
	private String kssx;//课时上限
	private String type;//类型1：集中2：分散
	private String nodeValue;//类型名称
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu403_ID")
	public Long getEdu403_ID() {
		return Edu403_ID;
	}
	public void setEdu403_ID(Long Edu403_ID) {
		this.Edu403_ID = Edu403_ID;
	}

	public String getXn() {
		return xn;
	}

	public void setXn(String xn) {
		this.xn = xn;
	}

	public String getXnid() {
		return xnid;
	}

	public void setXnid(String xnid) {
		this.xnid = xnid;
	}

	public String getKsz() {
		return ksz;
	}

	public void setKsz(String ksz) {
		this.ksz = ksz;
	}

	public String getJsz() {
		return jsz;
	}

	public void setJsz(String jsz) {
		this.jsz = jsz;
	}

	public String getKssx() {
		return kssx;
	}

	public void setKssx(String kssx) {
		this.kssx = kssx;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getNodeValue() {
		return nodeValue;
	}

	public void setNodeValue(String nodeValue) {
		this.nodeValue = nodeValue;
	}
}