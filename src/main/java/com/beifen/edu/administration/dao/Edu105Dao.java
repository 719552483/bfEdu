package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu105;

public interface Edu105Dao extends JpaRepository<Edu105, Long>, JpaSpecificationExecutor<Edu105> {

	// 查询二级代码
	@Query(value = "select * from edu105", nativeQuery = true)
	public List<Edu105> queryAllGrade();

	// 根据id删除年级
	@Transactional
	@Modifying
	@Query(value = "delete from edu105 where Edu105_ID =?1", nativeQuery = true)
	public void removeGrade(String edu105ID);

	//按年级id查年级
	@Query(value = "select * from edu105 where Edu105_ID =?1", nativeQuery = true)
	public List<Edu105> queryAllGradeByNjbm(String Edu105_ID);
	
	// 按年级名称查年级编码
	@Query(value = "select e.Edu105_ID from edu105 e where e.njmc =?1", nativeQuery = true)
	public String queryNjCodeByNjName(String njmc);

	@Query(value = "select * from edu105 where Edu105_ID =?1", nativeQuery = true)
	public Edu105 query105BYID(String edu105id);

}
