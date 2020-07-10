package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu106;

public interface Edu106Dao extends JpaRepository<Edu106, Long>, JpaSpecificationExecutor<Edu106> {

	// 查询二级代码
	@Query(value = "select * from edu106", nativeQuery = true)
	public List<Edu106> queryAllMajor();

	// 根据id删除专业
	@Transactional
	@Modifying
	@Query(value = "delete from edu106 where Edu106_ID =?1", nativeQuery = true)
	public void removeGrade(String edu106ID);

	//按专业id查专业
	@Query(value = "select * from edu106 where zybm =?1", nativeQuery = true)
	public List<Edu106> queryAllMajorByZybm(String zybm);
	
	//按专业名称查专业编码
	@Query(value = "select e.zybm from edu106 e where e.zymc =?1", nativeQuery = true)
	public String queryZyCodeByZyName(String zymc);

	@Query(value = "select * from edu106 where Edu106_ID =?1", nativeQuery = true)
	public Edu106 query105BYID(String edu106id);

}
