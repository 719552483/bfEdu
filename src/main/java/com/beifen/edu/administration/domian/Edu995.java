package com.beifen.edu.administration.domian;

import javax.persistence.*;
import java.io.Serializable;

//权限表
@Entity
@Table(name = "Edu995")
public class Edu995 implements Serializable {
	private Long BF995_ID;
	private Long BF991_ID;
	private String js;  //角色类型(名称)
	private String cdqx;  //菜单权限(指定长度700)
	private String anqx;//按钮权限

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "BF995_ID")
	public Long getBF995_ID() {
		return BF995_ID;
	}

	public void setBF995_ID(Long BF995_ID) {
		this.BF995_ID = BF995_ID;
	}

	public Long getBF991_ID() {
		return BF991_ID;
	}

	public void setBF991_ID(Long BF991_ID) {
		this.BF991_ID = BF991_ID;
	}

	public String getJs() {
		return js;
	}
	public void setJs(String js) {
		this.js = js;
	}
	// 指定blob字段
	@Lob
	@Basic(fetch = FetchType.LAZY)
	public String getCdqx() {
		return cdqx;
	}
	public void setCdqx(String cdqx) {
		this.cdqx = cdqx;
	}
	public String getAnqx() {
		return anqx;
	}
	public void setAnqx(String anqx) {
		this.anqx = anqx;
	} 

	
	

	
	
}
