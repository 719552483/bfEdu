package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu104;

public interface Edu104Dao extends JpaRepository<Edu104, Long>, JpaSpecificationExecutor<Edu104> {

	// 查询系部
	@Query(value = "select * from edu104", nativeQuery = true)
	public List<Edu104> queryAllDepartment();

	// 根据id删除系部
	@Transactional
	@Modifying
	@Query(value = "delete from edu104 where Edu104_ID =?1", nativeQuery = true)
	public void removeDeaparment(String edu104ID);

	// 根据id查系部
	@Query(value = "select * from edu104 e  where  e.xbbm =?1", nativeQuery = true)
	public List<Edu104> queryAllDepartmentByXbbm(String xbbm);
	
	

	//按名称查系部编码
	@Query(value = "select e.xbbm from edu104 e  where  e.xbmc =?1", nativeQuery = true)
	public String queryXbCodeByXbName(String xbbm);

	@Query(value = "select * from edu104 where Edu104_ID =?1", nativeQuery = true)
	public Edu104 query104BYID(String edu104id);

}
