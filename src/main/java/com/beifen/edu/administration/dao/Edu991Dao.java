package com.beifen.edu.administration.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu991;

public interface Edu991Dao extends JpaRepository<Edu991, Long>, JpaSpecificationExecutor<Edu991> {
	// 根据角色获取权限信息
	@Query(value = "select * from edu991 e where e.js=?1", nativeQuery = true)
	public Edu991 getAuthoritysInfo(String js);
}
