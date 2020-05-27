package com.beifen.edu.administration.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu991;

public interface Edu991Dao extends JpaRepository<Edu991, Long>, JpaSpecificationExecutor<Edu991> {
	// 根据角色获取权限信息
	@Query(value = "select * from edu991 e where e.js=?1", nativeQuery = true)
	public Edu991 getAuthoritysInfo(String js);
	
	//删除角色
	@Transactional
	@Modifying
	@Query(value = "delete from edu991 where Bf991_ID =?1", nativeQuery = true)
	public void removeRole(String bf991_ID);
}
