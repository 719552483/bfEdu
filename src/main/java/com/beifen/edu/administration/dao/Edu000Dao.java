package com.beifen.edu.administration.dao;

import java.util.List;

import com.sun.istack.internal.Nullable;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu000;
import com.beifen.edu.administration.domian.Edu001;
import com.beifen.edu.administration.domian.Edu990;
@Configuration
public interface Edu000Dao extends  JpaRepository<Edu000, Long>,JpaSpecificationExecutor<Edu000>{

	
	//根据二级代码关联字段查询二级代码
	@Query(value = "select * from edu000 b where b.ejdmGlzd=?1", nativeQuery = true)
	public List<Edu000> queryejdm(String ejdmGlzd);
	
	// 根据二级代码获取二级代码值
	@Query(value = "select e.ejdmz from edu000 e where e.ejdm=?1 and e.ejdmmc=?2", nativeQuery = true)
	public String queryEjdmZByEjdm(String ejdm,String ejdmmc);
	
	// 根据二级代码值获取二级代码
	@Query(value = "select e.ejdm from edu000 e where e.ejdmz=?1 and e.ejdmGlzd=?2", nativeQuery = true)
	@Nullable
	public String queryEjdmByEjdmZ(String ejdmz,String ejdmGlzd);

	// 根据二级代码和关联字段获取二级代码值
	@Query(value = "select e.ejdmz from edu000 e where ejdm=?1 and e.ejdmglzd=?2", nativeQuery = true)
	@Nullable
	public String queryEjdmMcByEjdmZ(String ejdm,String ejdmGlzd);
	
	@Query(value = "select * from edu000", nativeQuery = true)
	public List<Edu000> queryejdm();

	// 根据二级代码关联字段和值获取二级代码
	@Query(value = "select * from edu000 b where b.ejdmGlzd=?1 and b.ejdm=?2", nativeQuery = true)
	public List<Edu000> queryEjdmByGroupAndValue(String groupName, String value);
	
	//根据培养层次查校区名称
	@Query(value = "select e.ejdmz from edu000 e where e.ejdmGlzd='xq' and e.ejdm=?1", nativeQuery = true)
	public String queryXqmcByPyccbm(String xqbm);

}
