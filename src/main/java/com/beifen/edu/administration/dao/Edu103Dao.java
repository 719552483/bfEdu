package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu103;

public interface Edu103Dao extends JpaRepository<Edu103, Long>, JpaSpecificationExecutor<Edu103> {

	// 查询所有培养层次
	@Query(value = "select * from edu103", nativeQuery = true)
	public List<Edu103> queryAllLevel();

	// 根据id删除培养层次
	@Transactional
	@Modifying
	@Query(value = "delete from edu103 where Edu103_ID =?1", nativeQuery = true)
	public void removeLevel(String edu103ID);
}
