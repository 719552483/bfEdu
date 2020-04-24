package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu001;

public interface Edu001Dao extends JpaRepository<Edu001, Long>,JpaSpecificationExecutor<Edu001> {

	// 查询所有学生编码
	@Query(value = "select * from  edu001", nativeQuery = true)
	public List<Edu001> queryAllDiseases();

	// 删除学生
	@Transactional
	@Modifying
	@Query(value = "delete from edu001 where edu001_id =?1", nativeQuery = true)
	void deleteDiseaseCodeing(String bf003_id);

	// 按条件搜索学生
	@Query(value = "select * from edu001 b where b.xh like ?1%", nativeQuery = true)
	public List<Edu001> queryAllDiseasesByCodeing(String SearchCriteria);
}
