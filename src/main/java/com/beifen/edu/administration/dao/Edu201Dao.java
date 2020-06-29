package com.beifen.edu.administration.dao;

import javax.transaction.Transactional;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu201;

@Configuration
public interface Edu201Dao extends JpaRepository<Edu201, Long>, JpaSpecificationExecutor<Edu201> {
	// 根据id任务书
	@Transactional
	@Modifying
	@Query(value = "delete from edu201 where Edu201_ID =?1", nativeQuery = true)
	void removeTasks(String id);

	//根据ID查询任务书
	@Query(value = "select * from edu201 e where e.Edu201_ID=?1", nativeQuery = true)
	public Edu201 queryTaskByID(String iD);
}
