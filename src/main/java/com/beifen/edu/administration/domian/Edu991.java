package com.beifen.edu.administration.domian;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//权限表
@Entity
@Table(name = "Edu991")
public class Edu991 {
	
	
	private Long BF991_ID;
	private String js;  //角色类型(名称)
	private String cdqx;  //菜单权限(指定长度700)
	private String anqx;//按钮权限  
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "BF991_ID")
	public Long getBF991_ID() {
		return BF991_ID;
	}
	public void setBF991_ID(Long bF991_ID) {
		BF991_ID = bF991_ID;
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
